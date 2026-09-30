interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  // 每頁的主標題請用 as="h1"，其餘區塊維持 h2
  as?: "h1" | "h2";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: HeadingTag = "h2",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <p className="inline-flex w-fit rounded-full border border-slate-300/70 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </HeadingTag>
      {description ? (
        <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
