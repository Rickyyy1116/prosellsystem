import { promises as fs } from "fs";
import path from "path";

export type Product = {
  id: string;
  name: string;
  category: string;
  targetIndustries: string[];
  solvedChallenges: string[];
  priceRange: string;
  track: string;
  pitchPoints: string[];
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    const seed: Product[] = [
      {
        id: "p001",
        name: "営業代行サービス（インサイドセールス特化）",
        category: "営業代行",
        targetIndustries: ["人材サービス", "広告・マーケティング", "SaaS"],
        solvedChallenges: ["営業人員不足", "新規開拓の効率化", "商談化率の低下"],
        priceRange: "月額50〜150万円",
        track: "同業界平均で商談化率1.8倍、新規開拓工数60%削減の実績",
        pitchPoints: [
          "貴社専属のインサイドセールスチームを即時立ち上げ",
          "業界特化型のトークスクリプトをAIで自動生成",
          "商談化率・アポ単価をリアルタイムダッシュボードで可視化",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "p002",
        name: "AI顧問サービス",
        category: "AIコンサルティング",
        targetIndustries: ["人材サービス", "広告・マーケティング", "金融", "製造"],
        solvedChallenges: ["AI活用の進め方がわからない", "生産性向上", "属人化解消"],
        priceRange: "月額10〜30万円",
        track: "導入企業平均で業務時間30%削減、新規事業立ち上げ期間半減",
        pitchPoints: [
          "経営者・役員層へ直接AI活用の道筋を提言",
          "社内業務の棚卸しからAI実装まで伴走支援",
          "毎月の定例会で進捗レビュー＋次月アクション設計",
        ],
        createdAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export async function listProducts(): Promise<Product[]> {
  await ensureFile();
  const raw = await fs.readFile(PRODUCTS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function getProduct(id: string): Promise<Product | null> {
  const all = await listProducts();
  return all.find((p) => p.id === id) || null;
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const all = await listProducts();
  const p: Product = {
    ...input,
    id: `p_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(p);
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(all, null, 2), "utf-8");
  return p;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
  const all = await listProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, id };
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(all, null, 2), "utf-8");
  return all[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = await listProducts();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
