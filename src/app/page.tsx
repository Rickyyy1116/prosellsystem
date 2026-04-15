"use client";

import { useState } from "react";
import type { GeneratedRow } from "@/lib/generator";

const INDUSTRIES = ["全て", "人材サービス", "広告・マーケティング"];
const AREAS = ["全て", "東京", "大阪", "名古屋"];

const STEPS = [
  "① ICP条件で企業DB検索（Musubu相当）",
  "② 企業HP・公開情報の収集（Perplexity相当）",
  "③ 担当者データの取得・分類（Sansan/Akala相当）",
  "④ ICP合致度スコアリング（Claude相当）",
  "⑤ 個社別営業文面の生成（Claude相当）",
  "⑥ スプシ/DBへの書き込み",
];

export default function Home() {
  const [icp, setICP] = useState({
    industry: "人材サービス",
    minEmployees: 100,
    maxEmployees: 500,
    area: "東京",
  });
  const [rows, setRows] = useState<GeneratedRow[]>([]);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [selected, setSelected] = useState<GeneratedRow | null>(null);

  const handleGenerate = async () => {
    setRunning(true);
    setRows([]);
    setSelected(null);
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(icp),
    });
    const data = await res.json();
    setRows(data.rows);
    setRunning(false);
    setCurrentStep(-1);
  };

  const exportCSV = () => {
    const header = ["優先度", "スコア", "企業名", "業界", "従業員", "売上(億)", "部署", "役職", "担当者名", "メール", "電話", "役割"];
    const lines: string[] = [header.join(",")];
    rows.forEach((r) => {
      r.contacts.forEach((ct) => {
        lines.push(
          [r.priority, r.score, r.company.name, r.company.industry, r.company.employees, r.company.revenue, ct.department, ct.title, ct.name, ct.email, ct.phone, ct.role]
            .map((v) => `"${v}"`)
            .join(",")
        );
      });
    });
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prosell_list_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white px-8 py-5 shadow">
        <h1 className="text-2xl font-bold">
          Prosell 営業リスト自動生成システム <span className="text-sm font-normal text-slate-300">PoC</span>
        </h1>
        <p className="text-sm text-slate-300 mt-1">ICP条件を入力するだけで、ターゲット企業・担当者・営業文面を自動生成します</p>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm grid place-items-center">1</span>
            ICP条件を入力
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">業界</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={icp.industry} onChange={(e) => setICP({ ...icp, industry: e.target.value })}>
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">従業員数（下限）</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={icp.minEmployees} onChange={(e) => setICP({ ...icp, minEmployees: +e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">従業員数（上限）</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={icp.maxEmployees} onChange={(e) => setICP({ ...icp, maxEmployees: +e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">エリア</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={icp.area} onChange={(e) => setICP({ ...icp, area: e.target.value })}>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button disabled={running} onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold px-6 py-2.5 rounded-lg shadow transition">
              {running ? "生成中..." : "営業リストを生成"}
            </button>
            {rows.length > 0 && (
              <button onClick={exportCSV} className="bg-white border border-slate-300 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-lg">
                CSVエクスポート
              </button>
            )}
          </div>
        </section>

        {running && (
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">処理進捗</h2>
            <ol className="space-y-2">
              {STEPS.map((s, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${i === currentStep ? "font-bold text-blue-700" : i < currentStep ? "text-slate-500 line-through" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${i < currentStep ? "bg-green-500 text-white" : i === currentStep ? "bg-blue-600 text-white animate-pulse" : "bg-slate-200"}`}>
                    {i < currentStep ? "✓" : i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>
        )}

        {rows.length > 0 && (
          <section className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold">生成結果（{rows.length}社 / {rows.reduce((a, r) => a + r.contacts.length, 0)}名）</h2>
              <div className="text-xs text-slate-500">クリックで詳細表示</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">優先度</th>
                    <th className="px-4 py-3 text-left">スコア</th>
                    <th className="px-4 py-3 text-left">企業名</th>
                    <th className="px-4 py-3 text-left">業界</th>
                    <th className="px-4 py-3 text-right">従業員</th>
                    <th className="px-4 py-3 text-right">売上(億)</th>
                    <th className="px-4 py-3 text-right">担当者数</th>
                    <th className="px-4 py-3 text-left">主要課題</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.company.id} onClick={() => setSelected(r)} className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${r.priority === "A" ? "bg-red-100 text-red-700" : r.priority === "B" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.priority}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">{r.score}</td>
                      <td className="px-4 py-3 font-medium">{r.company.name}</td>
                      <td className="px-4 py-3 text-slate-600">{r.company.industry}</td>
                      <td className="px-4 py-3 text-right">{r.company.employees}</td>
                      <td className="px-4 py-3 text-right">{r.company.revenue}</td>
                      <td className="px-4 py-3 text-right">{r.contacts.length}名</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{r.company.challenges.slice(0, 2).join(" / ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-40 grid place-items-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-200 sticky top-0 bg-white flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selected.company.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{selected.company.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>業界: {selected.company.industry}</span>
                  <span>従業員: {selected.company.employees}名</span>
                  <span>売上: {selected.company.revenue}億</span>
                  <span>エリア: {selected.company.area}</span>
                </div>
                <div className="mt-2 text-xs">
                  <span className="font-semibold">スコア: {selected.score}点</span>
                  <span className="ml-2 text-slate-500">{selected.reason}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold mb-3">識別された課題</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.company.challenges.map((c) => (
                    <span key={c} className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3">担当者リスト（{selected.contacts.length}名）</h4>
                <div className="space-y-4">
                  {selected.contacts.map((ct) => (
                    <details key={ct.email} className="border border-slate-200 rounded-lg">
                      <summary className="cursor-pointer px-4 py-3 hover:bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${ct.role === "決裁者" ? "bg-red-100 text-red-700" : ct.role === "キーマン" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{ct.role}</span>
                            <span className="font-semibold">{ct.name}</span>
                            <span className="text-sm text-slate-500">{ct.department} / {ct.title}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{ct.email} / {ct.phone}</div>
                        </div>
                        <span className="text-xs text-blue-600 whitespace-nowrap ml-3">営業文面を見る ▼</span>
                      </summary>
                      <pre className="bg-slate-50 border-t border-slate-200 p-4 text-xs whitespace-pre-wrap font-sans">{ct.emailTemplate}</pre>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
