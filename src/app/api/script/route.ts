import { NextRequest, NextResponse } from "next/server";
import { runClaude } from "@/lib/claude-cli";
import { getProduct } from "@/lib/products";
import type { ResearchResult } from "@/app/api/research/route";

export const maxDuration = 180;

type ScriptRequest = {
  research: ResearchResult;
  productId: string;
  role: "決裁者" | "キーマン" | "情報提供者";
  department?: string;
  title?: string;
  name?: string;
  mode: "script" | "email";
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ScriptRequest;
  const product = await getProduct(body.productId);
  if (!product) return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });

  const target = body.name
    ? `${body.department || ""} ${body.title || ""} ${body.name} 様（${body.role}）`
    : `${body.role}クラスの方`;

  const common = `
【リサーチ結果（貴社が調べた実在企業の情報）】
・企業名: ${body.research.companyName}
・業界: ${body.research.industry}
・事業内容: ${body.research.businessDescription}
・従業員規模: ${body.research.employeesEstimate}
・売上規模: ${body.research.revenueEstimate}
・本社: ${body.research.headquarters}
・最近のニュース: ${(body.research.recentNews || []).join(" / ")}
・想定課題: ${(body.research.estimatedChallenges || []).join(" / ")}

【販売したい商品（貴社の商品）】
・商品名: ${product.name}
・カテゴリ: ${product.category}
・ターゲット業界: ${product.targetIndustries.join(", ")}
・解決できる課題: ${product.solvedChallenges.join(", ")}
・価格帯: ${product.priceRange}
・実績: ${product.track}
・訴求ポイント: ${product.pitchPoints.map((p, i) => `(${i + 1}) ${p}`).join(" ")}

【アプローチ先の担当者】
${target}
`;

  const prompt =
    body.mode === "script"
      ? `あなたは日本のトップ営業です。以下の情報を元に、${body.research.companyName}へのテレアポ用トークスクリプトを作成してください。

${common}

【出力要件】
以下の6セクションで構成してください。企業のリサーチ結果と商品情報を自然に織り込み、画一的ではなく「この企業・この担当者に向けた」トークにしてください。最近のニュースに言及できる場合は積極的に使ってください。

■ ① 受付突破（取次依頼）
■ ② 冒頭挨拶（15秒以内）
■ ③ フック（興味喚起・30秒）- リサーチで分かった課題や最近の動向に触れる
■ ④ ヒアリング（会話誘導・3問）
■ ⑤ クロージング（アポ打診）
■ ⑥ 想定切り返しQ&A（3パターン）

装飾の罫線は不要。プレーンなテキストで、各セクションを空行で区切ってください。`
      : `あなたは日本のトップ営業です。以下の情報を元に、${body.research.companyName}への営業メール文面を作成してください。

${common}

【出力要件】
・件名（企業名と課題を含む）
・宛名（部署・役職・氏名）
・冒頭挨拶（1段落）
・自社紹介と連絡理由（リサーチ結果の課題に触れる）
・商品の訴求（解決できる課題・実績・訴求ポイントを使う）
・アポ打診（15〜30分のオンライン面談）
・署名

プレーンテキストで出力してください。`;

  try {
    const text = await runClaude({ prompt, timeoutMs: 150000 });
    return NextResponse.json({ content: text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
