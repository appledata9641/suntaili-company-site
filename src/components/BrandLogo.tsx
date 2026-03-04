import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  compact?: boolean;
  href?: string;
}

export default function BrandLogo({ compact = false, href = "/" }: BrandLogoProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div className={compact ? "relative h-10 w-10 shrink-0" : "relative h-12 w-12 shrink-0"}>
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
        <div className="truncate text-sm font-semibold tracking-tight text-slate-950">Suntaili</div>
        <div className="truncate text-xs text-slate-500">三泰利企業有限公司</div>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
