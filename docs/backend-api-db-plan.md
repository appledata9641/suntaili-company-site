# 三泰利企業有限公司（Suntaili）下載中心後端 / 資料庫規劃（第一版）

## 目標
- 支援 B2B 客戶依型號查詢韌體、工具程式、說明文件
- 可擴充下載權限（公開 / 經銷商 / 指定客戶）
- 可保留版本紀錄、檔案 metadata、下載紀錄
- 與目前前端資料模型相容（`productSlug`、`category`、`type`、`version` 等欄位）

## 建議技術堆疊（可調整）
- API：Next.js Route Handlers 或獨立 Node/NestJS（若之後有複雜權限可優先 NestJS）
- DB：PostgreSQL
- ORM：Prisma（開發效率高，型別友善）
- 檔案儲存：S3 相容（Cloudflare R2 / AWS S3 / MinIO）
- 簽名下載：後端產生短效 signed URL
- 驗證（第二階段）：JWT / Session（管理後台與客戶下載權限）

## 資料表設計（核心）

### 1. `product_categories`
- 用途：產品分類（攝影機 / 錄影主機 / 周邊 / 門禁）

欄位：
- `id` UUID PK
- `code` varchar(50) unique (`camera`, `recorder`, `accessory`, `access-control`)
- `name_zh` varchar(100)
- `sort_order` int
- `is_active` boolean default true
- `created_at` timestamptz
- `updated_at` timestamptz

### 2. `products`
- 用途：產品主檔（型號、分類、展示資訊）

欄位：
- `id` UUID PK
- `slug` varchar(150) unique
- `model` varchar(120) unique
- `name_zh` varchar(200)
- `category_id` UUID FK -> `product_categories.id`
- `short_description_zh` text
- `description_zh` text
- `cover_image_url` text
- `specs_json` jsonb
- `tags_json` jsonb
- `feature_bullets_json` jsonb
- `published` boolean default true
- `created_at` timestamptz
- `updated_at` timestamptz

索引建議：
- `idx_products_category_id`
- `idx_products_published`
- `idx_products_name_model_search`（可用 trigram / full text）

### 3. `download_assets`
- 用途：下載項目（韌體 / 軟體 / 手冊）的業務資料

欄位：
- `id` UUID PK
- `product_id` UUID FK -> `products.id`
- `asset_type` varchar(20) (`firmware`, `software`, `manual`)
- `title_zh` varchar(250)
- `version` varchar(80)
- `release_date` date
- `file_size_bytes` bigint
- `checksum_sha256` varchar(128) nullable
- `notes_zh` text nullable
- `min_hw_version` varchar(50) nullable
- `visibility` varchar(20) default `public` (`public`, `partner`, `customer`, `private`)
- `status` varchar(20) default `published` (`draft`, `published`, `archived`)
- `sort_priority` int default 0
- `created_at` timestamptz
- `updated_at` timestamptz

索引建議：
- `idx_download_assets_product_id`
- `idx_download_assets_type`
- `idx_download_assets_release_date`
- `idx_download_assets_status_visibility`

### 4. `stored_files`
- 用途：檔案實體 metadata（對應 S3/R2 object）

欄位：
- `id` UUID PK
- `asset_id` UUID FK -> `download_assets.id`
- `storage_provider` varchar(30) (`r2`, `s3`, `minio`)
- `bucket` varchar(120)
- `object_key` text
- `original_filename` varchar(255)
- `mime_type` varchar(120)
- `size_bytes` bigint
- `sha256` varchar(128) nullable
- `is_primary` boolean default true
- `created_at` timestamptz

索引建議：
- `idx_stored_files_asset_id`
- `idx_stored_files_object_key`

### 5. `download_access_policies`（第二階段可上）
- 用途：控制哪些角色/客戶可下載哪些資產或產品

欄位：
- `id` UUID PK
- `scope_type` varchar(20) (`product`, `asset`, `category`)
- `scope_id` UUID
- `audience_type` varchar(20) (`public`, `partner`, `customer`)
- `customer_id` UUID nullable
- `is_allowed` boolean
- `created_at` timestamptz

### 6. `download_logs`
- 用途：下載稽核與統計

欄位：
- `id` UUID PK
- `asset_id` UUID FK -> `download_assets.id`
- `product_id` UUID FK -> `products.id`
- `request_user_id` UUID nullable
- `request_customer_id` UUID nullable
- `ip_hash` varchar(128) nullable
- `user_agent` text nullable
- `download_result` varchar(20) (`issued`, `success`, `expired`, `denied`)
- `created_at` timestamptz

索引建議：
- `idx_download_logs_asset_id_created_at`
- `idx_download_logs_product_id_created_at`

## API 設計（第一版可直接開發）

### 公開查詢 API（對應目前前端）

#### `GET /api/products`
用途：產品列表查詢（分類、關鍵字）

Query:
- `category`（可選）
- `q`（可選）
- `page` / `pageSize`（可選）
- `published=true`（預設）

Response（摘要）：
- `items[]`: `id`, `slug`, `name`, `model`, `category`, `shortDescription`, `coverImage`, `tags`
- `pagination`

#### `GET /api/products/:slug`
用途：產品詳情 + 規格

Response：
- 產品完整資料
- `relatedDownloadsSummary`（可選，回傳筆數與最近更新日期）

#### `GET /api/downloads`
用途：下載中心列表（對應前端 query params）

Query:
- `category`
- `type`
- `q`
- `productSlug`
- `sort`（預設 `releaseDate:desc`）
- `page` / `pageSize`

Response：
- `items[]`: `id`, `title`, `version`, `releaseDate`, `fileSize`, `notes`, `product`, `type`
- `total`

#### `GET /api/downloads/:id`
用途：取得單一下載項目詳情（顯示頁或下載前確認）

### 下載 API（簽名網址）

#### `POST /api/downloads/:id/request`
用途：申請下載連結（統一做權限檢查與記錄）

流程：
1. 驗證資產狀態、可見性
2. 驗證登入身份/客戶權限（第二階段）
3. 建立短效 signed URL（例如 60~300 秒）
4. 寫入 `download_logs`（`issued`）
5. 回傳 `downloadUrl`, `expiresAt`

Response:
- `downloadUrl`
- `expiresAt`
- `filename`

## 後台 API（第二階段）
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `POST /api/admin/download-assets`
- `PATCH /api/admin/download-assets/:id`
- `POST /api/admin/files/presign-upload`
- `POST /api/admin/files/complete-upload`
- `GET /api/admin/download-logs`

## 與目前前端的欄位對照（相容性）
前端 `DownloadItem` 對應：
- `productSlug` -> `products.slug`
- `productModel` -> `products.model`
- `category` -> `product_categories.code`
- `type` -> `download_assets.asset_type`
- `title` -> `download_assets.title_zh`
- `version` -> `download_assets.version`
- `releaseDate` -> `download_assets.release_date`
- `fileSize` -> 由 `stored_files.size_bytes` 格式化
- `checksum` -> `download_assets.checksum_sha256` 或 `stored_files.sha256`
- `downloadUrl` -> 不入庫固定值，改由 `/request` API 動態簽發

## 建議實作階段（你下一步可以直接開工）

### Phase A（最小可用，先接目前前端）
- 建 `product_categories`, `products`, `download_assets`, `stored_files`
- 寫 `GET /api/products`, `GET /api/products/:slug`, `GET /api/downloads`
- 暫時 `downloadUrl` 可回固定測試 URL（無權限）

### Phase B（正式下載流程）
- 導入物件儲存（R2/S3/MinIO）
- `POST /api/downloads/:id/request` 簽名下載
- 建 `download_logs`
- 後台上傳流程（presign upload）

### Phase C（B2B 權限控管）
- 客戶/經銷商帳號
- 產品或分類級下載權限
- 客戶可見版本控管與下載歷程

## 安全與營運注意事項（重要）
- 不要把真實儲存桶公開成永久直連 URL（用簽名網址）
- 下載簽名網址要短效（60~300 秒）
- 韌體檔案務必保存 SHA256，供客戶驗證
- 保留檔案不可變版本（避免覆蓋同 object key）
- 建議對下載 API 加 rate limit 與基本審計
- 若有客戶專屬檔案，需加 RBAC/ABAC 權限檢查

## 建議下一步（技術落地）
- 我可以下一輪直接幫你產出：
  1. `Prisma schema`
  2. `/api/downloads` 與 `/api/products` Route Handlers
  3. 前端改為真 API `fetch`（保留目前 query params）

