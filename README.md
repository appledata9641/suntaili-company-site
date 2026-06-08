# Suntaili 靜態官網（Cloudflare Pages）

本專案為三泰利企業有限公司（Suntaili）靜態網站版本。
目前以產品展示 + 文件下載為主，不依賴後端 API。

## 1. 本機開發

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 2. 靜態建置（Cloudflare 使用）

```bash
npm run build
```

建置完成後會輸出到 `out/`。

## 3. 文件放置規則

目前下載連結由 `src/data/downloads.ts` 控制，預設前綴為：

- `NEXT_PUBLIC_DOWNLOAD_URL=/downloads`

也就是檔案需放在：

- `public/downloads/manual/...`
- `public/downloads/software/...`

已先建立目錄骨架與 `README.txt` 提示檔，請把實際檔案覆蓋上去。

## 4. Cloudflare Pages 部署設定

1. Cloudflare Dashboard -> Workers & Pages -> Create -> Pages
2. 連接 GitHub repo
3. Build settings：

- Framework preset: `Next.js`
- Build command: `npm run build`
- Build output directory: `out`

4. Deploy

## 5. 綁定網域（suntaili.com）

在 Cloudflare Pages 的 `Custom domains` 加入：

- `suntaili.com`
- `www.suntaili.com`

照 Cloudflare 提示設定 DNS。

注意：

- `MX / SPF / DKIM / DMARC` 不要動（避免影響公司信箱）
- 若已有舊站，建議先改 `www` 測試，確認後再切根網域 `@`

## 6. 發佈流程（推薦）

1. 更新 `src/data/downloads.ts`
2. 放入對應檔案到 `public/downloads/...`
3. 本機 `npm run build` 檢查
4. push 到 GitHub
5. Cloudflare Pages 自動重新部署

## 7. 常見問題

### Q1: 點下載出現 404
- 檢查 `src/data/downloads.ts` 的路徑是否與 `public/downloads/...` 檔名一致。

### Q2: 本機 log 出現一些 `__next...txt` 404
- 若頁面功能正常，通常是靜態預覽工具的預抓探測訊息，可忽略。

### Q3: 要改成 Google Cloud 連結
- 把 `src/data/downloads.ts` 內 `downloadUrl` 改成完整 `https://...` 下載網址即可。
