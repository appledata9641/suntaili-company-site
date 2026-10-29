import Image from "next/image";
import type { ReactNode } from "react";

// 各頁上方的主圖：依設計稿高度 388px，標題 36pt、副標 24pt，字距加寬。
interface PageHeroProps {
  image: string;
  title: string;
  subtitle?: string;
  // light = 白字（產品中心、立即諮詢、關於我們、產品型錄）；brand = 藍灰字 #5b6d8b（案例場景、文件下載）
  tone?: "light" | "brand";
  // 圖片裁切對齊位置，例如 "center", "70% center"
  imagePosition?: string;
  children?: ReactNode;
}

export default function PageHero({ image, title, subtitle, tone = "light", imagePosition = "center", children }: PageHeroProps) {
  const textColor = tone === "light" ? "text-white" : "text-brand-blue";
  return (
    <section className="relative isolate overflow-hidden bg-brand-line">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="mx-auto flex h-[220px] max-w-[1042px] flex-col justify-center px-5 pb-4 sm:h-[300px] lg:h-[388px] xl:px-0 lg:pb-8">
        <h1 className={`text-[28px] font-medium leading-tight tracking-[0.2em] sm:text-[32px] lg:text-[36px] ${textColor}`}>{title}</h1>
        {subtitle ? (
          <p className={`mt-1.5 text-[17px] font-medium tracking-[0.15em] sm:text-xl lg:text-2xl ${textColor}`}>{subtitle}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
