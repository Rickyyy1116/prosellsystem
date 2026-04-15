import { NextRequest, NextResponse } from "next/server";
import { runClaude, extractJSON } from "@/lib/claude-cli";

export const maxDuration = 180;

export type ResearchResult = {
  companyName: string;
  industry: string;
  businessDescription: string;
  employeesEstimate: string;
  revenueEstimate: string;
  headquarters: string;
  recentNews: string[];
  estimatedChallenges: string[];
  keyDepartments: string[];
  officialUrl: string;
  sources: string[];
};

export async function POST(req: NextRequest) {
  const { companyName } = await req.json();
  if (!companyName) return NextResponse.json({ error: "companyName required" }, { status: 400 });

  const prompt = `あなたは日本の法人営業のリサーチャーです。以下の企業について公開情報（Web検索）で調べ、JSON形式で返してください。

企業名: ${companyName}

必ず WebSearch を使って実際に検索し、最新の公開情報に基づいて回答してください。
情報が見つからない項目は "不明" と記載してください。推測で埋めないでください。

以下のJSONスキーマで返してください（他のテキストは不要、JSONのみ）:
{
  "companyName": "正式な企業名",
  "industry": "業界（例: 人材サービス、SaaS、製造業）",
  "businessDescription": "事業内容の1〜2文の要約",
  "employeesEstimate": "従業員数の推定（例: '約300名' '100-500名' '不明'）",
  "revenueEstimate": "売上規模の推定（例: '約50億円' '10-100億円' '不明'）",
  "headquarters": "本社所在地（都道府県レベルでOK）",
  "recentNews": ["最近のニュース・プレスリリース3件程度（箇条書き・日付付き）"],
  "estimatedChallenges": ["この企業が抱えていそうな営業・マーケティング・人事課題を3つ推定"],
  "keyDepartments": ["営業アプローチのキーマンが居そうな部署を3つ"],
  "officialUrl": "公式サイトURL",
  "sources": ["参照したソースのURLを3つまで"]
}`;

  try {
    const text = await runClaude({
      prompt,
      allowedTools: ["WebSearch", "WebFetch"],
      timeoutMs: 150000,
    });
    const result = extractJSON<ResearchResult>(text);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
