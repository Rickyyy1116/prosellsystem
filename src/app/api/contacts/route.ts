import { NextRequest, NextResponse } from "next/server";
import { runClaude, extractJSON } from "@/lib/claude-cli";
import type { ResearchResult } from "@/app/api/research/route";

export const maxDuration = 120;

export type GeneratedContact = {
  name: string;
  department: string;
  title: string;
  email: string;
  phone: string;
  role: "決裁者" | "キーマン" | "情報提供者";
};

export async function POST(req: NextRequest) {
  const { research } = (await req.json()) as { research: ResearchResult };
  const prompt = `あなたは日本の法人営業のターゲット特定エキスパートです。
以下の企業に対してアプローチする場合の、想定される担当者候補（架空でOK・実在人物は出さない）を3名提案してください。

【リサーチ結果】
・企業名: ${research.companyName}
・業界: ${research.industry}
・事業内容: ${research.businessDescription}
・キー部署候補: ${(research.keyDepartments || []).join(", ")}
・想定課題: ${(research.estimatedChallenges || []).join(", ")}

【本番ではMusubu/Sansan API等で実在担当者を取得します。PoCでは"リアルな想定人物像"を生成してください】

必ず以下の3役割を1名ずつ、合計3名提案してください:
1. 決裁者（部長〜役員クラス）
2. キーマン（課長〜マネージャークラスで実務推進役）
3. 情報提供者（担当レベルで情報を持っている人）

以下のJSON配列で返してください（他のテキスト不要）:
[
  {
    "name": "架空の日本人名（姓 名）",
    "department": "具体的な部署名",
    "title": "具体的な役職",
    "email": "ダミーのメール（{姓ローマ字}@{企業名ローマ字}.example.jp の形式）",
    "phone": "03-XXXX-XXXX 形式のダミー",
    "role": "決裁者" | "キーマン" | "情報提供者"
  },
  ...
]`;

  try {
    const text = await runClaude({ prompt, timeoutMs: 90000 });
    const contacts = extractJSON<GeneratedContact[]>(text);
    return NextResponse.json({ contacts });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
