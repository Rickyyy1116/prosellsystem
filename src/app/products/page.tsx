"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

const EMPTY: Omit<Product, "id" | "createdAt"> = {
  name: "",
  category: "",
  targetIndustries: [],
  solvedChallenges: [],
  priceRange: "",
  track: "",
  pitchPoints: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Omit<Product, "id" | "createdAt"> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/products");
    const d = await r.json();
    setProducts(d.products);
  };

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing({ ...EMPTY });
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    const { id: _id, createdAt: _c, ...rest } = p;
    void _id;
    void _c;
    setEditing(rest);
    setEditingId(p.id);
  };

  const save = async () => {
    if (!editing || !editing.name) return;
    setSaving(true);
    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    }
    setSaving(false);
    setEditing(null);
    setEditingId(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("この商品を削除しますか？")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white px-8 py-5 shadow flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商品マスタ管理</h1>
          <p className="text-sm text-slate-300 mt-1">営業する自社商品の情報を登録・編集します</p>
        </div>
        <Link href="/" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">← リスト生成画面へ</Link>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">登録済み商品（{products.length}件）</h2>
          <button onClick={startNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg">＋ 新規商品を追加</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <span className="inline-block text-xs bg-slate-100 px-2 py-0.5 rounded mt-1">{p.category}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(p)} className="text-xs text-blue-600 hover:underline">編集</button>
                  <button onClick={() => del(p.id)} className="text-xs text-red-600 hover:underline ml-2">削除</button>
                </div>
              </div>
              <dl className="text-sm space-y-1 mt-3">
                <div className="flex gap-2"><dt className="text-slate-500 w-24 shrink-0">ターゲット</dt><dd>{p.targetIndustries.join(", ")}</dd></div>
                <div className="flex gap-2"><dt className="text-slate-500 w-24 shrink-0">解決課題</dt><dd>{p.solvedChallenges.join(", ")}</dd></div>
                <div className="flex gap-2"><dt className="text-slate-500 w-24 shrink-0">価格帯</dt><dd>{p.priceRange}</dd></div>
                <div className="flex gap-2"><dt className="text-slate-500 w-24 shrink-0">実績</dt><dd className="text-xs">{p.track}</dd></div>
                <div className="flex gap-2"><dt className="text-slate-500 w-24 shrink-0">訴求Pt</dt><dd className="text-xs">{p.pitchPoints.length}個</dd></div>
              </dl>
            </div>
          ))}
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 z-40 grid place-items-center p-6" onClick={() => setEditing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between">
                <h3 className="font-bold text-lg">{editingId ? "商品編集" : "新規商品"}</h3>
                <button onClick={() => setEditing(null)} className="text-slate-400 text-2xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <Field label="商品名">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
                <Field label="カテゴリ">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="例: 営業代行 / AIコンサルティング" />
                </Field>
                <Field label="ターゲット業界（カンマ区切り）">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.targetIndustries.join(", ")} onChange={(e) => setEditing({ ...editing, targetIndustries: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="人材サービス, SaaS, 広告" />
                </Field>
                <Field label="解決できる課題（カンマ区切り）">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.solvedChallenges.join(", ")} onChange={(e) => setEditing({ ...editing, solvedChallenges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="営業人員不足, 商談化率" />
                </Field>
                <Field label="価格帯">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.priceRange} onChange={(e) => setEditing({ ...editing, priceRange: e.target.value })} placeholder="月額50〜150万円" />
                </Field>
                <Field label="実績・事例">
                  <textarea rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.track} onChange={(e) => setEditing({ ...editing, track: e.target.value })} />
                </Field>
                <Field label="訴求ポイント（1行1つ）">
                  <textarea rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={editing.pitchPoints.join("\n")} onChange={(e) => setEditing({ ...editing, pitchPoints: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                </Field>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditing(null)} className="px-5 py-2 border border-slate-300 rounded-lg">キャンセル</button>
                  <button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold px-5 py-2 rounded-lg">{saving ? "保存中..." : "保存"}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
