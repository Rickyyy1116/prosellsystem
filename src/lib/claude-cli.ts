import { spawn } from "child_process";
import { existsSync } from "fs";
import os from "os";
import path from "path";

const CLAUDE_BIN = (() => {
  const candidates = [
    process.env.CLAUDE_BIN,
    path.join(os.homedir(), ".local/bin/claude"),
    path.join(os.homedir(), "bin/claude"),
    "/opt/homebrew/bin/claude",
    "/usr/local/bin/claude",
  ].filter(Boolean) as string[];
  return candidates.find((p) => existsSync(p)) || "claude";
})();

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
  if (opts.jsonSchema) {
    args.push("--json-schema", JSON.stringify(opts.jsonSchema));
  }
  if (opts.allowedTools && opts.allowedTools.length > 0) {
    args.push("--allowedTools", ...opts.allowedTools);
  }

  return await new Promise<string>((resolve, reject) => {
    const child = spawn(CLAUDE_BIN, args, { env: process.env, stdio: ["pipe", "pipe", "pipe"] });
    child.stdin.write(opts.prompt);
    child.stdin.end();
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
