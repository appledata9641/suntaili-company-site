
    const WEB_APP_URL = "<?= webAppUrl ?>";
    let allProducts = [];
    let previewSeq = 0;
    const BOM_CHANGE_TYPES = {
      "預組裝入庫": true,
      "組裝出貨": true
    };
    const CATEGORY_ORDER = [
      "一體機攝影機",
      "槍型攝影機",
      "半球攝影機",
      "防護罩攝影機",
      "其他監視器",
      "材料",
      "模組",
      "燈板",
      "懶人線",
      "線材",
      "防水盒",
      "支架",
      "主機",
      "IPC",
      "POE",
      "雜項"
    ];

    function init() {
      document.getElementById("date").value = toDateInputValue(new Date());
      setMessage("商品資料載入中...", "");

      google.script.run
        .withSuccessHandler(function(res) {
          allProducts = res.items || [];

          refreshCategoryOptions();
          renderProducts();
          setMessage("", "");
        })
        .withFailureHandler(function(err) {
          setMessage("載入商品失敗：" + err.message, "error");
        })
        .getInventoryFormOptions();
    }

    function renderProducts() {
      const cat = document.getElementById("category").value;
      const keyword = document.getElementById("keyword").value.trim().toLowerCase();
      const sel = document.getElementById("productId");

      sel.innerHTML = "";

      const filtered = allProducts
        .filter(function(p) {
          return canShowProductForChangeType(p);
        })
        .filter(function(p) {
          return cat === "全部" || p.category === cat;
        })
        .filter(function(p) {
          if (!keyword) return true;
          return String(p.id).toLowerCase().includes(keyword) ||
                 String(p.name).toLowerCase().includes(keyword);
        });

      filtered.forEach(function(p) {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = "[" + (p.type || "一般品") + "] " + p.id + "｜" + p.name;
        sel.appendChild(opt);
      });

      document.getElementById("countHint").textContent =
        buildCountHint(filtered.length);

      if (filtered.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "找不到符合的商品";
        sel.appendChild(opt);
      }

      renderBomPreview();
    }

    function handleChangeTypeChange() {
      refreshCategoryOptions();
      renderProducts();
      renderBomPreview();
    }

    function refreshCategoryOptions() {
      const cat = document.getElementById("category");
      const current = cat.value || "全部";
      const seen = {};
      const categories = [];

      allProducts
        .filter(function(p) {
          return canShowProductForChangeType(p);
        })
        .forEach(function(p) {
          const category = p.category || "未分類";
          if (!seen[category]) {
            seen[category] = true;
            categories.push(category);
          }
        });

      categories.sort(compareCategory);
      cat.innerHTML = "";

      ["全部"].concat(categories).forEach(function(c) {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        cat.appendChild(opt);
      });

      cat.value = seen[current] ? current : "全部";
    }

    function canShowProductForChangeType(product) {
      const changeType = getValue("changeType") || "出貨";
      const type = product.type || "一般品";

      if (BOM_CHANGE_TYPES[changeType]) {
        return type === "成品" && product.hasBom;
      }

      return true;
    }

    function compareCategory(a, b) {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      const av = ai === -1 ? 999 : ai;
      const bv = bi === -1 ? 999 : bi;

      if (av !== bv) return av - bv;
      return String(a).localeCompare(String(b), "zh-Hant");
    }

    function buildCountHint(count) {
      const changeType = getValue("changeType") || "出貨";

      if (changeType === "出貨") {
        return "目前顯示 " + count + " 個品項；這個模式只扣商品本身庫存，不會扣 BOM 材料。";
      }

      if (changeType === "入庫") {
        return "目前顯示 " + count + " 個品項；這個模式只增加商品本身庫存。";
      }

      if (changeType === "預組裝入庫") {
        return "目前顯示 " + count + " 個成品；會扣 BOM 材料並增加成品庫存。";
      }

      return "目前顯示 " + count + " 個成品；會扣 BOM 材料，不扣成品庫存。";
    }

    function renderBomPreview() {
      const productId = getValue("productId");
      const qty = getValue("qty");
      const changeType = getValue("changeType");
      const box = document.getElementById("bomPreview");
      const product = allProducts.find(function(p) {
        return p.id === productId;
      });

      previewSeq++;

      if (!productId || !BOM_CHANGE_TYPES[changeType] || !product || product.type !== "成品") {
        box.className = "bom-preview";
        box.innerHTML = "";
        return;
      }

      const seq = previewSeq;
      box.className = "bom-preview active";
      box.innerHTML = '<div class="bom-title">BOM 異動預覽載入中...</div>';

      google.script.run
        .withSuccessHandler(function(res) {
          if (seq !== previewSeq) return;
          renderBomPreviewResult(res || {});
        })
        .withFailureHandler(function(err) {
          if (seq !== previewSeq) return;
          box.className = "bom-preview active";
          box.innerHTML = '<div class="bom-warning">BOM 預覽失敗：' + escapeHtml(err.message) + '</div>';
        })
        .getProductBomPreview(productId, qty, changeType);
    }

    function renderBomPreviewResult(res) {
      const box = document.getElementById("bomPreview");

      if (!res.hasBom) {
        box.className = "bom-preview active";
        box.innerHTML = '<div class="bom-title">' + escapeHtml(res.message || "這個品項沒有 BOM 展開資料。") + '</div>';
        return;
      }

      let html = '<div class="bom-title">' + escapeHtml(res.title || "BOM 異動預覽") + '</div>';

      if (res.warning) {
        html += '<div class="bom-warning">' + escapeHtml(res.warning) + '</div>';
      }

      (res.items || []).forEach(function(item) {
        const delta = Number(item.qty || 0);
        const deltaText = (delta > 0 ? "+" : "") + delta;
        html +=
          '<div class="bom-item">' +
            '<div class="bom-name">' + escapeHtml(item.productId) + '｜' + escapeHtml(item.name) + '</div>' +
            '<div class="bom-qty">' + escapeHtml(deltaText) + '　庫存 ' + escapeHtml(item.currentStock) + '→' + escapeHtml(item.afterStock) + '</div>' +
          '</div>';
      });

      box.className = "bom-preview active";
      box.innerHTML = html;
    }

    function submitForm() {
    const btn = document.getElementById("submitBtn");
    const changeType = getValue("changeType");

      const payload = {
      applicant: getValue("applicant"),
      date: getValue("date"),
      productId: getValue("productId"),
      op: (changeType === "入庫" || changeType === "預組裝入庫") ? "add" : "sub",
      qty: getValue("qty"),
      movementType: changeType,
      reason: changeType,
      note: getValue("note")
    };

    if (!payload.applicant) return setMessage("請填申請人。", "error");
    if (!payload.date) return setMessage("請選日期。", "error");
    if (!payload.productId) return setMessage("請選商品。", "error");
    if (!payload.qty || Number(payload.qty) <= 0) return setMessage("數量請輸入正數。", "error");

    btn.disabled = true;
    setMessage("送出中...", "");

    google.script.run
      .withSuccessHandler(function(res) {
        try {
          setMessage("已送出待審核，申請列：" + res.row, "ok");

          document.getElementById("qty").value = "";
          document.getElementById("note").value = "";
          renderBomPreview();
          // 不清 applicant / date / changeType，方便連續送單
        } finally {
          btn.disabled = false;
        }
      })
      .withFailureHandler(function(err) {
        setMessage("錯誤：" + err.message, "error");
        btn.disabled = false;
      })
      .submitInventoryChange(payload);
    }

    function getValue(id) {
      return document.getElementById(id).value.trim();
    }

    function setMessage(text, type) {
      const msg = document.getElementById("msg");
      msg.textContent = text;
      msg.className = type || "";
    }

    function escapeHtml(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function toDateInputValue(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + d;
    }

    function openBossPage() {
      navigateToPage("boss", "庫存看板");
    }

    function navigateToPage(page, label) {
      const baseUrl = String(WEB_APP_URL || "").trim();

      if (!baseUrl || baseUrl.indexOf("<?= ") === 0) {
        alert("找不到 Web App 網址，請確認已部署為網頁應用程式。");
        return;
      }

      const separator = baseUrl.indexOf("?") >= 0 ? "&" : "?";
      const targetUrl = baseUrl + separator + "page=" + encodeURIComponent(page);

      try {
        window.top.location.href = targetUrl;
        return;
      } catch (err) {}

      try {
        window.location.href = targetUrl;
        return;
      } catch (err) {}

      const opened = window.open(targetUrl, "_blank", "noopener");
      if (!opened) {
        alert("開啟" + label + "失敗，請允許瀏覽器開啟新分頁。");
      }
    }
  
  
    init();
    
  