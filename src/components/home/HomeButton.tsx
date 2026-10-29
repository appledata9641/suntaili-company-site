import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightLine, DownloadLine } from "@/components/icons";

// 主頁深色底圖上的大按鈕：196×58、圓角 5px、20pt。
// light = 白底藍灰字（詢價與合作）；ghost = 白框白字（查看產品中心、文件下載）。
// 桌機版圖示固定靠右，文字在左側區域置中（依設計稿位置）。
interface HomeButtonProps {
  href: string;
  variant: "light" | "ghost";
  icon?: "arrow" | "download";
  children: ReactNode;
  // 微調桌機版文字的水平位置（右側留白）與圖示離右緣的距離
  labelOffsetClass?: string;
  iconOffsetClass?: string;
  className?: string;
}

const variants = {
  light: "bg-white text-brand-blue hover:bg-brand-panel",
  ghost: "border-2 border-white text-white hover:bg-white/10",
};

export default function HomeButton({
  href,
  variant,
  icon = "arrow",
  children,
  labelOffsetClass = "lg:pr-[18px]",
  iconOffsetClass,
  className = "",
}: HomeButtonProps) {
  return (
    <Link
      href={href}
      className={`relative inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-base font-bold tracking-[0.1em] focus-visible:outline-white sm:text-lg lg:h-[58px] lg:w-[196px] lg:gap-0 lg:text-xl ${labelOffsetClass} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon === "download" ? (
        <DownloadLine className={`h-6 w-6 shrink-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 ${iconOffsetClass ?? "lg:right-[11px]"}`} />
      ) : (
        <ArrowRightLine
          className={`h-6 w-6 shrink-0 lg:absolute lg:top-1/2 lg:h-[27px] lg:w-[27px] lg:-translate-y-1/2 ${iconOffsetClass ?? "lg:right-3"}`}
        />
      )}
    </Link>
  );
}
