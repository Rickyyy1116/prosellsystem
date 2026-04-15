# Prosell 営業リスト自動生成システム PoC

株式会社プロセルトラクション様向け「個社情報収集システム（プランA相当）」のPoC実装。

## 概要

ICP（Ideal Customer Profile：理想顧客像）条件を入力するだけで、以下を自動生成するWebアプリ。

1. ターゲット企業の抽出（業界・従業員数・エリアで絞込）
2. ICP合致度スコアリング（A/B/C優先度付け）
3. 企業ごとの担当者リスト（決裁者・キーマン・情報提供者で分類）
4. 個社別の営業メール文面自動生成
5. CSVエクスポート（スプシ連携想定）

## 本番実装とのマッピング

PoCはモックデータで動作します。本番では以下に差し替え。

| PoC | 本番 |
|---|---|
| `src/data/companies.ts`（モックDB） | Musubu API / Akala List API |
| `src/data/companies.ts`（モック担当者） | Sansan API / Musubu API |
| `generator.ts` スコアリング | Claude API（ICP照合） |
| `generator.ts` メール文面生成 | Claude API（個社別プロンプト） |
| CSV出力 | Google Sheets API / Supabase |

## 起動方法

```bash
npm install
npm run dev
```

http://localhost:3000

## 使い方

1. 業界・従業員数・エリアを入力
2. 「営業リストを生成」ボタンをクリック
3. 処理6ステップの進捗が表示される（バッチ処理のイメージ）
4. 結果テーブルで企業一覧を確認（優先度A/B/C、スコア順）
5. 企業行をクリックして詳細モーダルを表示
6. 担当者ごとの営業文面を確認
7. CSVエクスポートでダウンロード

## 技術構成

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- API Routes で擬似バックエンド
- モックデータ（企業15社 / 担当者30名以上）
