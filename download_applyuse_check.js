/************************************************************
 * 出貨圖表 / 庫存系統 V2 - Google Apps Script
 *
 * 核心流程：
 * 1. 商品主檔保存商品 ID、品名、分類、初始庫存與安全庫存。
 * 2. 使用者從 Sidebar 或 Web App 送出出入庫申請。
 * 3. 管理者在 Google Sheet 勾選審核後，批次套用到異動明細。
 * 4. 系統依照異動明細重建即時庫存、每日異動、月報與老闆儀表板資料。
 ************************************************************/

const SHEETS = {
  MASTER: "商品主檔",
  REQUEST: "異動申請",
  DETAIL: "庫存異動明細",
  STOCK: "總庫存表",
  DAILY: "每日變化",
  MONTHLY: "月報表",
  BOM: "組合用料表"
};

const STATUS = {
  ACTIVE: "啟用",
  INACTIVE: "停用",
  PENDING: "待審核",
  APPLIED: "已生效",
  VOIDED: "已作廢",
  ERROR: "錯誤"
};

const SCRIPT_VERSION = "STRICT-STOCK-V2-20260717-BOM-MODES";

const PRODUCT_TYPE = {
  NORMAL: "一般品",
  FINISHED: "成品",
  MATERIAL: "材料",
  MODULE: "模組"
};

const MOVEMENT_TYPE = {
  STOCK_OUT: "出貨",
  STOCK_IN: "入庫",
  PREBUILD_IN: "預組裝入庫",
  ASSEMBLY_OUT: "組裝出貨",
  REPAIR_IN: "維修品入庫"
};

const HEADERS = {
  MASTER: [
    "商品ID", "目前品名", "分類", "初始庫存", "安全庫存",
    "狀態", "舊品名/別名", "建立時間", "更新時間",
    "商品類型", "標準成本"
  ],

  BOM: [
    "成品ID", "成品名稱", "材料ID", "材料名稱", "單位用量",
    "狀態", "備註", "建立時間", "更新時間"
  ],

  REQUEST: [
    "申請時間", "申請人", "日期", "商品ID", "品名快照",
    "變化數量", "原因", "備註", "審核者", "確認審核",
    "作廢", "狀態", "審核時間", "套用時間", "錯誤訊息", "明細列"
  ],

  DETAIL: [
    "異動時間", "日期", "商品ID", "品名快照", "變化數量",
    "原因", "備註", "申請列", "審核者"
  ],

  STOCK: [
    "商品ID", "項目名稱", "庫存", "分類", "安全庫存", "狀態"
  ],

  DAILY: [
    "日期", "商品ID", "項目名稱", "變化數量", "原因", "審核者", "異動時間"
  ],

  MONTHLY: [
    "月份", "商品ID", "項目名稱", "分類",
    "月初庫存", "本月入庫", "本月出庫", "淨變化", "月末庫存"
  ]
};

/************************************************************
 * Google Sheet 選單
 ************************************************************/

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("庫存系統")
    .addItem("開啟出入庫表單", "showSidebar")
    .addSeparator()
    .addItem("初始化庫存系統 V2", "setupInventoryV2")
    .addItem("批次套用已核准申請", "batchApplyApproved")
    .addItem("重建庫存與每日報表", "rebuildReports")
    .addItem("重建月報表", "rebuildMonthlyReport")
    .addItem("建立 BOM 範本資料", "insertBomTemplateRows")
    .addItem("自動調整所有欄寬", "formatAllSheets")
    .addItem("顯示程式版本", "showScriptVersion")
    .addSeparator()
    .addItem("清空每日異動紀錄", "clearDailyReport")
    .addToUi();
}

function showScriptVersion() {
  SpreadsheetApp.getUi().alert("目前庫存系統程式版本：" + SCRIPT_VERSION);
}

/************************************************************
 * 初始化
 ************************************************************/

function setupInventoryV2() {
  const ss = SpreadsheetApp.getActive();

  // 只建立或修正表頭，不覆蓋既有資料列。
  const master = ensureSheetWithHeaders_(ss, SHEETS.MASTER, HEADERS.MASTER);
  const request = ensureSheetWithHeaders_(ss, SHEETS.REQUEST, HEADERS.REQUEST);

  ensureSheetWithHeaders_(ss, SHEETS.DETAIL, HEADERS.DETAIL);
  ensureSheetWithHeaders_(ss, SHEETS.STOCK, HEADERS.STOCK);
  ensureSheetWithHeaders_(ss, SHEETS.DAILY, HEADERS.DAILY);
  ensureSheetWithHeaders_(ss, SHEETS.MONTHLY, HEADERS.MONTHLY);
  const bom = ensureSheetWithHeaders_(ss, SHEETS.BOM, HEADERS.BOM);

  setupMasterSheetValidation_(master);
  setupRequestSheetValidation_(request);
  setupBomSheetValidation_(bom);
  rebuildReports();
  rebuildMonthlyReport();
  formatAllSheets_();

  SpreadsheetApp.getUi().alert("初始化完成。");
}

/************************************************************
 * 表單 / Web App
 ************************************************************/

function showSidebar() {
  // 試算表右側欄使用 Sidebar.html。
  const template = HtmlService.createTemplateFromFile("Sidebar");
  template.webAppUrl = ScriptApp.getService().getUrl();

  SpreadsheetApp.getUi().showSidebar(
    template.evaluate().setTitle("出入庫申請")
  );
}

function doGet(e) {
  // Web App 依照 page 參數切換表單或看板。
  const page = e && e.parameter && e.parameter.page ? e.parameter.page : "form";
  const isBoss = page === "boss";
  const file = isBoss ? "BossDashboard" : "Sidebar";

  const template = HtmlService.createTemplateFromFile(file);
  template.webAppUrl = ScriptApp.getService().getUrl();

  const html = template.evaluate();
  html.setTitle(isBoss ? "庫存儀表板" : "出入庫申請");
  html.addMetaTag(
    "viewport",
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  );

  return html;
}

function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

function getInventoryFormOptions() {
  // Sidebar 表單用：只列出啟用商品，並回傳分類清單給下拉選單。
  const ss = SpreadsheetApp.getActive();
  const masterMap = getMasterMap_(ss);
  const bomMap = getBomMap_(ss);

  const items = masterMap.order
    .filter(function(product) {
      return product.status === STATUS.ACTIVE;
    })
    .map(function(product) {
      return {
        id: product.id,
        name: product.name,
        category: product.category || "未分類",
        type: product.type || PRODUCT_TYPE.NORMAL,
        hasBom: !!(bomMap.byFinishedId[product.id] && bomMap.byFinishedId[product.id].length)
      };
    });

  const categorySet = {};
  const typeSet = {};
  items.forEach(function(item) {
    categorySet[item.category] = true;
    typeSet[item.type] = true;
  });

  return {
    items: items,
    categories: Object.keys(categorySet).sort(),
    types: Object.keys(typeSet).sort()
  };
}

function getProductBomPreview(productId, qty, movementType) {
  // Sidebar 用：選成品時先顯示預組裝/組裝出貨會異動哪些庫存，避免送單前看不清楚。
  const ss = SpreadsheetApp.getActive();
  const masterMap = getMasterMap_(ss);
  const bomMap = getBomMap_(ss);
  const id = String(productId || "").trim();
  const product = masterMap.byId[id];
  const normalizedType = normalizeMovementType_(movementType || MOVEMENT_TYPE.ASSEMBLY_OUT, -1);

  if (!product) {
    throw new Error("找不到商品ID：" + id);
  }

  const components = bomMap.byFinishedId[id] || [];
  if (components.length === 0) {
    return {
      hasBom: false,
      productId: id,
      productName: product.name,
      message: "這個品項沒有 BOM 展開資料，會以單品異動。"
    };
  }

  const count = Number(qty);
  const safeQty = Number.isInteger(count) && count > 0 ? count : 1;
  const delta = getRequestDelta_(safeQty, normalizedType);
  const movementPlan = buildMovementPlan_(ss, masterMap, id, delta, normalizedType, bomMap);
  const stockById = buildCurrentStockById_(ss, masterMap);
  const stockError = validateMovementPlanStock_(movementPlan, stockById, {});
  const title = normalizedType === MOVEMENT_TYPE.PREBUILD_IN
    ? "預組裝入庫 " + safeQty + " 件：加成品庫存並扣 BOM 材料"
    : "組裝出貨 " + safeQty + " 件：只扣 BOM 材料，不扣成品庫存";

  return {
    hasBom: true,
    productId: id,
    productName: product.name,
    qty: safeQty,
    movementType: normalizedType,
    title: title,
    warning: stockError,
    items: movementPlan.map(function(move) {
      const beforeStock = Number(stockById[move.productId] || 0);
      return {
        productId: move.productId,
        name: move.name,
        qty: Number(move.delta || 0),
        currentStock: beforeStock,
        afterStock: beforeStock + Number(move.delta || 0)
      };
    })
  };
}

function submitInventoryChange(payload) {
  // Sidebar 表單送出後先寫入「異動申請」，等待管理者審核。
  payload = payload || {};

  const ss = SpreadsheetApp.getActive();
  const request = ensureSheetWithHeaders_(ss, SHEETS.REQUEST, HEADERS.REQUEST);
  const masterMap = getMasterMap_(ss);

  const productId = String(payload.productId || "").trim();
  const product = masterMap.byId[productId];

  if (!product) {
    throw new Error("找不到商品ID：" + productId);
  }

  if (product.status !== STATUS.ACTIVE) {
    throw new Error("停用商品不可申請異動：" + productId);
  }

  const qty = Number(payload.qty);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error("數量必須是大於 0 的數字。");
  }

  if (!Number.isInteger(qty)) {
    throw new Error("數量必須是整數。");
  }

  const movementType = normalizeMovementType_(payload.movementType || payload.reason, payload.op);
  const delta = getRequestDelta_(qty, movementType);
  const stockById = buildCurrentStockById_(ss, masterMap);
  const bomMap = getBomMap_(ss);
  const movementPlan = buildMovementPlan_(ss, masterMap, productId, delta, movementType, bomMap);
  const stockError = validateMovementPlanStock_(movementPlan, stockById, {});

  if (stockError) {
    throw new Error(stockError);
  }

  const dt = parseDateAny_(payload.date || new Date());
  const now = new Date();

  request.appendRow([
    now,
    String(payload.applicant || ""),
    dt,
    productId,
    product.name,
    delta,
    movementType,
    String(payload.note || ""),
    "",
    false,
    false,
    STATUS.PENDING,
    "",
    "",
    "",
    ""
  ]);

  const row = request.getLastRow();
  request.getRange(row, 10, 1, 2).insertCheckboxes();
  formatSheet_(request, HEADERS.REQUEST);

  return {
    ok: true,
    row: row,
    status: STATUS.PENDING
  };
}

/************************************************************
 * 審核與套用
 ************************************************************/

function batchApplyApproved() {
  // 批次處理「確認審核」已勾選或「作廢」已勾選的申請列。
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActive();
    const request = ensureSheetWithHeaders_(ss, SHEETS.REQUEST, HEADERS.REQUEST);
    const detail = ensureSheetWithHeaders_(ss, SHEETS.DETAIL, HEADERS.DETAIL);
    const reqHm = getHeaderMap_(request);
    const masterMap = getMasterMap_(ss);
    const currentStockById = buildCurrentStockById_(ss, masterMap);
    const bomMap = getBomMap_(ss);

    const lastRow = request.getLastRow();
    if (lastRow <= 1) {
      SpreadsheetApp.getUi().alert("目前沒有申請資料。");
      return;
    }

    const bodyRange = request.getRange(2, 1, lastRow - 1, HEADERS.REQUEST.length);
    const body = bodyRange.getValues();

    const now = new Date();
    const detailRows = [];
    const appliedItems = [];
    const pendingDeltaById = {};

    let applied = 0;
    let voided = 0;
    let errors = 0;

    for (let i = 0; i < body.length; i++) {
      const row = body[i];
      const sheetRow = i + 2;

      const status = getByHeader_(row, reqHm, "狀態");
      const checked = isChecked_(getByHeader_(row, reqHm, "確認審核"));
      const isVoid = isChecked_(getByHeader_(row, reqHm, "作廢"));

      if (status === STATUS.APPLIED || status === STATUS.VOIDED) {
        continue;
      }

      if (isVoid) {
        setByHeader_(row, reqHm, "確認審核", false);
        setByHeader_(row, reqHm, "狀態", STATUS.VOIDED);
        setByHeader_(row, reqHm, "審核時間", now);
        setByHeader_(row, reqHm, "錯誤訊息", "");
        voided++;
        continue;
      }

      if (!checked) {
        continue;
      }

      const reviewer = String(getByHeader_(row, reqHm, "審核者") || "").trim();
      const productId = String(getByHeader_(row, reqHm, "商品ID") || "").trim();
      const delta = Number(getByHeader_(row, reqHm, "變化數量"));
      const product = masterMap.byId[productId];

      if (!reviewer) {
        markRequestError_(row, reqHm, "請填寫審核者。");
        errors++;
        continue;
      }

      if (!product) {
        markRequestError_(row, reqHm, "找不到商品ID。");
        errors++;
        continue;
      }

      if (!Number.isFinite(delta) || delta === 0) {
        markRequestError_(row, reqHm, "變化數量必須是非 0 數字。");
        errors++;
        continue;
      }

      if (!Number.isInteger(delta)) {
        markRequestError_(row, reqHm, "變化數量必須是整數。");
        errors++;
        continue;
      }

      if (product.status !== STATUS.ACTIVE) {
        markRequestError_(row, reqHm, "停用商品不可異動。");
        errors++;
        continue;
      }

      let movementPlan;

      try {
        movementPlan = buildMovementPlan_(ss, masterMap, productId, delta, String(getByHeader_(row, reqHm, "原因") || ""), bomMap);
      } catch (err) {
        markRequestError_(row, reqHm, err.message);
        errors++;
        continue;
      }

      const stockError = validateMovementPlanStock_(movementPlan, currentStockById, pendingDeltaById);

      if (stockError) {
        markRequestError_(row, reqHm, stockError);
        errors++;
        continue;
      }

      const dt = parseDateAny_(getByHeader_(row, reqHm, "日期"));
      const nameSnapshot = String(getByHeader_(row, reqHm, "品名快照") || product.name);
      const reason = String(getByHeader_(row, reqHm, "原因") || "");
      const note = String(getByHeader_(row, reqHm, "備註") || "");
      const firstDetailRow = detail.getLastRow() + detailRows.length + 1;

      movementPlan.forEach(function(move) {
        const detailReason = move.parentProductId
          ? reason + "（成品展開：" + move.parentProductId + "）"
          : reason;
        const detailNote = move.parentProductId
          ? note + "｜原申請：" + productId + " " + nameSnapshot + " " + delta
          : note;

        detailRows.push([
          now,
          dt,
          move.productId,
          move.name,
          move.delta,
          detailReason,
          detailNote,
          sheetRow,
          reviewer
        ]);
      });

      setByHeader_(row, reqHm, "狀態", STATUS.APPLIED);
      setByHeader_(row, reqHm, "審核時間", now);
      setByHeader_(row, reqHm, "套用時間", now);
      setByHeader_(row, reqHm, "錯誤訊息", "");
      setByHeader_(row, reqHm, "明細列", buildDetailRowLabel_(firstDetailRow, movementPlan.length));

      appliedItems.push({
        productId: productId,
        name: product.name,
        delta: delta,
        reason: reason,
        reviewer: reviewer,
        expandedCount: movementPlan.length
      });

      movementPlan.forEach(function(move) {
        pendingDeltaById[move.productId] = Number(pendingDeltaById[move.productId] || 0) + Number(move.delta || 0);
      });

      applied++;
    }

    bodyRange.setValues(body);

    if (detailRows.length > 0) {
      detail
        .getRange(detail.getLastRow() + 1, 1, detailRows.length, HEADERS.DETAIL.length)
        .setValues(detailRows);
    }

    rebuildReports();
    rebuildMonthlyReport();

    let msg = buildBatchMessage_(applied, voided, errors, appliedItems);
    const discordOk = sendDiscordText_(msg);

    if (!discordOk) {
      msg += "\n\n注意：Discord 通知沒有送出，但庫存資料已經處理完成。";
    }

    SpreadsheetApp.getUi().alert(msg);
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

function markRequestError_(row, hm, message) {
  setByHeader_(row, hm, "確認審核", false);
  setByHeader_(row, hm, "狀態", STATUS.ERROR);
  setByHeader_(row, hm, "錯誤訊息", message);
}

function buildBatchMessage_(applied, voided, errors, appliedItems) {
  const maxDetail = 10;

  let msg =
    "庫存申請批次處理完成\n" +
    "已套用：" + applied + " 筆\n" +
    "已作廢：" + voided + " 筆\n" +
    "錯誤：" + errors + " 筆\n";

  if (appliedItems.length > 0) {
    msg += "\n套用明細：\n";

    appliedItems.slice(0, maxDetail).forEach(function(item, idx) {
      const sign = item.delta > 0 ? "+" : "";
      const expandText = item.expandedCount && item.expandedCount > 1
        ? "，展開明細：" + item.expandedCount + " 筆"
        : "";
      msg +=
        (idx + 1) + ". " +
        item.productId + " " +
        item.name + " " +
        sign + item.delta +
        "，原因：" + item.reason +
        "，審核：" + item.reviewer +
        expandText + "\n";
    });

    if (appliedItems.length > maxDetail) {
      msg += "...還有 " + (appliedItems.length - maxDetail) + " 筆，請到 Google Sheet 查看。\n";
    }
  }

  return msg;
}

/************************************************************
 * 報表
 ************************************************************/

function rebuildReports() {
  const ss = SpreadsheetApp.getActive();
  rebuildStockSummary_(ss);
  rebuildDailyChanges_(ss);
}

function rebuildStockSummary_(ss) {
  // 用「商品主檔初始庫存 + 庫存異動明細累計」重算總庫存表。
  const stock = ensureSheetWithHeaders_(ss, SHEETS.STOCK, HEADERS.STOCK);
  const masterMap = getMasterMap_(ss);
  const detailRows = getDetailRows_(ss);
  const deltaById = {};

  detailRows.forEach(function(detail) {
    const productId = String(detail.productId || "").trim();
    const delta = Number(detail.delta || 0);

    if (!productId || !Number.isFinite(delta)) return;
    deltaById[productId] = (deltaById[productId] || 0) + delta;
  });

  const out = masterMap.order.map(function(product) {
    const currentStock =
      Number(product.initialStock || 0) +
      Number(deltaById[product.id] || 0);

    return [
      product.id,
      product.name,
      currentStock,
      product.category,
      product.safeStock,
      product.status
    ];
  });

  stock.clearContents();
  stock.getRange(1, 1, 1, HEADERS.STOCK.length).setValues([HEADERS.STOCK]);

  if (out.length > 0) {
    stock.getRange(2, 1, out.length, HEADERS.STOCK.length).setValues(out);
  }

  formatSheet_(stock, HEADERS.STOCK);
}

function rebuildDailyChanges_(ss) {
  // 每日變化是由庫存異動明細整理出的唯讀報表。
  const daily = ensureSheetWithHeaders_(ss, SHEETS.DAILY, HEADERS.DAILY);
  const masterMap = getMasterMap_(ss);
  const detailRows = getDetailRows_(ss);

  const out = detailRows.map(function(detail) {
    const product = masterMap.byId[detail.productId];

    return [
      detail.date,
      detail.productId,
      product ? product.name : detail.nameSnapshot,
      detail.delta,
      detail.reason,
      detail.reviewer,
      detail.time
    ];
  });

  out.sort(function(a, b) {
    const dateA = a[0] instanceof Date ? a[0].getTime() : 0;
    const dateB = b[0] instanceof Date ? b[0].getTime() : 0;
    return dateB - dateA;
  });

  daily.clearContents();
  daily.getRange(1, 1, 1, HEADERS.DAILY.length).setValues([HEADERS.DAILY]);

  if (out.length > 0) {
    daily.getRange(2, 1, out.length, HEADERS.DAILY.length).setValues(out);
  }

  formatDailySheet_(daily);
}

function formatDailySheet_(sh) {
  formatSheet_(sh, HEADERS.DAILY);
  sh.getRange("A:A").setNumberFormat("yyyy/m/d");
  sh.getRange("G:G").setNumberFormat("yyyy/m/d hh:mm");
}

function clearDailyReport() {
  // 只清資料列，保留表頭與格式；下次重建報表會再補回資料。
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.DAILY);

  if (!sh) {
    throw new Error("找不到工作表：" + SHEETS.DAILY);
  }

  const lastRow = sh.getLastRow();
  if (lastRow <= 1) return;

  sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).clearContent();
}

function rebuildMonthlyReport() {
  // 依照目前月份重算月初、本月入庫、本月出庫與月末庫存。
  const ss = SpreadsheetApp.getActive();
  const sh = ensureSheetWithHeaders_(ss, SHEETS.MONTHLY, HEADERS.MONTHLY);
  const masterMap = getMasterMap_(ss);
  const details = getDetailRows_(ss);
  const tz = Session.getScriptTimeZone();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthLabel = Utilities.formatDate(monthStart, tz, "yyyy/MM");
  const out = [];

  masterMap.order.forEach(function(product) {
    let before = Number(product.initialStock || 0);
    let inQty = 0;
    let outQty = 0;

    details.forEach(function(detail) {
      const dt = normalizeDate_(detail.date);
      if (!dt || detail.productId !== product.id) return;

      const delta = Number(detail.delta || 0);

      if (dt < monthStart) {
        before += delta;
      }

      if (dt >= monthStart && dt < nextMonth) {
        if (delta > 0) inQty += delta;
        if (delta < 0) outQty += Math.abs(delta);
      }
    });

    if (inQty || outQty) {
      const net = inQty - outQty;

      out.push([
        monthLabel,
        product.id,
        product.name,
        product.category,
        before,
        inQty,
        outQty,
        net,
        before + net
      ]);
    }
  });

  sh.clearContents();
  sh.getRange(1, 1, 1, HEADERS.MONTHLY.length).setValues([HEADERS.MONTHLY]);

  if (out.length > 0) {
    sh.getRange(2, 1, out.length, HEADERS.MONTHLY.length).setValues(out);
  }

  sh.setFrozenRows(1);
  formatSheet_(sh, HEADERS.MONTHLY);
}

function formatAllSheets() {
  formatAllSheets_();
  SpreadsheetApp.getUi().alert("已自動調整所有庫存系統工作表的欄寬與列高。");
}

/************************************************************
 * 老闆儀表板資料
 ************************************************************/

function getBossDashboardData() {
  // BossDashboard.html 的唯一資料來源，回傳統計卡、Top 10 與庫存警示。
  const ss = SpreadsheetApp.getActive();
  const tz = Session.getScriptTimeZone();
  const now = new Date();

  const todayKey = Utilities.formatDate(now, tz, "yyyy/MM/dd");
  const monthKey = Utilities.formatDate(now, tz, "yyyy/MM");

  const detail = ss.getSheetByName(SHEETS.DETAIL);
  const stock = ss.getSheetByName(SHEETS.STOCK);

  if (!detail) throw new Error("找不到工作表：" + SHEETS.DETAIL);
  if (!stock) throw new Error("找不到工作表：" + SHEETS.STOCK);

  const result = {
    generatedAt: Utilities.formatDate(now, tz, "yyyy/MM/dd HH:mm"),
    today: { inQty: 0, outQty: 0, count: 0 },
    month: { label: monthKey, inQty: 0, outQty: 0, net: 0 },
    todayOutTop: [],
    todayInTop: [],
    monthOutTop: [],
    monthNetTop: [],
    categoryTop: {
      todayOut: {},
      todayIn: {},
      monthOut: {},
      monthNet: {}
    },
    lowStock: [],
    zeroStock: []
  };

  const stockInfo = readStockInfoForDashboard_(stock);
  const todayOutAllMap = {};
  const todayInAllMap = {};
  const monthOutAllMap = {};
  const monthNetAllMap = {};
  const todayOutMap = {};
  const todayInMap = {};
  const monthOutMap = {};
  const monthNetMap = {};

  stockInfo.categories.forEach(function(category) {
    todayOutMap[category] = {};
    todayInMap[category] = {};
    monthOutMap[category] = {};
    monthNetMap[category] = {};
  });

  if (detail.getLastRow() > 1) {
    const rows = detail
      .getRange(2, 1, detail.getLastRow() - 1, detail.getLastColumn())
      .getValues();

    rows.forEach(function(row) {
      const date = normalizeDate_(row[1]);
      if (!date) return;

      const dateKey = Utilities.formatDate(date, tz, "yyyy/MM/dd");
      const rowMonthKey = Utilities.formatDate(date, tz, "yyyy/MM");
      const productId = String(row[2] || "").trim();
      const name = String(row[3] || "").trim();
      const delta = Number(row[4]) || 0;

      if (!productId || !delta) return;

      const category = stockInfo.categoryById[productId] || "未分類";

      if (!todayOutMap[category]) todayOutMap[category] = {};
      if (!todayInMap[category]) todayInMap[category] = {};
      if (!monthOutMap[category]) monthOutMap[category] = {};
      if (!monthNetMap[category]) monthNetMap[category] = {};

      if (dateKey === todayKey) {
        result.today.count++;

        if (delta < 0) {
          const qty = Math.abs(delta);
          result.today.outQty += qty;
          addBossQty_(todayOutAllMap, productId, name, qty);
          addBossQty_(todayOutMap[category], productId, name, qty);
        }

        if (delta > 0) {
          result.today.inQty += delta;
          addBossQty_(todayInAllMap, productId, name, delta);
          addBossQty_(todayInMap[category], productId, name, delta);
        }
      }

      if (rowMonthKey === monthKey) {
        result.month.net += delta;
        addBossQty_(monthNetAllMap, productId, name, delta);
        addBossQty_(monthNetMap[category], productId, name, delta);

        if (delta < 0) {
          const qty = Math.abs(delta);
          result.month.outQty += qty;
          addBossQty_(monthOutAllMap, productId, name, qty);
          addBossQty_(monthOutMap[category], productId, name, qty);
        }

        if (delta > 0) {
          result.month.inQty += delta;
        }
      }
    });
  }

  stockInfo.categories.forEach(function(category) {
    result.categoryTop.todayOut[category] = bossTop_(todayOutMap[category], 10, false);
    result.categoryTop.todayIn[category] = bossTop_(todayInMap[category], 10, false);
    result.categoryTop.monthOut[category] = bossTop_(monthOutMap[category], 10, false);
    result.categoryTop.monthNet[category] = bossTop_(monthNetMap[category], 10, true);
  });

  result.todayOutTop = bossTop_(todayOutAllMap, 10, false);
  result.todayInTop = bossTop_(todayInAllMap, 10, false);
  result.monthOutTop = bossTop_(monthOutAllMap, 10, false);
  result.monthNetTop = bossTop_(monthNetAllMap, 10, true);
  result.lowStock = stockInfo.lowStock.slice(0, 20);
  result.zeroStock = stockInfo.zeroStock.slice(0, 20);

  return result;
}

function readStockInfoForDashboard_(stock) {
  // 從總庫存表整理分類對照、低庫存與零庫存清單。
  const categoryById = {};
  const categories = [];
  const categorySeen = {};
  const lowStock = [];
  const zeroStock = [];

  if (stock.getLastRow() <= 1) {
    return {
      categoryById: categoryById,
      categories: categories,
      lowStock: lowStock,
      zeroStock: zeroStock
    };
  }

  const rows = stock
    .getRange(2, 1, stock.getLastRow() - 1, stock.getLastColumn())
    .getValues();

  rows.forEach(function(row) {
    const item = {
      productId: String(row[0] || "").trim(),
      name: String(row[1] || "").trim(),
      stock: Number(row[2]) || 0,
      category: String(row[3] || "未分類").trim() || "未分類",
      safety: Number(row[4]) || 0,
      status: String(row[5] || "").trim()
    };

    if (!item.productId) return;
    if (item.status === STATUS.INACTIVE) return;

    categoryById[item.productId] = item.category;

    if (!categorySeen[item.category]) {
      categorySeen[item.category] = true;
      categories.push(item.category);
    }

    if (item.stock === 0) {
      zeroStock.push(item);
    }

    if (item.safety > 0 && item.stock <= item.safety) {
      lowStock.push(item);
    }
  });

  categories.sort();

  return {
    categoryById: categoryById,
    categories: categories,
    lowStock: lowStock,
    zeroStock: zeroStock
  };
}

function addBossQty_(map, productId, name, qty) {
  // 將同一商品的數量累加到指定統計 map。
  if (!map[productId]) {
    map[productId] = {
      productId: productId,
      name: name,
      qty: 0
    };
  }

  map[productId].qty += qty;
}

function bossTop_(map, limit, sortByAbs) {
  // 把統計 map 轉成排序後的 Top N 陣列。
  return Object.keys(map || {})
    .map(function(key) {
      return map[key];
    })
    .filter(function(item) {
      return Number(item.qty) !== 0;
    })
    .sort(function(a, b) {
      const av = sortByAbs ? Math.abs(a.qty) : a.qty;
      const bv = sortByAbs ? Math.abs(b.qty) : b.qty;
      return bv - av;
    })
    .slice(0, limit);
}

/************************************************************
 * 共用工具
 ************************************************************/

function ensureSheetWithHeaders_(ss, name, headers) {
  // 表不存在就建立；表頭不一致時只重寫第一列。
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const width = Math.max(headers.length, sh.getLastColumn() || 1);

  const current = sh.getRange(1, 1, 1, width)
    .getValues()[0]
    .map(function(value) {
      return String(value || "").trim();
    });

  let needWrite = false;

  for (let i = 0; i < headers.length; i++) {
    if (current[i] !== headers[i]) {
      needWrite = true;
      break;
    }
  }

  if (needWrite) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sh;
}

function setupRequestSheetValidation_(sh) {
  // J/K 欄是 checkbox，L 欄是申請狀態下拉。
  const maxRows = 2000;

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      STATUS.PENDING,
      STATUS.APPLIED,
      STATUS.VOIDED,
      STATUS.ERROR
    ], true)
    .build();

  sh.getRange(2, 10, maxRows, 2).insertCheckboxes();
  sh.getRange(2, 12, maxRows, 1).setDataValidation(statusRule);
  formatSheet_(sh, HEADERS.REQUEST);
}

function setupMasterSheetValidation_(sh) {
  // 商品主檔：F 欄狀態、J 欄商品類型用下拉，避免手打造成表單篩選失準。
  const maxRows = 2000;
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.ACTIVE, STATUS.INACTIVE], true)
    .build();
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      PRODUCT_TYPE.NORMAL,
      PRODUCT_TYPE.FINISHED,
      PRODUCT_TYPE.MATERIAL,
      PRODUCT_TYPE.MODULE
    ], true)
    .build();

  sh.getRange(2, 6, maxRows, 1).setDataValidation(statusRule);
  sh.getRange(2, 10, maxRows, 1).setDataValidation(typeRule);
  formatSheet_(sh, HEADERS.MASTER);
}

function setupBomSheetValidation_(sh) {
  // F 欄是 BOM 狀態，讓材料替換時用停用/啟用管理，不改程式。
  const maxRows = 2000;
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.ACTIVE, STATUS.INACTIVE], true)
    .build();
  const qtyRule = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setAllowInvalid(false)
    .build();

  sh.getRange(2, 5, maxRows, 1).setDataValidation(qtyRule);
  sh.getRange(2, 6, maxRows, 1).setDataValidation(statusRule);
  formatSheet_(sh, HEADERS.BOM);
}

function insertBomTemplateRows() {
  const ss = SpreadsheetApp.getActive();
  const sh = ensureSheetWithHeaders_(ss, SHEETS.BOM, HEADERS.BOM);

  if (sh.getLastRow() > 1) {
    SpreadsheetApp.getUi().alert("組合用料表已經有資料，沒有覆蓋既有 BOM。");
    return;
  }

  const now = new Date();
  const rows = [
    ["V20-36IR", "V20 3.6槍型紅外線攝影機", "CY001-SHELL", "CY001 殼", 1, STATUS.ACTIVE, "範例：外殼", now, now],
    ["V20-36IR", "V20 3.6槍型紅外線攝影機", "CY001-COVER", "CY001 前蓋", 1, STATUS.ACTIVE, "範例：前蓋", now, now],
    ["V20-36IR", "V20 3.6槍型紅外線攝影機", "CY001-RAIN", "CY001 防雨罩", 1, STATUS.ACTIVE, "範例：防雨罩", now, now],
    ["V20-36IR", "V20 3.6槍型紅外線攝影機", "MOD-V20", "V20 模組", 1, STATUS.ACTIVE, "範例：模組", now, now]
  ];

  sh.getRange(2, 1, rows.length, HEADERS.BOM.length).setValues(rows);
  setupBomSheetValidation_(sh);
  SpreadsheetApp.getUi().alert("已建立 BOM 範本資料，請依你的實際料號修改。");
}

function formatAllSheets_() {
  // 統一套用欄寬、換行與列高，避免每次重建報表後還要手動拉欄位。
  const ss = SpreadsheetApp.getActive();
  const configs = [
    [SHEETS.MASTER, HEADERS.MASTER],
    [SHEETS.REQUEST, HEADERS.REQUEST],
    [SHEETS.DETAIL, HEADERS.DETAIL],
    [SHEETS.STOCK, HEADERS.STOCK],
    [SHEETS.DAILY, HEADERS.DAILY],
    [SHEETS.MONTHLY, HEADERS.MONTHLY],
    [SHEETS.BOM, HEADERS.BOM]
  ];

  configs.forEach(function(config) {
    const sh = ss.getSheetByName(config[0]);
    if (sh) formatSheet_(sh, config[1]);
  });
}

function formatSheet_(sh, headers) {
  // 避免 DEADLINE_EXCEEDED：只格式化系統欄位與前 500 列，不整張表反覆重刷。
  const width = headers.length;
  fitSheetColumns_(sh, width);

  const lastRow = Math.max(sh.getLastRow(), 1);
  const formatRows = Math.min(lastRow, 500);
  const widths = getPreferredColumnWidths_(sh.getName());

  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, width)
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#1f4e79")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  sh.getRange(1, 1, formatRows, width)
    .setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  for (let col = 1; col <= width; col++) {
    const preferred = widths[col - 1];
    if (preferred) {
      sh.setColumnWidth(col, preferred);
      continue;
    }

    const current = sh.getColumnWidth(col);
    sh.setColumnWidth(col, Math.min(Math.max(current, 90), 260));
  }

  sh.setRowHeight(1, 32);

  if (formatRows > 1) {
    sh.setRowHeights(2, formatRows - 1, 28);
  }

  resetSheetFilter_(sh, width, lastRow);
  setSheetNumberFormats_(sh);
  applySystemConditionalFormatting_(sh, width, Math.max(formatRows, 2));
}

function fitSheetColumns_(sh, width) {
  // 系統表只保留系統欄位，避免右側殘留空欄/舊表格物件讓畫面變亂。
  try {
    const existing = sh.getFilter();
    if (existing) existing.remove();
  } catch (e) {}

  const maxColumns = sh.getMaxColumns();

  if (maxColumns < width) {
    sh.insertColumnsAfter(maxColumns, width - maxColumns);
    return;
  }

  if (maxColumns > width) {
    sh.deleteColumns(width + 1, maxColumns - width);
  }
}

function resetSheetFilter_(sh, width, lastRow) {
  try {
    const existing = sh.getFilter();
    if (existing) existing.remove();

    if (lastRow >= 1) {
      sh.getRange(1, 1, Math.max(lastRow, 2), width).createFilter();
    }
  } catch (e) {
    console.log("篩選器設定略過：" + sh.getName() + " / " + e.message);
  }
}

function setSheetNumberFormats_(sh) {
  const name = sh.getName();

  if (name === SHEETS.MASTER) {
    sh.getRange("D:E").setNumberFormat("0");
    sh.getRange("H:I").setNumberFormat("yyyy/m/d");
    sh.getRange("K:K").setNumberFormat("#,##0.00");
  }

  if (name === SHEETS.REQUEST) {
    sh.getRange("A:A").setNumberFormat("yyyy/m/d hh:mm");
    sh.getRange("C:C").setNumberFormat("yyyy/m/d");
    sh.getRange("F:F").setNumberFormat("0");
    sh.getRange("M:N").setNumberFormat("yyyy/m/d hh:mm");
  }

  if (name === SHEETS.DETAIL) {
    sh.getRange("A:A").setNumberFormat("yyyy/m/d hh:mm");
    sh.getRange("B:B").setNumberFormat("yyyy/m/d");
    sh.getRange("E:E").setNumberFormat("0");
  }

  if (name === SHEETS.STOCK) {
    sh.getRange("C:E").setNumberFormat("0");
  }

  if (name === SHEETS.DAILY) {
    sh.getRange("A:A").setNumberFormat("yyyy/m/d");
    sh.getRange("D:D").setNumberFormat("0");
    sh.getRange("G:G").setNumberFormat("yyyy/m/d hh:mm");
  }

  if (name === SHEETS.MONTHLY) {
    sh.getRange("E:I").setNumberFormat("0");
  }

  if (name === SHEETS.BOM) {
    sh.getRange("E:E").setNumberFormat("0");
    sh.getRange("H:I").setNumberFormat("yyyy/m/d");
  }
}

function applySystemConditionalFormatting_(sh, width, formatRows) {
  const name = sh.getName();
  const rules = [];

  if (formatRows <= 1) {
    sh.setConditionalFormatRules(rules);
    return;
  }

  const body = sh.getRange(2, 1, formatRows - 1, width);

  if (name === SHEETS.STOCK) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=AND($A2<>"",$C2=0)')
        .setBackground("#fce8e6")
        .setRanges([body])
        .build()
    );
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=AND($A2<>"",$E2>0,$C2>0,$C2<=$E2)')
        .setBackground("#fff4ce")
        .setRanges([body])
        .build()
    );
  }

  if (name === SHEETS.REQUEST) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$L2="' + STATUS.ERROR + '"')
        .setBackground("#fce8e6")
        .setRanges([body])
        .build()
    );
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$L2="' + STATUS.APPLIED + '"')
        .setBackground("#e6f4ea")
        .setRanges([body])
        .build()
    );
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$L2="' + STATUS.VOIDED + '"')
        .setBackground("#f1f3f4")
        .setRanges([body])
        .build()
    );
  }

  if (name === SHEETS.MASTER) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$F2="' + STATUS.INACTIVE + '"')
        .setBackground("#f1f3f4")
        .setFontColor("#666666")
        .setRanges([body])
        .build()
    );
  }

  if (name === SHEETS.BOM) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=$F2="' + STATUS.INACTIVE + '"')
        .setBackground("#f1f3f4")
        .setFontColor("#666666")
        .setRanges([body])
        .build()
    );
  }

  sh.setConditionalFormatRules(rules);
}

function getPreferredColumnWidths_(sheetName) {
  // 依照每張表最常看的欄位給固定寬度；未列出的欄位走自動欄寬。
  const widthsBySheet = {};

  widthsBySheet[SHEETS.MASTER] = [90, 260, 130, 90, 90, 80, 220, 130, 130, 90, 90];
  widthsBySheet[SHEETS.REQUEST] = [130, 100, 110, 90, 260, 90, 100, 220, 100, 90, 70, 90, 130, 130, 220, 80];
  widthsBySheet[SHEETS.DETAIL] = [130, 110, 90, 260, 90, 100, 220, 80, 100];
  widthsBySheet[SHEETS.STOCK] = [90, 260, 90, 130, 90, 80];
  widthsBySheet[SHEETS.DAILY] = [110, 90, 260, 90, 100, 100, 130];
  widthsBySheet[SHEETS.MONTHLY] = [100, 90, 260, 130, 90, 90, 90, 90, 90];
  widthsBySheet[SHEETS.BOM] = [100, 260, 100, 260, 90, 80, 240, 130, 130];

  return widthsBySheet[sheetName] || [];
}

function getHeaderMap_(sh) {
  // 把第一列表頭轉成 {表頭名稱: zero-based 欄位索引}。
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn())
    .getValues()[0]
    .map(function(value) {
      return String(value || "").trim();
    });

  const map = {};

  headers.forEach(function(header, index) {
    if (header) map[header] = index;
  });

  return map;
}

function getByHeader_(row, headerMap, name) {
  // 依表頭名稱取值，避免硬寫欄位數字。
  if (headerMap[name] === undefined) {
    throw new Error("找不到必要欄位：" + name);
  }

  return row[headerMap[name]];
}

function setByHeader_(row, headerMap, name, value) {
  // 依表頭名稱寫值，配合 bodyRange.setValues 一次回寫。
  if (headerMap[name] === undefined) {
    throw new Error("找不到必要欄位：" + name);
  }

  row[headerMap[name]] = value;
}

function getMasterMap_(ss) {
  // 回傳 byId 方便查商品，也保留 order 供報表照表格順序輸出。
  const sh = ensureSheetWithHeaders_(ss, SHEETS.MASTER, HEADERS.MASTER);
  const hm = getHeaderMap_(sh);
  const lastRow = sh.getLastRow();

  const byId = {};
  const order = [];

  if (lastRow <= 1) {
    return { byId: byId, order: order };
  }

  const values = sh.getRange(2, 1, lastRow - 1, HEADERS.MASTER.length).getValues();

  values.forEach(function(row) {
    const id = String(row[hm["商品ID"]] || "").trim();
    if (!id) return;

    const item = {
      id: id,
      name: String(row[hm["目前品名"]] || "").trim(),
      category: String(row[hm["分類"]] || "").trim() || "未分類",
      initialStock: Number(row[hm["初始庫存"]] || 0),
      safeStock: row[hm["安全庫存"]],
      status: String(row[hm["狀態"]] || STATUS.ACTIVE).trim() || STATUS.ACTIVE,
      alias: String(row[hm["舊品名/別名"]] || "").trim(),
      type: String(row[hm["商品類型"]] || PRODUCT_TYPE.NORMAL).trim() || PRODUCT_TYPE.NORMAL,
      standardCost: Number(row[hm["標準成本"]] || 0)
    };

    byId[id] = item;
    order.push(item);
  });

  return { byId: byId, order: order };
}

function getCurrentStockByProductId_(ss, productId) {
  // 用商品主檔初始庫存加上已生效異動明細，取得目前可用庫存。
  const masterMap = getMasterMap_(ss);
  const stockById = buildCurrentStockById_(ss, masterMap);

  return Number(stockById[productId] || 0);
}

function buildCurrentStockById_(ss, masterMap) {
  // 批次審核時一次算完所有商品庫存，避免每列重讀異動明細造成逾時。
  const stockById = {};

  masterMap.order.forEach(function(product) {
    stockById[product.id] = Number(product.initialStock || 0);
  });

  getDetailRows_(ss).forEach(function(detail) {
    if (stockById[detail.productId] !== undefined) {
      stockById[detail.productId] += Number(detail.delta || 0);
    }
  });

  return stockById;
}

function normalizeMovementType_(value, fallback) {
  const text = String(value || "").trim();

  if (text === MOVEMENT_TYPE.STOCK_OUT ||
      text === MOVEMENT_TYPE.STOCK_IN ||
      text === MOVEMENT_TYPE.PREBUILD_IN ||
      text === MOVEMENT_TYPE.ASSEMBLY_OUT ||
      text === MOVEMENT_TYPE.REPAIR_IN) {
    return text;
  }

  // 舊資料或人工輸入如果有寫到 BOM/組裝，依正負數推回預組裝或組裝出貨。
  if (text.indexOf("組裝") >= 0 || text.toUpperCase().indexOf("BOM") >= 0) {
    if (text.indexOf("預組裝") >= 0 || fallback === "add" || Number(fallback) > 0) {
      return MOVEMENT_TYPE.PREBUILD_IN;
    }

    return MOVEMENT_TYPE.ASSEMBLY_OUT;
  }

  if (fallback === "add") return MOVEMENT_TYPE.STOCK_IN;
  if (fallback === "sub") return MOVEMENT_TYPE.STOCK_OUT;
  if (Number(fallback) > 0) return MOVEMENT_TYPE.STOCK_IN;
  return MOVEMENT_TYPE.STOCK_OUT;
}

function getRequestDelta_(qty, movementType) {
  const count = Number(qty);
  const safeQty = Math.abs(count);

  if (movementType === MOVEMENT_TYPE.STOCK_IN ||
      movementType === MOVEMENT_TYPE.PREBUILD_IN ||
      movementType === MOVEMENT_TYPE.REPAIR_IN) {
    return safeQty;
  }

  return -safeQty;
}

function isBomMovementType_(movementType) {
  return movementType === MOVEMENT_TYPE.PREBUILD_IN ||
    movementType === MOVEMENT_TYPE.ASSEMBLY_OUT;
}

function buildMovementPlan_(ss, masterMap, productId, delta, reason, bomMap) {
  // 四種模式：
  // 出貨：只扣商品本身；入庫：只加商品本身；
  // 預組裝入庫：扣 BOM 材料並加成品；組裝出貨：只扣 BOM 材料。
  const product = masterMap.byId[productId];

  if (!product) {
    throw new Error("找不到商品ID：" + productId);
  }

  const resolvedBomMap = bomMap || getBomMap_(ss);
  const components = resolvedBomMap.byFinishedId[productId] || [];
  const movementType = normalizeMovementType_(reason, delta);
  const isFinishedProduct = product.type === PRODUCT_TYPE.FINISHED;
  const qty = Math.abs(Number(delta || 0));

  if (isBomMovementType_(movementType) && !isFinishedProduct) {
    throw new Error("只有成品可以使用「" + movementType + "」：" + productId);
  }

  if (isBomMovementType_(movementType) && components.length === 0) {
    throw new Error(
      "此成品沒有 BOM，無法使用「" + movementType + "」：" +
      productId +
      "。請先在「組合用料表」補上成品ID對應材料。"
    );
  }

  if (!isBomMovementType_(movementType)) {
    return [{
      productId: productId,
      name: product.name,
      delta: getRequestDelta_(qty, movementType),
      parentProductId: "",
      parentName: ""
    }];
  }

  const out = [];

  if (movementType === MOVEMENT_TYPE.PREBUILD_IN) {
    out.push({
      productId: productId,
      name: product.name,
      delta: qty,
      parentProductId: "",
      parentName: ""
    });
  }

  components.forEach(function(component) {
    const material = masterMap.byId[component.materialId];

    if (!material) {
      throw new Error("BOM 材料不存在：" + component.materialId);
    }

    if (material.status !== STATUS.ACTIVE) {
      throw new Error("BOM 材料已停用不可扣庫存：" + component.materialId);
    }

    const componentDelta = -qty * component.unitQty;

    if (!Number.isInteger(componentDelta)) {
      throw new Error("BOM 展開後數量必須是整數：" + component.materialId);
    }

    out.push({
      productId: component.materialId,
      name: material.name || component.materialName,
      delta: componentDelta,
      parentProductId: productId,
      parentName: product.name,
      reason: movementType
    });
  });

  return out;
}

function validateMovementPlanStock_(movementPlan, currentStockById, pendingDeltaById) {
  // 用同一批次的 pending delta 檢查材料是否會被前面申請先扣到不足。
  const simulatedDeltaById = {};

  for (let i = 0; i < movementPlan.length; i++) {
    const move = movementPlan[i];
    const currentStock = Number(currentStockById[move.productId] || 0);
    const pendingDelta = Number(pendingDeltaById[move.productId] || 0);
    const simulatedDelta = Number(simulatedDeltaById[move.productId] || 0);
    const beforeStock = currentStock + pendingDelta + simulatedDelta;
    const afterStock = beforeStock + Number(move.delta || 0);

    if (afterStock < 0) {
      return "庫存不足：" + move.productId + " " + move.name +
        "，異動後不可為負庫存。目前庫存：" + beforeStock;
    }

    simulatedDeltaById[move.productId] = simulatedDelta + Number(move.delta || 0);
  }

  return "";
}

function getBomMap_(ss) {
  // 組合用料表是一個成品對多個材料的關聯表。
  const sh = ensureSheetWithHeaders_(ss, SHEETS.BOM, HEADERS.BOM);
  const hm = getHeaderMap_(sh);
  const lastRow = sh.getLastRow();
  const byFinishedId = {};

  if (lastRow <= 1) {
    return { byFinishedId: byFinishedId };
  }

  const values = sh.getRange(2, 1, lastRow - 1, HEADERS.BOM.length).getValues();

  values.forEach(function(row) {
    const finishedId = String(row[hm["成品ID"]] || "").trim();
    const materialId = String(row[hm["材料ID"]] || "").trim();
    const unitQty = Number(row[hm["單位用量"]]);
    const status = String(row[hm["狀態"]] || STATUS.ACTIVE).trim() || STATUS.ACTIVE;

    if (!finishedId || !materialId) return;
    if (status !== STATUS.ACTIVE) return;

    if (!Number.isFinite(unitQty) || unitQty <= 0) {
      throw new Error("BOM 單位用量必須大於 0：" + finishedId + " -> " + materialId);
    }

    if (!byFinishedId[finishedId]) {
      byFinishedId[finishedId] = [];
    }

    byFinishedId[finishedId].push({
      finishedId: finishedId,
      finishedName: String(row[hm["成品名稱"]] || "").trim(),
      materialId: materialId,
      materialName: String(row[hm["材料名稱"]] || "").trim(),
      unitQty: unitQty,
      note: String(row[hm["備註"]] || "").trim()
    });
  });

  return { byFinishedId: byFinishedId };
}

function buildDetailRowLabel_(firstRow, count) {
  if (count <= 1) {
    return firstRow;
  }

  return firstRow + "-" + (firstRow + count - 1);
}

function getDetailRows_(ss) {
  // 將異動明細表轉成物件陣列，供庫存、日報、月報共用。
  const sh = ensureSheetWithHeaders_(ss, SHEETS.DETAIL, HEADERS.DETAIL);
  const hm = getHeaderMap_(sh);
  const lastRow = sh.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const values = sh.getRange(2, 1, lastRow - 1, HEADERS.DETAIL.length).getValues();

  return values
    .filter(function(row) {
      return String(row[hm["商品ID"]] || "").trim();
    })
    .map(function(row) {
      return {
        time: row[hm["異動時間"]],
        date: row[hm["日期"]],
        productId: String(row[hm["商品ID"]] || "").trim(),
        nameSnapshot: String(row[hm["品名快照"]] || "").trim(),
        delta: Number(row[hm["變化數量"]] || 0),
        reason: String(row[hm["原因"]] || "").trim(),
        note: String(row[hm["備註"]] || "").trim(),
        requestRow: row[hm["申請列"]],
        reviewer: String(row[hm["審核者"]] || "").trim()
      };
    });
}

function normalizeDate_(value) {
  // 報表讀取用：無法解析時回傳 null，不中斷整份報表。
  if (value instanceof Date && !isNaN(value)) {
    return value;
  }

  if (!value) {
    return null;
  }

  const date = new Date(value);
  return isNaN(date) ? null : date;
}

function isChecked_(value) {
  // Apps Script checkbox 可能是 true/false；Excel 匯入副本可能是 1/0。
  return value === true || value === 1 || String(value).toUpperCase() === "TRUE";
}

function parseDateAny_(value) {
  // 表單輸入用：接受 Date 或 yyyy/MM/dd、yyyy-MM-dd。
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);
  }

  const text = String(value || "").trim().replace(/-/g, "/");
  const parts = text.split("/");

  if (parts.length !== 3) {
    throw new Error("日期格式錯誤，請使用 yyyy/MM/dd。");
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error("日期格式錯誤，請使用 yyyy/MM/dd。");
  }

  return new Date(year, month - 1, day, 12, 0, 0);
}

/************************************************************
 * Discord 通知
 ************************************************************/

function sendDiscordText_(text) {
  // Discord webhook 未設定時不阻擋庫存流程，只回傳 false。
  const webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  if (!webhookUrl) {
    console.log("未設定 DISCORD_WEBHOOK_URL，略過 Discord 通知。");
    return false;
  }

  const safeText = String(text || "").slice(0, 1800);
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      username: "庫存系統通知",
      content: safeText
    }),
    muteHttpExceptions: true
  };

  try {
    let response = UrlFetchApp.fetch(webhookUrl, options);
    let code = response.getResponseCode();
    let body = response.getContentText();

    console.log("Discord response 1:", code, body);

    // Discord 回 429 時，依照 retry_after 短暫等待後重送一次。
    if (code === 429) {
      let waitMs = 5000;

      try {
        const json = JSON.parse(body);
        if (json.retry_after) {
          waitMs = Math.ceil(Number(json.retry_after) * 1000) + 500;
        }
      } catch (e) {}

      Utilities.sleep(Math.min(waitMs, 10000));

      response = UrlFetchApp.fetch(webhookUrl, options);
      code = response.getResponseCode();
      body = response.getContentText();

      console.log("Discord response 2:", code, body);
    }

    if (code < 200 || code >= 300) {
      console.log("Discord 通知失敗：", code, body);
      return false;
    }

    return true;
  } catch (err) {
    console.log("Discord 通知發生錯誤：", err.message);
    return false;
  }
}
