# 三泰利官網第一階段稽核報告

稽核日期：2026-07-28  
正式站：https://www.suntaili.com/  
本機專案：`C:\Users\admin\Desktop\postman\company-site1`

## 1. 專案架構與資料來源

- 框架：Next.js 16 App Router、React 19、Tailwind CSS 4。
- 部署型態：`next.config.ts` 設定 `output: "export"` 與 `trailingSlash: true`，README 指向 Cloudflare Pages 靜態部署，build 產物在 `out/`。
- 現況沒有正式後端 API；產品與下載資料由 TypeScript 靜態資料檔提供。
- 主要資料來源：
  - 產品：`src/data/products.ts`，目前 42 個 published 產品頁。
  - 下載：`src/data/downloads.ts`，目前 23 筆下載資料。
  - 分類：`src/data/categories.ts`、`src/data/taxonomy.ts`。
  - 公司資料：`src/data/site.ts`。
- `prisma/schema.prisma` 已有 PostgreSQL/Prisma 規劃模型，但目前網站路由未使用資料庫。

## 2. 驗證結果摘要

- `npm run build`：通過，成功產生 50 個靜態頁面。
- `npx eslint src`：通過。
- `npm run lint`：失敗。主因是 repo 根目錄存在多個庫存系統臨時 JS 檔，以及 `scripts/*.cjs` 被 ESLint 規則掃到，不是 `src` 網站程式本身錯誤。
- 正式站主要路由狀態：
  - `/`、`/products/`、`/resources/`、`/about/`、`/contact/`：HTTP 200。
  - 產品詳情例：`/products/suntaili-ac-525d/`、`/products/suntaili-vms-platform/`：HTTP 200。
  - 不存在頁面：HTTP 404，但仍是 Next 預設 404。
- 手機版：
  - 主要頁面可開啟。
  - 手機選單可展開，包含產品中心、文件下載、關於我們、聯絡我們。
- 產品與下載重要內容：
  - 本機 build 與正式站 HTML 內都有輸出產品/下載內容，不是只給搜尋引擎「載入中」。
  - 但多數列表頁沒有 H1，SEO 架構仍需修。

## 3. 嚴重問題

1. 攝影機下載內容錯置。
   - `src/data/downloads.ts` 第 120-169 行，AC-525D、AC-535、AC-526D、AC-536 是攝影機產品，但手冊 notes 出現「讀頭、卡片、EM/MIFARE、門禁控制器」等門禁內容。
   - 這正好命中本次特別要求：攝影機文件不可出現門禁讀頭、卡片設定、門禁控制器等不相關描述。

2. 下載連結造成正式站 Console 404。
   - `src/components/DownloadList.tsx` 與 `src/app/products/[slug]/page.tsx` 使用 Next `<Link>` 指向 PDF/文件。
   - 正式站會預取 PDF 後面的 `__next._tree.txt`，造成多筆 404，例如 `/DM/.../AC-525D.pdf/__next._tree.txt?...`。
   - PDF 本身可開，但 Console 被 404 污染，也增加不必要請求。下載連結應改為一般 `<a>`，或至少禁止 prefetch。

3. 聯絡/詢價流程不足。
   - 現在只有 Email 入口，沒有經銷合作、大量採購、專案需求表單。
   - 對 B2B 站來說，這會讓「想詢價的人」無法結構化提供需求。

4. 全站 SEO 骨架未完成。
   - 多頁共用同一組 title/description。
   - 缺 canonical。
   - 缺 sitemap.xml，本次檢查正式站 `/sitemap.xml` 為 404。
   - 缺產品 JSON-LD、Organization、LocalBusiness、BreadcrumbList。
   - `/products/`、`/resources/`、`/about/`、`/contact/` 沒有 H1。

## 4. SEO 問題

- `robots.txt` 正式站有回應，但內容不是專案內自定義 robots，且沒有 sitemap 指向。
- 沒有自訂 404 頁。
- 沒有每頁自然化 metadata：
  - 產品頁 title 仍是「三泰利企業有限公司 | Suntaili」。
  - 產品頁缺產品型號、用途與分類語意。
- 產品頁缺麵包屑與內部連結：
  - 無「產品中心 > AHD 攝影機 > AC-525D」這類路徑。
  - 無相關產品區。
- 圖片：
  - alt 大多有填。
  - 但 `src/data/products.ts` 仍有 38 個 `dummyimage.com` 佔位圖，正式站信任感和圖片 SEO 都會受影響。
- 未加入 GA4、Google Search Console 驗證欄位，也沒有電話、Email、LINE、詢價表單事件追蹤。

## 5. 內容問題

- 首頁目前有 B2B 方向，但內容偏短，還沒完整呈現：
  - 工廠直營。
  - AHD 組裝客製能力。
  - 系統整合商/經銷商合作方式。
  - 技術文件與售後支援流程。
  - 明確詢價 CTA。
- 產品頁目前有型號、名稱、描述、特色、規格、下載，但還缺：
  - 用途。
  - 適用場域。
  - 相容性。
  - 詢價按鈕。
  - 相關產品。
- 沒有應用場域頁與常見問題頁。
- README 仍提到 `public/downloads/software/...`，但目前軟體下載改為 Google Drive 連結，文件需同步更新。

## 6. 安全與公開目錄問題

- `/Tools/` 與 `/tools/`：正式站目前 404，沒有公開目錄瀏覽。
- `/downloads/`、`/downloads/manual/`、`/DM/` 目錄本身：正式站目前 404，沒有公開目錄瀏覽。
- 但仍有 README 佔位檔可由完整路徑下載，例如：
  - `/downloads/manual/STL-IPC-2M-DOME/README.txt`
  - 這類檔案內容是「Put your real manual PDF file here...」，不適合公開。
- 目前下載檔案多為公開直連；如果未來有經銷商限定文件，應改成後端簽名 URL 或權限控管。
- 舊 `/Tools/` 建議：
  - 若沒有替代檔案：對已知舊檔路徑回 410 Gone，並加 noindex。
  - 若有替代檔案：對精準舊檔路徑做 301 到新下載或產品頁。
  - 不建議把整個 `/Tools/` 301 到首頁，會讓搜尋引擎和使用者困惑。

## 7. 建議修改順序

1. 先修資料正確性與 Console 404。
   - 修正 AC-525D、AC-535、AC-526D、AC-536 的錯置 notes。
   - 把下載連結從 Next `<Link>` 改為 `<a>`。
   - 刪除公開 README 佔位檔。

2. 補 SEO 基礎。
   - 每頁補獨立 title、description、canonical、H1。
   - 建立 `robots.txt`、`sitemap.xml`、自訂 404。
   - 加入麵包屑與 JSON-LD。

3. 補 B2B 轉換流程。
   - 經銷合作/大量採購詢價表單。
   - 專案需求表單。
   - 首頁強化 B2B 定位與 CTA。

4. 補產品內容完整度。
   - 產品分類頁。
   - 產品頁補用途、場域、相容性、下載文件、詢價、相關產品。
   - 新增應用場域頁與 FAQ。

5. 清理工程與部署。
   - 調整 ESLint ignore，或移出根目錄的庫存系統臨時檔。
   - 更新 README。
   - 替換 dummyimage 佔位圖。
   - 加入 GA4/GSC 環境變數與事件追蹤。

## 8. 第一階段結論

目前網站不是購物站，方向仍符合三泰利 B2B 官網定位；build 可過，主要頁面也能開。  
但要進入正式改善前，最優先要修的是「下載資料錯置」與「下載連結導致 Console 404」。這兩個會直接影響客戶信任與網站品質。SEO 與詢價流程則是第二優先，適合在第二階段一起補完整。
