// 搜尋按下 Enter／鍵盤「搜尋」後的回饋（產品中心、文件下載共用）：
// 收起手機鍵盤，結果數量不在畫面上時捲過去，再把底色閃一下，讓客人知道已經搜尋了。
// 結果數量的元素要有 id（全站 [id] 有預留固定頁首的高度）和 tabIndex={-1}。
export function revealResults(target: HTMLElement | null, input?: HTMLElement | null) {
  input?.blur();
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // 等手機鍵盤開始收起、畫面高度恢復後再判斷要不要捲動
  window.setTimeout(() => {
    const rect = target.getBoundingClientRect();
    const topLimit = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const inView = rect.top >= topLimit && rect.bottom <= window.innerHeight;
    if (!inView) target.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
    if (!reduceMotion && typeof target.animate === "function") {
      target.animate(
        [
          { backgroundColor: "#e2e8f0", boxShadow: "0 0 0 6px #e2e8f0", borderRadius: "3px" },
          { backgroundColor: "rgba(226, 232, 240, 0)", boxShadow: "0 0 0 6px rgba(226, 232, 240, 0)", borderRadius: "3px" },
        ],
        { duration: 1400, easing: "ease-out", delay: inView ? 0 : 350 },
      );
    }
  }, 80);
}
