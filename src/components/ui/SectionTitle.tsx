import type { ReactNode } from "react";

// 區塊標題：設計稿標題 30pt #203656、說明 18pt（#8a95a2 或 #6b7280）。
interface SectionTitleProps {
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "center" | "left";
  // wide：標題字距加寬（主頁、案例場景、關於我們）
  tracking?: "normal" | "wide";
  descriptionTone?: "grey" | "muted";
  className?: string;
}

export default function SectionTitle({
  title,
  description,
  as: Tag = "h2",
  align = "center",
  tracking = "normal",
  descriptionTone = "grey",
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Tag
        className={`text-[24px] font-bold leading-snug text-brand-navy lg:text-[30px] ${
          tracking === "wide" ? "tracking-[0.12em]" : "tracking-[0.02em]"
        }`}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={`mt-2 text-[15px] font-medium leading-relaxed lg:text-lg ${
            descriptionTone === "grey" ? "text-brand-grey" : "text-brand-muted"
          } ${tracking === "wide" ? "tracking-[0.08em]" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
