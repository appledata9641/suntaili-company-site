# 第四階段驗證報告

日期：2026-07-28

## 目前已推送階段

| 階段 | Commit | 狀態 |
|---|---|---|
| 第一階段：稽核報告 | `084a58a docs: add website audit report` | 已 push |
| 下載清理：移除假檔與 DM 規則 | `3b611a6 fix: clean up download resources`、`e91f8f6 fix: hide DM files from resources page` | 已 push |
| 第二階段：B2B 內容改善 | `c1336b8 feat: strengthen b2b site content` | 已 push |
| 第三階段：技術 SEO 基礎 | `525d977 feat: add technical seo foundation` | 已 push |

## 驗證結果

| 項目 | 結果 | 備註 |
|---|---|---|
| `npx.cmd eslint src` | 通過 | 只檢查網站 `src`，避開工作區內既有庫存暫存檔 |
| `npm.cmd run build` | 通過 | Next.js 靜態輸出成功 |
| TypeScript | 通過 | `next build` 已執行型別檢查 |
| 靜態頁產出 | 通過 | 共產出 59 個 route |
| 主要路由檔案存在 | 通過 | 首頁、產品、產品詳細、文件、關於、聯絡、詢價、應用場域、FAQ、分類、404 |
| 內部連結檢查 | 通過 | `missing_internal_links = 0` |
| 文件下載頁 DM 規則 | 通過 | `/resources/` 不顯示產品 DM |
| AC-535 產品頁下載規則 | 通過 | 有 `AC-535 產品型錄 DM`，無 `AC-535 使用手冊` |
| SEO 基礎輸出 | 通過 | canonical、OG、Twitter Card、JSON-LD、robots、sitemap 均產出 |
| 舊 `/Tools/` 路徑處理 | 通過 | `_redirects` 301 到 `/resources/`，`robots` disallow，`_headers` noindex |

## 修改檔案清單

### 內容與頁面

- `src/app/page.tsx`
- `src/app/products/page.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/categories/[slug]/page.tsx`
- `src/app/applications/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/inquiry/page.tsx`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/resources/page.tsx`
- `src/app/not-found.tsx`

### 共用元件與資料

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ContactCard.tsx`
- `src/components/Analytics.tsx`
- `src/components/JsonLd.tsx`
- `src/data/categories.ts`
- `src/lib/product-content.ts`
- `src/lib/seo.ts`

### SEO 與部署設定

- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `public/_headers`
- `public/_redirects`

## 修改理由

1. 首頁重新強化 B2B 定位，避免網站看起來像一般消費者購物站。
2. 補上詢價合作、專案需求、應用場域、FAQ 與分類頁，讓系統整合商與經銷商能更快找到入口。
3. 產品詳細頁補上用途、規格、適用場域、相容性、下載、詢價與相關產品，讓每個型號頁更完整。
4. 產品中心新增伺服器輸出的型號速覽，避免重要產品內容只存在互動式前端。
5. 文件下載總頁移除產品 DM，只保留工具軟體與操作文件；產品 DM 留在各型號頁。
6. 補 SEO 基礎設定，讓正式站有獨立 metadata、canonical、Open Graph、Twitter Card、JSON-LD、robots 與 sitemap。
7. 舊 `/Tools/` 下載目錄改由 Cloudflare 301 到新版文件下載頁，並設定 noindex，避免舊公開目錄造成 SEO 與安全風險。
8. GA4 與 Google Search Console 只留環境變數欄位，不把正式 ID 寫死。

## SEO 改善項目

- 每頁獨立 title、description、canonical。
- 首頁、產品頁、分類頁、文件頁、詢價頁、FAQ 等主要頁有自然描述。
- 新增 `robots.txt` 與 `sitemap.xml`。
- 新增 Organization、LocalBusiness、WebSite、Product、BreadcrumbList JSON-LD。
- 新增 Open Graph 與 Twitter Card。
- 新增自訂 404 頁。
- 產品頁與分類頁加入麵包屑與內部連結。
- 電話、Email、LINE、產品詢價與表單 submit 加入 GA4 事件掛點。
- `_headers` 加入基本安全標頭與靜態資源快取。

## 尚需人工提供的內容

| 項目 | 用途 |
|---|---|
| `NEXT_PUBLIC_GA4_ID` | 啟用 GA4 追蹤 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 驗證 |
| `NEXT_PUBLIC_SITE_URL` | 若正式網址不是 `https://www.suntaili.com` 才需要覆蓋 |
| `NEXT_PUBLIC_LINE_URL` | LINE 官方帳號或聯絡網址；未設定時不顯示 LINE CTA |
| 各產品實拍圖 | 目前部分產品仍使用 placeholder 或既有簡圖 |
| 各型號完整規格書 | 目前已有初步規格，正式 SEO 內容仍需補齊真實規格 |
| 實際保固、退換、售後政策 | 不確定內容未自行杜撰 |
| 更多可公開下載的手冊與工具 | 需確認檔案有效與內容不錯置後再加入 |

## 部署方式

目前專案使用 Cloudflare Pages 靜態部署。

1. 本機確認：
   ```bash
   npx.cmd eslint src
   npm.cmd run build
   ```
2. push 到 GitHub `main`。
3. Cloudflare Pages 會依 repo 設定自動部署。
4. 部署完成後檢查：
   - `https://www.suntaili.com/`
   - `https://www.suntaili.com/products/`
   - `https://www.suntaili.com/resources/`
   - `https://www.suntaili.com/inquiry/`
   - `https://www.suntaili.com/robots.txt`
   - `https://www.suntaili.com/sitemap.xml`

## 回復方式

若 Cloudflare 部署後發現問題，可用以下其中一種方式回復：

1. 在 Cloudflare Pages 後台選擇上一個成功版本重新部署。
2. 若需用 Git 回復第三階段：
   ```bash
   git revert 525d977
   git push origin main
   ```
3. 若需回復第二階段與第三階段：
   ```bash
   git revert 525d977 c1336b8
   git push origin main
   ```

## 注意事項

- 目前工作區仍有先前庫存系統暫存檔與既有刪除狀態，這些沒有納入網站 commit。
- `npm run lint` 會掃整個 repo，可能受那些非網站暫存 JS 檔影響；本次正式驗證使用 `npx.cmd eslint src`。
- 未確認的公司資訊、保固政策、實際案場案例都未自行加入；LINE 只保留環境變數欄位，不填假連結。
