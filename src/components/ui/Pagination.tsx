"use client";

// 分頁：依設計稿「« ‹ 1 2 3 › »」，12pt，目前頁 #5b6d8b 底白字。
interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
  // 頁碼最多顯示幾個
  windowSize?: number;
}

// 手機上放大到 32px 方便點按，桌機維持設計稿的 26px
const boxBase = "flex h-8 min-w-8 items-center justify-center border px-1 text-xs sm:h-[26px] sm:min-w-[26px]";

export default function Pagination({ page, pageCount, onChange, className = "", windowSize = 6 }: PaginationProps) {
  if (pageCount <= 1) return null;

  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(pageCount, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const go = (target: number) => {
    const next = Math.min(pageCount, Math.max(1, target));
    if (next !== page) onChange(next);
  };

  const navButton = (label: string, target: number, disabled: boolean, ariaLabel: string) => (
    <button
      type="button"
      onClick={() => go(target)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${boxBase} border-brand-grey/70 bg-white text-brand-muted hover:border-brand-blue hover:text-brand-blue disabled:cursor-default disabled:opacity-40`}
    >
      {label}
    </button>
  );

  return (
    <nav aria-label="分頁" className={`flex flex-wrap items-center justify-center gap-[3px] ${className}`}>
      {navButton("«", 1, page === 1, "第一頁")}
      {navButton("‹", page - 1, page === 1, "上一頁")}
      {pages.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => go(value)}
          aria-current={value === page ? "page" : undefined}
          className={`${boxBase} ${
            value === page
              ? "border-brand-blue bg-brand-blue font-bold text-white"
              : "border-brand-grey/70 bg-white text-brand-muted hover:border-brand-blue hover:text-brand-blue"
          }`}
        >
          {value}
        </button>
      ))}
      {navButton("›", page + 1, page === pageCount, "下一頁")}
      {navButton("»", pageCount, page === pageCount, "最後一頁")}
    </nav>
  );
}
