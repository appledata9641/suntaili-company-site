import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  compact?: boolean;
  href?: string;
  // 深色背景用 dark：文字改淺色，標誌加白底圓角
  tone?: "light" | "dark";
  // masthead：頁首用的大版本，依設計稿為 SUNTAILI 大寫加公司全名，文字 16px、#5b6d8c
  variant?: "default" | "masthead";
}

export default function BrandLogo({
  compact = false,
  href = "/",
  tone = "light",
  variant = "default",
}: BrandLogoProps) {
  const dark = tone === "dark";

  const content =
    variant === "masthead" ? (
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative h-12 w-10 shrink-0 md:h-[80px] md:w-[68px]">
          <Image src="/suntaili-logo.svg" alt="三泰利企業有限公司 Logo" fill sizes="60px" className="object-contain" priority />
        </div>
        <div className="min-w-0 leading-tight text-brand-blue">
          <div className="truncate text-sm font-bold tracking-[0.08em] md:text-base">SUNTAILI</div>
          <div className="truncate text-sm tracking-[0.06em] md:text-base">三泰利企業有限公司</div>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <div
          className={`relative shrink-0 ${compact ? "h-10 w-10" : "h-12 w-12"} ${dark ? "overflow-hidden rounded-lg bg-white" : ""}`}
        >
          <Image
            src="/suntaili-logo.svg"
            alt="三泰利企業有限公司 Logo"
            fill
            sizes="48px"
            className="object-contain"
            priority={compact}
          />
        </div>
        <div className="min-w-0">
          <div className={`truncate text-sm font-semibold tracking-tight ${dark ? "text-[#e6ecf1]" : "text-slate-950"}`}>
            Suntaili
          </div>
          <div className={`truncate text-xs ${dark ? "text-[#8d9caa]" : "text-slate-500"}`}>三泰利企業有限公司</div>
        </div>
      </div>
    );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
