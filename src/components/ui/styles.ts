// 按鈕與小標籤的共用樣式（依設計稿「圓角矩形」：圖示框 8px、按鈕 5px、選單與標籤 3px）

export type ButtonVariant = "primary" | "outline" | "light" | "ghostLight";
export type ButtonSize = "lg" | "md" | "sm";

const buttonBase =
  "inline-flex items-center justify-center gap-3 rounded-[5px] font-bold tracking-[0.1em] whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  // 藍灰底白字：填寫表單需求、寄送 Email、詢問此型號
  primary: "bg-brand-blue text-white hover:bg-brand-navy",
  // 白底藍灰框：文件下載、相關文件下載
  outline: "border-2 border-brand-blue bg-white text-brand-blue hover:bg-brand-panel",
  // 深色背景上的白底按鈕：詢價與合作
  light: "bg-white text-brand-blue hover:bg-brand-panel",
  // 深色背景上的白框按鈕：查看產品中心、文件下載
  ghostLight: "border-2 border-white text-white hover:bg-white/10",
};

const buttonSizes: Record<ButtonSize, string> = {
  lg: "h-[52px] px-7 text-lg lg:h-[58px] lg:text-xl",
  md: "h-[42px] px-5 text-base",
  sm: "h-[34px] px-4 text-sm",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`.trim();
}

export type ChipVariant = "solid" | "outline" | "outlineLight";
// sm = 10pt（產品頁的分類／型號／品牌）；md = 12pt（案例場景的設備標籤，11/03 修改稿由 10pt 改 12pt）
export type ChipSize = "sm" | "md";

const chipVariants: Record<ChipVariant, string> = {
  solid: "border-brand-blue bg-brand-blue text-white",
  outline: "border-brand-blue bg-white text-brand-blue",
  outlineLight: "border-white text-white",
};

const chipSizes: Record<ChipSize, string> = {
  sm: "px-1.5 py-[2px] text-[10px] leading-[14px] tracking-[0.06em]",
  md: "px-2 py-[3px] text-[12px] leading-[15px] tracking-[0.02em]",
};

// 小標籤：圓角 3px、粗體
export function chipClass(variant: ChipVariant = "outline", extra = "", size: ChipSize = "sm") {
  return `inline-flex items-center rounded-[3px] border font-bold whitespace-nowrap ${chipSizes[size]} ${chipVariants[variant]} ${extra}`.trim();
}

// 卡片陰影（主頁產品卡、應用場域卡）
export const cardShadow = "shadow-[0_1px_6px_rgba(32,54,86,0.14)]";
