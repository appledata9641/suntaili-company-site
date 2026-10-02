
    const WEB_APP_URL = "<?= webAppUrl ?>";

    function loadData() {
      // 入口函式：向 Code.gs 的 getBossDashboardData() 取資料。
      setText("time", "載入中...");

      google.script.run
        .withSuccessHandler(function(data) {
          render(data || {});
        })
        .withFailureHandler(function(err) {
          setText("time", "讀取失敗：" + ((err && err.message) || JSON.stringify(err)));
        })
        .getBossDashboardData();
    }

    function render(data) {
      // 將 Apps Script 回傳的完整資料分派到各個畫面區塊。
      const today = data.today || {};
      const month = data.month || {};
      const categoryTop = data.categoryTop || {};

      setText("time", "更新時間：" + valueOrDash(data.generatedAt) + "｜統計月份：" + valueOrDash(month.label));
      setText("todayOut", numberText(today.outQty));
      setText("todayIn", numberText(today.inQty));
      setText("monthOut", numberText(month.outQty));
      setText("monthNet", signedText(month.net));

      setNetColor("monthNet", Number(month.net) || 0);

      renderCategoryTop("todayOutCategoryTop", categoryTop.todayOut || {}, false);
      renderCategoryTop("todayInCategoryTop", categoryTop.todayIn || {}, false);
      renderCategoryTop("monthOutCategoryTop", categoryTop.monthOut || {}, false);
      renderCategoryTop("monthNetCategoryTop", categoryTop.monthNet || {}, true);

      renderRank("todayOutTop", data.todayOutTop || [], false);
      renderRank("todayInTop", data.todayInTop || [], false);
      renderRank("monthOutTop", data.monthOutTop || [], false);
      renderRank("monthNetTop", data.monthNetTop || [], true);

      renderStockTable("lowStock", data.lowStock || []);
      renderStockTable("zeroStock", data.zeroStock || []);
    }

    function renderCategoryTop(id, groups, signed) {
      // groups 格式：{分類名稱: [{productId, name, qty}, ...]}。
      const box = document.getElementById(id);
      const names = Object.keys(groups || {}).filter(function(name) {
        return groups[name] && groups[name].length;
      });

      box.innerHTML = "";

      if (!names.length) {
        box.innerHTML = '<div class="empty">目前沒有資料</div>';
        return;
      }

      names.sort().forEach(function(category) {
        const block = document.createElement("div");
        block.className = "category-block";
        block.innerHTML = '<div class="category-title">' + escapeHtml(category) + '</div>';

        const list = document.createElement("div");
        block.appendChild(list);
        box.appendChild(block);

        renderRankInto(list, groups[category], signed);
      });
    }

    function renderRank(id, rows, signed) {
      // 渲染單一排行區塊，空資料時顯示提示。
      const box = document.getElementById(id);
      box.innerHTML = "";

      if (!rows || !rows.length) {
        box.innerHTML = '<div class="empty">目前沒有資料</div>';
        return;
      }

      renderRankInto(box, rows, signed);
    }

    function renderRankInto(box, rows, signed) {
      // 共用排行列渲染；signed=true 時顯示 + / - 並用紅綠色區分。
      const max = Math.max.apply(null, rows.map(function(item) {
        return Math.abs(Number(item.qty) || 0);
      }));

      rows.forEach(function(item) {
        const qty = Number(item.qty) || 0;
        const percent = max ? Math.round((Math.abs(qty) / max) * 100) : 0;
        const displayQty = signed ? signedText(qty) : numberText(qty);
        const tone = signed ? (qty < 0 ? " negative" : " positive") : "";

        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML =
          '<div class="name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</div>' +
          '<div class="bar-bg"><div class="bar' + tone + '" style="width:' + percent + '%"></div></div>' +
          '<div class="qty">' + displayQty + '</div>';

        box.appendChild(row);
      });
    }

    function renderStockTable(id, rows) {
      // 低庫存與零庫存共用同一張表格樣式。
      const box = document.getElementById(id);

      if (!rows || !rows.length) {
        box.innerHTML = '<div class="empty">目前沒有資料</div>';
        return;
      }

      let html =
        '<table>' +
          '<thead>' +
            '<tr>' +
              '<th>商品ID</th>' +
              '<th>品名</th>' +
              '<th>分類</th>' +
              '<th>庫存</th>' +
              '<th>安全庫存</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>';

      rows.forEach(function(item) {
        html +=
          '<tr>' +
            '<td>' + escapeHtml(item.productId) + '</td>' +
            '<td>' + escapeHtml(item.name) + '</td>' +
            '<td>' + escapeHtml(item.category) + '</td>' +
            '<td>' + numberText(item.stock) + '</td>' +
            '<td>' + numberText(item.safety) + '</td>' +
          '</tr>';
      });

      html += '</tbody></table>';
      box.innerHTML = html;
    }

    function openFormPage() {
      navigateToPage("form", "出入庫表單");
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

    function setText(id, text) {
      // 小工具：集中處理文字填入，讓 render() 比較乾淨。
      document.getElementById(id).textContent = text;
    }

    function setNetColor(id, value) {
      // 本月淨變化：正數綠色、負數紅色、0 用預設色。
      const el = document.getElementById(id);
      el.classList.toggle("positive", value > 0);
      el.classList.toggle("negative", value < 0);
    }

    function valueOrDash(value) {
      // 空值顯示為 -，避免畫面出現 undefined/null。
      return value === null || value === undefined || value === "" ? "-" : String(value);
    }

    function numberText(value) {
      // 數字格式化：無效值以 0 顯示。
      const num = Number(value);
      return Number.isFinite(num) ? String(num) : "0";
    }

    function signedText(value) {
      // 淨變化用：正數補上 + 號。
      const num = Number(value) || 0;
      return num > 0 ? "+" + num : String(num);
    }

    function escapeHtml(value) {
      // 所有來自試算表的文字都先 escape，避免 HTML 被資料內容干擾。
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    loadData();
  