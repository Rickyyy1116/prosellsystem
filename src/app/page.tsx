"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import type { ResearchResult } from "@/app/api/research/route";
import type { GeneratedContact } from "@/app/api/contacts/route";

type Row = {
  companyName: string;
  status: "pending" | "researching" | "contacts" | "done" | "error";
  research?: ResearchResult;
  contacts?: (GeneratedContact & { script?: string; email?: string; loading?: boolean })[];
  error?: string;
};

const SAMPLE = `株式会社リクルート
株式会社キャディ
マネーフォワード株式会社`;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [companyNames, setCompanyNames] = useState(SAMPLE);
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [openCompany, setOpenCompany] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products);
        if (d.products[0]) setProductId(d.products[0].id);
      });
  }, []);

  const product = products.find((p) => p.id === productId);

  const handleGenerate = async () => {
    const names = companyNames.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return alert("企業名を入力してください");
    if (!productId) return alert("商品を選択してください");
    setRunning(true);
    const initial: Row[] = names.map((n) => ({ companyName: n, status: "pending" }));
    setRows(initial);

    for (let i = 0; i < names.length; i++) {
      setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "researching" } : r)));
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName: names[i] }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "リサーチ失敗");
        const research = (await res.json()) as ResearchResult;
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, research, status: "contacts" } : r)));

        const cRes = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ research }),
        });
        if (!cRes.ok) throw new Error((await cRes.json()).error || "担当者生成失敗");
        const { contacts } = (await cRes.json()) as { contacts: GeneratedContact[] };
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, contacts, status: "done" } : r)));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "error", error: msg } : r)));
      }
    }
    setRunning(false);
  };

  const generateContent = async (rowIdx: number, contactIdx: number, mode: "script" | "email") => {
    const row = rows[rowIdx];
    if (!row.research || !row.contacts) return;
    const ct = row.contacts[contactIdx];
    setRows((prev) =>
      prev.map((r, i) =>
        i === rowIdx ? { ...r, contacts: r.contacts!.map((c, j) => (j === contactIdx ? { ...c, loading: true } : c)) } : r
      )
    );
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          research: row.research,
          productId,
          role: ct.role,
          department: ct.department,
          title: ct.title,
          name: ct.name,
          mode,
        }),
      });
      const { content } = await res.json();
      setRows((prev) =>
        prev.map((r, i) =>
          i === rowIdx
            ? {
                ...r,
                contacts: r.contacts!.map((c, j) =>
                  j === contactIdx ? { ...c, loading: false, [mode]: content } : c
                ),
              }
            : r
        )
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(msg);
      setRows((prev) =>
        prev.map((r, i) =>
          i === rowIdx ? { ...r, contacts: r.contacts!.map((c, j) => (j === contactIdx ? { ...c, loading: false } : c)) } : r
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white px-8 py-5 shadow flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Prosell 営業リスト自動生成システム <span className="text-sm font-normal text-slate-300">PoC</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">企業名を入力→実際にWeb検索でリサーチ→担当者推定→商品に合わせたトークスクリプト/メール生成</p>
        </div>
        <Link href="/products" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">商品マスタ →</Link>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs mr-2">1</span>
              販売したい商品を選択
            </label>
            <div className="flex gap-2">
              <select className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">-- 商品を選択 --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{p.category}）
                  </option>
                ))}
              </select>
              <Link href="/products" className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg whitespace-nowrap">マスタ管理</Link>
            </div>
            {product && (
              <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs">
                <div><b>解決できる課題:</b> {product.solvedChallenges.join(", ")}</div>
                <div><b>実績:</b> {product.track}</div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs mr-2">2</span>
              アプローチしたい企業名を入力（1行1社）
            </label>
            <textarea
              value={companyNames}
              onChange={(e) => setCompanyNames(e.target.value)}
              rows={6}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <button disabled={running || !productId} onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-lg shadow">
            {running ? "生成中..." : "リサーチ＆リスト生成を開始"}
          </button>
        </section>

        {rows.length > 0 && (
          <section className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold">生成結果</h2>
              <p className="text-xs text-slate-500 mt-1">各社をクリックすると詳細表示。担当者ごとに「トークスクリプト生成」「メール生成」を実行できます。</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <li key={i}>
                  <button onClick={() => setOpenCompany(openCompany === i ? null : i)} className="w-full text-left px-6 py-4 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{r.companyName}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {r.status === "pending" && "⏳ 待機中"}
                        {r.status === "researching" && "🔍 Web検索でリサーチ中...（Claude Code + WebSearch）"}
                        {r.status === "contacts" && "👥 担当者候補を生成中..."}
                        {r.status === "done" && r.research && (
                          <span>
                            ✅ {r.research.industry} / {r.research.employeesEstimate} / {r.research.headquarters} / 担当者{r.contacts?.length || 0}名
                          </span>
                        )}
                        {r.status === "error" && <span className="text-red-600">❌ {r.error}</span>}
                      </div>
                    </div>
                    {r.status === "done" && <span className="text-blue-600 text-sm">{openCompany === i ? "▲" : "▼"}</span>}
                  </button>

                  {openCompany === i && r.status === "done" && r.research && r.contacts && (
                    <div className="bg-slate-50 px-6 py-5 space-y-5 border-t border-slate-200">
                      <div>
                        <h3 className="font-bold text-sm mb-2">📊 リサーチ結果</h3>
                        <div className="bg-white rounded-lg p-4 space-y-2 text-xs">
                          <div><b>事業内容:</b> {r.research.businessDescription}</div>
                          <div><b>本社:</b> {r.research.headquarters} / <b>従業員:</b> {r.research.employeesEstimate} / <b>売上:</b> {r.research.revenueEstimate}</div>
                          <div><b>最近のニュース:</b>
                            <ul className="list-disc ml-5 mt-1">{r.research.recentNews?.slice(0, 3).map((n, k) => <li key={k}>{n}</li>)}</ul>
                          </div>
                          <div><b>想定課題:</b> {r.research.estimatedChallenges?.join(" / ")}</div>
                          <div><b>キー部署:</b> {r.research.keyDepartments?.join(" / ")}</div>
                          <div><b>公式サイト:</b> {r.research.officialUrl ? <a href={r.research.officialUrl} target="_blank" className="text-blue-600 underline">{r.research.officialUrl}</a> : "不明"}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm mb-2">👥 担当者候補</h3>
                        <div className="space-y-3">
                          {r.contacts.map((ct, j) => (
                            <div key={j} className="bg-white rounded-lg border border-slate-200 p-4">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ct.role === "決裁者" ? "bg-red-100 text-red-700" : ct.role === "キーマン" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{ct.role}</span>
                                <span className="font-semibold">{ct.name}</span>
                                <span className="text-sm text-slate-500">{ct.department} / {ct.title}</span>
                              </div>
                              <div className="text-xs text-slate-500 mb-3">{ct.email} / {ct.phone}</div>
                              <div className="flex gap-2 mb-3">
                                <button onClick={() => generateContent(i, j, "script")} disabled={ct.loading} className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-3 py-1.5 rounded">
                                  {ct.loading ? "生成中..." : "📞 トークスクリプト生成"}
                                </button>
                                <button onClick={() => generateContent(i, j, "email")} disabled={ct.loading} className="text-xs bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white px-3 py-1.5 rounded">
                                  {ct.loading ? "生成中..." : "✉️ メール生成"}
                                </button>
                              </div>
                              {ct.script && (
                                <details open className="mb-2">
                                  <summary className="cursor-pointer text-xs font-bold text-slate-700">📞 トークスクリプト</summary>
                                  <pre className="bg-slate-50 border border-slate-200 rounded p-3 mt-1 text-xs whitespace-pre-wrap font-sans">{ct.script}</pre>
                                </details>
                              )}
                              {ct.email && (
                                <details open>
                                  <summary className="cursor-pointer text-xs font-bold text-slate-700">✉️ メール文面</summary>
                                  <pre className="bg-slate-50 border border-slate-200 rounded p-3 mt-1 text-xs whitespace-pre-wrap font-sans">{ct.email}</pre>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
