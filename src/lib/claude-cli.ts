import { spawn } from "child_process";

export type ClaudeOptions = {
  prompt: string;
  allowedTools?: string[];
  jsonSchema?: object;
  timeoutMs?: number;
};

/**
 * Claude Code のサブスクリプションを使って推論を実行する。
 * サブプロセスで `claude -p` を呼び出す。API キー不要。
 */
export async function runClaude(opts: ClaudeOptions): Promise<string> {
  const args = ["-p", "--output-format", "json"];
  if (opts.allowedTools && opts.allowedTools.length > 0) {
    args.push("--allowedTools", opts.allowedTools.join(" "));
  }
  if (opts.jsonSchema) {
    args.push("--json-schema", JSON.stringify(opts.jsonSchema));
  }
  args.push(opts.prompt);

  return await new Promise<string>((resolve, reject) => {
    const child = spawn("claude", args, { env: process.env });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Claude CLI timeout (${opts.timeoutMs || 120000}ms)`));
    }, opts.timeoutMs || 120000);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`Claude CLI exit ${code}: ${stderr}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.is_error) {
          reject(new Error(`Claude CLI error: ${parsed.result || stderr}`));
          return;
        }
        resolve(parsed.result || "");
      } catch {
        resolve(stdout);
      }
    });
  });
}

/**
 * Claude の出力から JSON オブジェクトを安全に抽出する。
 * ```json ... ``` ブロックや、周辺テキストを除去する。
 */
export function extractJSON<T = unknown>(text: string): T {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text;
  const firstBrace = raw.indexOf("{");
  const firstBracket = raw.indexOf("[");
  const start =
    firstBrace === -1 ? firstBracket : firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket);
  if (start === -1) throw new Error("JSONが見つかりません: " + text.slice(0, 200));
  const sliced = raw.slice(start);
  const lastBrace = sliced.lastIndexOf("}");
  const lastBracket = sliced.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);
  if (end === -1) throw new Error("JSONの終端が見つかりません");
  return JSON.parse(sliced.slice(0, end + 1)) as T;
}
