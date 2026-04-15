import { Company, Contact, MOCK_COMPANIES, MOCK_CONTACTS } from "@/data/companies";

export type ICP = {
  industry: string;
  minEmployees: number;
  maxEmployees: number;
  area: string;
};

export type GeneratedRow = {
  company: Company;
  contacts: (Contact & { emailTemplate: string })[];
  score: number;
  priority: "A" | "B" | "C";
  reason: string;
};

// ICPに合致する企業を抽出（Musubu/Akala Listの代替）
export function filterCompanies(icp: ICP): Company[] {
  return MOCK_COMPANIES.filter((c) => {
    if (icp.industry && icp.industry !== "全て" && c.industry !== icp.industry) return false;
    if (c.employees < icp.minEmployees || c.employees > icp.maxEmployees) return false;
    if (icp.area && icp.area !== "全て" && c.area !== icp.area) return false;
    return true;
  });
}

// 担当者を取得（Musubu/Sansanの代替）
export function getContactsForCompany(companyId: string): Contact[] {
  return MOCK_CONTACTS.filter((c) => c.companyId === companyId);
}

// ICP合致度スコアリング（Claude APIの代替）
function scoreCompany(c: Company, icp: ICP): { score: number; reason: string } {
  let score = 50;
  const reasons: string[] = [];
  const empCenter = (icp.minEmployees + icp.maxEmployees) / 2;
  const empFit = 1 - Math.abs(c.employees - empCenter) / empCenter;
  score += empFit * 20;
  if (empFit > 0.7) reasons.push("従業員規模がICP中心値と合致");

  if (c.challenges.some((ch) => ch.includes("営業") || ch.includes("インサイド") || ch.includes("ABM"))) {
    score += 20;
    reasons.push("営業課題が明確で提案余地が大きい");
  }
  if (c.revenue >= 30) {
    score += 10;
    reasons.push("売上規模が十分で予算確保可能性あり");
  }

  return { score: Math.min(100, Math.round(score)), reason: reasons.join(" / ") || "ICP基本条件に合致" };
}

// 個社別の営業文面を生成（Claude APIの代替）
function generateEmailTemplate(company: Company, contact: Contact): string {
  const challenge = company.challenges[0] || "営業効率化";
  return `件名：【${company.name}様】${challenge}に関するご提案のご相談

${contact.department} ${contact.title} ${contact.name}様

突然のご連絡失礼いたします。
株式会社プロセルトラクションの営業担当でございます。

貴社の事業内容（${company.description}）を拝見し、
特に「${challenge}」の課題について、弊社の営業代行・AI活用支援が
お役に立てる可能性があると考え、ご連絡差し上げました。

同業界の${company.industry}企業様において、以下のような実績がございます：
・インサイドセールスの商談化率 1.8倍
・新規開拓の工数 60%削減
・ターゲティング精度の定量化

15分程度のご説明機会をいただけますと幸いです。
オンライン面談も可能ですので、ご都合の良い日時をお聞かせください。

株式会社プロセルトラクション`;
}

export async function generateList(icp: ICP): Promise<GeneratedRow[]> {
  const companies = filterCompanies(icp);
  const rows: GeneratedRow[] = companies.map((c) => {
    const { score, reason } = scoreCompany(c, icp);
    const priority: "A" | "B" | "C" = score >= 85 ? "A" : score >= 70 ? "B" : "C";
    const contacts = getContactsForCompany(c.id).map((ct) => ({
      ...ct,
      emailTemplate: generateEmailTemplate(c, ct),
    }));
    return { company: c, contacts, score, priority, reason };
  });
  return rows.sort((a, b) => b.score - a.score);
}
