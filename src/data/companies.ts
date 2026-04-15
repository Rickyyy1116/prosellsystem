// 架空の企業データ（Musubu/Sansan/Akala List の代替モック）
export type Company = {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: number; // 億円
  area: string;
  url: string;
  description: string;
  challenges: string[];
};

export type Contact = {
  companyId: string;
  name: string;
  department: string;
  title: string;
  email: string;
  phone: string;
  role: "決裁者" | "キーマン" | "情報提供者";
};

export const MOCK_COMPANIES: Company[] = [
  {
    id: "c001",
    name: "株式会社リクルートキャリアネクスト",
    industry: "人材サービス",
    employees: 320,
    revenue: 48,
    area: "東京",
    url: "https://example-recruit-next.co.jp",
    description: "中小企業向け採用支援サービスを展開。IT人材紹介が主力。",
    challenges: ["営業人員不足", "新規開拓の効率化", "ターゲティング精度"],
  },
  {
    id: "c002",
    name: "マイナビテックソリューション株式会社",
    industry: "人材サービス",
    employees: 180,
    revenue: 22,
    area: "東京",
    url: "https://example-mynavitech.co.jp",
    description: "エンジニア派遣・受託開発のハイブリッド事業。",
    challenges: ["商談化率の低下", "インサイドセールス立ち上げ"],
  },
  {
    id: "c003",
    name: "株式会社パーソルHRパートナーズ",
    industry: "人材サービス",
    employees: 450,
    revenue: 75,
    area: "東京",
    url: "https://example-persol-hr.co.jp",
    description: "BPO・RPOを中心とした人事アウトソーシング。",
    challenges: ["大手顧客のリプレース営業", "業界特化の提案力強化"],
  },
  {
    id: "c004",
    name: "JAC採用コンサルティング株式会社",
    industry: "人材サービス",
    employees: 220,
    revenue: 38,
    area: "東京",
    url: "https://example-jac-consulting.co.jp",
    description: "ハイクラス人材紹介・エグゼクティブサーチ。",
    challenges: ["法人営業のデジタル化", "ICP明確化"],
  },
  {
    id: "c005",
    name: "株式会社ビズリーチソリューションズ",
    industry: "人材サービス",
    employees: 290,
    revenue: 52,
    area: "東京",
    url: "https://example-bizreach-sol.co.jp",
    description: "ダイレクトリクルーティングSaaS＋導入支援。",
    challenges: ["大型案件のABM", "カスタマーサクセス人材獲得"],
  },
  {
    id: "c006",
    name: "株式会社ディップキャリアワークス",
    industry: "人材サービス",
    employees: 410,
    revenue: 68,
    area: "東京",
    url: "https://example-dip-career.co.jp",
    description: "アルバイト求人メディア＋派遣事業。",
    challenges: ["営業生産性向上", "広告営業とのクロスセル"],
  },
  {
    id: "c007",
    name: "株式会社ネオキャリアサポート",
    industry: "人材サービス",
    employees: 260,
    revenue: 35,
    area: "東京",
    url: "https://example-neocareer.co.jp",
    description: "新卒紹介・中途紹介の総合人材サービス。",
    challenges: ["新規営業の効率化", "商談後のフォロー属人化"],
  },
  {
    id: "c008",
    name: "株式会社レバテックプロフェッショナル",
    industry: "人材サービス",
    employees: 150,
    revenue: 19,
    area: "東京",
    url: "https://example-levtech-pro.co.jp",
    description: "ITフリーランス・エンジニア特化の人材紹介。",
    challenges: ["法人開拓", "決裁者接点不足"],
  },
  {
    id: "c009",
    name: "株式会社エン・ジャパンアドバンス",
    industry: "人材サービス",
    employees: 380,
    revenue: 62,
    area: "東京",
    url: "https://example-en-advance.co.jp",
    description: "求人広告＋人材紹介のハイブリッド。",
    challenges: ["アウトバウンド強化", "提案資料の個社カスタマイズ"],
  },
  {
    id: "c010",
    name: "株式会社ワークポートエージェンシー",
    industry: "人材サービス",
    employees: 200,
    revenue: 28,
    area: "東京",
    url: "https://example-workport.co.jp",
    description: "IT・Web特化の転職エージェント。",
    challenges: ["テレアポのスクリプト精度", "商談化率改善"],
  },
  {
    id: "c011",
    name: "株式会社リクルートマーケティングプロ",
    industry: "広告・マーケティング",
    employees: 520,
    revenue: 95,
    area: "東京",
    url: "https://example-recruit-mkt.co.jp",
    description: "デジタルマーケティング支援・広告運用代行。",
    challenges: ["BtoB営業の立ち上げ", "新サービスの市場検証"],
  },
  {
    id: "c012",
    name: "株式会社サイバーエージェントダイレクト",
    industry: "広告・マーケティング",
    employees: 340,
    revenue: 58,
    area: "東京",
    url: "https://example-ca-direct.co.jp",
    description: "運用型広告＋クリエイティブ制作。",
    challenges: ["大手顧客の深耕", "ABM型営業の構築"],
  },
  {
    id: "c013",
    name: "株式会社博報堂DXソリューションズ",
    industry: "広告・マーケティング",
    employees: 480,
    revenue: 88,
    area: "東京",
    url: "https://example-hakuhodo-dx.co.jp",
    description: "DX支援＋マーケティングコンサルティング。",
    challenges: ["提案リソース逼迫", "商談準備の効率化"],
  },
  {
    id: "c014",
    name: "株式会社セプテーニ・グロースパートナーズ",
    industry: "広告・マーケティング",
    employees: 210,
    revenue: 32,
    area: "東京",
    url: "https://example-septeni-gp.co.jp",
    description: "中小企業向けデジタル広告＋SaaS販売。",
    challenges: ["インサイドセールス立ち上げ", "リード獲得効率"],
  },
  {
    id: "c015",
    name: "株式会社電通デジタルアドバンス",
    industry: "広告・マーケティング",
    employees: 430,
    revenue: 72,
    area: "東京",
    url: "https://example-dentsu-adv.co.jp",
    description: "デジタル変革支援・広告テクノロジー。",
    challenges: ["大型案件のキーマン特定", "競合差別化の明確化"],
  },
];

export const MOCK_CONTACTS: Contact[] = [
  // c001
  { companyId: "c001", name: "田中 健一", department: "営業本部", title: "営業本部長", email: "tanaka.k@example-recruit-next.co.jp", phone: "03-1001-0001", role: "決裁者" },
  { companyId: "c001", name: "佐藤 美咲", department: "営業企画部", title: "部長", email: "sato.m@example-recruit-next.co.jp", phone: "03-1001-0002", role: "キーマン" },
  { companyId: "c001", name: "鈴木 大輔", department: "インサイドセールス部", title: "マネージャー", email: "suzuki.d@example-recruit-next.co.jp", phone: "03-1001-0003", role: "情報提供者" },
  // c002
  { companyId: "c002", name: "山本 翔太", department: "事業開発部", title: "執行役員", email: "yamamoto.s@example-mynavitech.co.jp", phone: "03-1002-0001", role: "決裁者" },
  { companyId: "c002", name: "中村 彩花", department: "営業推進部", title: "部長", email: "nakamura.a@example-mynavitech.co.jp", phone: "03-1002-0002", role: "キーマン" },
  // c003
  { companyId: "c003", name: "小林 康弘", department: "BPO事業本部", title: "本部長", email: "kobayashi.y@example-persol-hr.co.jp", phone: "03-1003-0001", role: "決裁者" },
  { companyId: "c003", name: "加藤 理恵", department: "営業統括部", title: "次長", email: "kato.r@example-persol-hr.co.jp", phone: "03-1003-0002", role: "キーマン" },
  { companyId: "c003", name: "吉田 拓海", department: "マーケティング部", title: "マネージャー", email: "yoshida.t@example-persol-hr.co.jp", phone: "03-1003-0003", role: "情報提供者" },
  // c004
  { companyId: "c004", name: "伊藤 洋平", department: "エグゼクティブサーチ事業部", title: "事業部長", email: "ito.y@example-jac-consulting.co.jp", phone: "03-1004-0001", role: "決裁者" },
  { companyId: "c004", name: "渡辺 優子", department: "法人営業部", title: "部長", email: "watanabe.y@example-jac-consulting.co.jp", phone: "03-1004-0002", role: "キーマン" },
  // c005
  { companyId: "c005", name: "高橋 啓介", department: "カスタマーサクセス本部", title: "本部長", email: "takahashi.k@example-bizreach-sol.co.jp", phone: "03-1005-0001", role: "決裁者" },
  { companyId: "c005", name: "松本 沙織", department: "エンタープライズ営業部", title: "部長", email: "matsumoto.s@example-bizreach-sol.co.jp", phone: "03-1005-0002", role: "キーマン" },
  // c006
  { companyId: "c006", name: "森 隆司", department: "営業本部", title: "取締役本部長", email: "mori.t@example-dip-career.co.jp", phone: "03-1006-0001", role: "決裁者" },
  { companyId: "c006", name: "林 奈々", department: "営業企画部", title: "部長", email: "hayashi.n@example-dip-career.co.jp", phone: "03-1006-0002", role: "キーマン" },
  // c007
  { companyId: "c007", name: "清水 翔", department: "事業統括部", title: "執行役員", email: "shimizu.s@example-neocareer.co.jp", phone: "03-1007-0001", role: "決裁者" },
  { companyId: "c007", name: "青木 由美", department: "新規事業開発部", title: "部長", email: "aoki.y@example-neocareer.co.jp", phone: "03-1007-0002", role: "キーマン" },
  // c008
  { companyId: "c008", name: "岡田 直樹", department: "事業本部", title: "執行役員", email: "okada.n@example-levtech-pro.co.jp", phone: "03-1008-0001", role: "決裁者" },
  { companyId: "c008", name: "村上 咲", department: "法人営業部", title: "マネージャー", email: "murakami.s@example-levtech-pro.co.jp", phone: "03-1008-0002", role: "キーマン" },
  // c009
  { companyId: "c009", name: "石川 智和", department: "営業本部", title: "本部長", email: "ishikawa.t@example-en-advance.co.jp", phone: "03-1009-0001", role: "決裁者" },
  { companyId: "c009", name: "前田 花子", department: "アカウント営業部", title: "部長", email: "maeda.h@example-en-advance.co.jp", phone: "03-1009-0002", role: "キーマン" },
  // c010
  { companyId: "c010", name: "藤田 亮太", department: "事業開発部", title: "部長", email: "fujita.r@example-workport.co.jp", phone: "03-1010-0001", role: "決裁者" },
  { companyId: "c010", name: "西村 結衣", department: "インサイドセールス部", title: "リーダー", email: "nishimura.y@example-workport.co.jp", phone: "03-1010-0002", role: "情報提供者" },
  // c011-c015 (マーケ系)
  { companyId: "c011", name: "竹内 祐介", department: "BtoB事業本部", title: "本部長", email: "takeuchi.y@example-recruit-mkt.co.jp", phone: "03-1011-0001", role: "決裁者" },
  { companyId: "c011", name: "原田 奈緒", department: "営業推進部", title: "部長", email: "harada.n@example-recruit-mkt.co.jp", phone: "03-1011-0002", role: "キーマン" },
  { companyId: "c012", name: "横山 慎", department: "アカウント本部", title: "本部長", email: "yokoyama.s@example-ca-direct.co.jp", phone: "03-1012-0001", role: "決裁者" },
  { companyId: "c012", name: "宮崎 麗奈", department: "エンタープライズ営業部", title: "部長", email: "miyazaki.r@example-ca-direct.co.jp", phone: "03-1012-0002", role: "キーマン" },
  { companyId: "c013", name: "福田 達也", department: "DXコンサルティング部", title: "部長", email: "fukuda.t@example-hakuhodo-dx.co.jp", phone: "03-1013-0001", role: "決裁者" },
  { companyId: "c013", name: "三浦 優奈", department: "提案推進部", title: "マネージャー", email: "miura.y@example-hakuhodo-dx.co.jp", phone: "03-1013-0002", role: "キーマン" },
  { companyId: "c014", name: "橋本 亮", department: "セールス本部", title: "執行役員", email: "hashimoto.r@example-septeni-gp.co.jp", phone: "03-1014-0001", role: "決裁者" },
  { companyId: "c014", name: "新井 里奈", department: "インサイドセールス部", title: "部長", email: "arai.r@example-septeni-gp.co.jp", phone: "03-1014-0002", role: "キーマン" },
  { companyId: "c015", name: "内田 翔平", department: "エンタープライズ事業部", title: "事業部長", email: "uchida.s@example-dentsu-adv.co.jp", phone: "03-1015-0001", role: "決裁者" },
  { companyId: "c015", name: "長谷川 真央", department: "アカウントプランニング部", title: "部長", email: "hasegawa.m@example-dentsu-adv.co.jp", phone: "03-1015-0002", role: "キーマン" },
];
