import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "三泰利企業有限公司 B2B 安防監控與 AHD 客製",
  description:
    "三泰利企業有限公司提供監控器材批發、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁與弱電整合支援。",
  path: "/",
});

// 首頁版面依美編設計稿（官方網站／網站-02.jpg）：字體 Noto Sans TC，顏色 #203656、#5b6d8c、#8b96a3、#ffffff

const productEntries = [
  {
    title: "監控攝影機",
    href: "/categories/camera",
    image: "/images/home/cat-camera.webp",
    width: 520,
    height: 323,
    imageClass: "w-[200px]",
    background: "linear-gradient(160deg, #e8eef6 0%, #f4f7fb 55%, #ffffff 100%)",
  },
  {
    title: "錄影主機",
    href: "/categories/recorder",
    image: "/images/home/cat-recorder.webp",
    width: 520,
    height: 160,
    imageClass: "w-[250px]",
    background: "linear-gradient(160deg, #dfe4f3 0%, #eef1f9 55%, #ffffff 100%)",
  },
  {
    title: "周邊設備",
    href: "/categories/accessory",
    image: "/images/home/cat-accessory.webp",
    width: 520,
    height: 166,
    imageClass: "w-[230px]",
    background: "linear-gradient(160deg, #d9dadd 0%, #ebecee 50%, #ffffff 100%)",
  },
];

const strengths: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "監控器材批發配貨",
    description: "依案場需求協助搭配攝影機、錄影主機、PoE、線材與周邊設備",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M10 14h4" />
      </>
    ),
  },
  {
    title: "AHD 攝影機組裝客製",
    description: "可依解析度、外型、鏡頭焦距、夜視距離與安裝環境討論配置",
    icon: (
      <>
        <path d="m5 19 9.5-9.5M13 7l1-1M17 11l1-1M17 4v3M15.5 5.5h3M20 8.5v3M18.5 10h3" />
        <path d="m14.5 9.5 1 1" />
      </>
    ),
  },
  {
    title: "弱電整合技術支援",
    description: "協助系統整合商與經銷商確認相容性、替代型號與售後維護方向",
    icon: (
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z" />
    ),
  },
];

const cooperationSteps = [
  "提供案場需求或採購清單",
  "確認產品型號、數量與搭配方式",
  "回覆報價、交期與可替代方案",
  "出貨後提供必要技術文件與支援",
];

// 合作流程右側的圖示，依序對應四個步驟，左右交錯排列
const stepIcons: ReactNode[] = [
  <>
    <rect key="a" x="5" y="3" width="14" height="18" rx="2" />
    <path key="b" d="M9 8h6M9 12h6M9 16h4" />
  </>,
  <path
    key="grid"
    fill="currentColor"
    stroke="none"
    d="M5 5h4v4H5zM10 5h4v4h-4zM15 5h4v4h-4zM5 10h4v4H5zM10 10h4v4h-4zM15 10h4v4h-4zM5 15h4v4H5zM10 15h4v4h-4zM15 15h4v4h-4z"
  />,
  <>
    <path key="a" d="M15 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l4 4v6" />
    <path key="b" d="M9 8h5M9 12h6M9 16h3M14.5 20.5l5-5 1.5 1.5-5 5h-1.5Z" />
  </>,
  <>
    <path key="a" d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path key="b" d="M12 11 4 7v10l8 4Z" fill="currentColor" />
    <path key="c" d="m4 7 8 4 8-4M12 11v10" />
  </>,
];

const applicationEntries = [
  { title: "商用空間", image: "/images/home/app-office.webp", alt: "辦公室空間" },
  { title: "住宅社區", image: "/images/home/app-residential.webp", alt: "住宅社區街景" },
  { title: "工廠倉儲", image: "/images/home/app-warehouse.webp", alt: "倉儲廠房內部" },
];

function ArrowIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LineIcon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function SectionTitle({ title, description, as: Tag = "h2" }: { title: string; description: string; as?: "h2" | "h3" }) {
  return (
    <div className="text-center">
      <Tag className="text-[22px] font-medium tracking-[0.12em] text-brand-navy md:text-2xl">{title}</Tag>
      <p className="mt-2 text-[13px] font-bold tracking-[0.06em] text-brand-grey md:text-sm">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* 主視覺 */}
        <section className="home-hero">
          <div className="relative mx-auto flex min-h-[380px] max-w-[1090px] items-end px-4 pb-14 pt-24 md:min-h-[430px] md:px-4 md:pb-[68px]">
            <div>
              <h1 className="text-[32px] font-bold leading-tight tracking-[0.08em] text-white md:text-[46px]">
                三泰利企業有限公司
              </h1>
              <p className="mt-3 max-w-[620px] text-[15px] font-bold leading-6 tracking-[0.06em] text-white md:text-base">
                提供系統整合商、弱電工程商與經銷夥伴監控器材配貨、AHD 攝影機組裝客製、NVR/DVR、PoE、門禁周邊與技術支援
              </p>
              <div className="mt-10 flex flex-wrap gap-3.5">
                <Link
                  href="/inquiry"
                  className="inline-flex h-9 items-center gap-3 rounded-[3px] bg-white px-6 text-sm font-bold tracking-[0.08em] text-brand-blue hover:bg-white/90"
                >
                  詢價與合作
                  <ArrowIcon />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border-2 border-white px-3.5 text-sm font-bold tracking-[0.08em] text-white hover:bg-white/10"
                >
                  查看產品中心
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 產品分類 */}
        <section className="px-4 pb-16 pt-14 md:pb-[68px] md:pt-[60px]">
          <SectionTitle title="從案場需求快速找到產品" description="依攝影機、錄影主機與弱電周邊整理型號，方便工程與採購快速比對需求" />
          <div className="mx-auto mt-9 grid max-w-[1090px] gap-5 sm:grid-cols-3">
            {productEntries.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="group flex h-[212px] flex-col items-center rounded-[2px] pt-5 shadow-[0_1px_6px_rgba(32,54,86,0.22)] transition-shadow hover:shadow-[0_6px_18px_rgba(32,54,86,0.22)]"
                style={{ background: entry.background }}
              >
                <h3 className="text-xl font-medium tracking-[0.15em] text-brand-grey group-hover:text-brand-blue">{entry.title}</h3>
                <div className="flex flex-1 items-center justify-center pb-3">
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    width={entry.width}
                    height={entry.height}
                    className={`${entry.imageClass} h-auto transition-transform duration-300 group-hover:scale-[1.04]`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 工廠直營與客製 */}
        <section className="relative overflow-hidden">
          <Image
            src="/images/home/band-gears.webp"
            alt=""
            width={1600}
            height={560}
            className="absolute inset-y-0 left-0 h-full w-full object-cover md:w-[72%]"
          />
          <div className="home-band-fade absolute inset-0" />
          <div className="relative mx-auto grid max-w-[1090px] gap-10 px-4 py-12 md:min-h-[320px] md:grid-cols-[1fr_420px] md:items-center md:gap-6 md:py-0">
            <div className="md:self-stretch md:pb-[52px] md:pt-[52px]">
              <p className="inline-block border-b border-white pb-2 text-sm font-bold tracking-[0.08em] text-white">工廠直營與客製</p>
              <h2 className="mt-10 text-[22px] font-bold tracking-[0.1em] text-white [text-shadow:0_1px_8px_rgba(32,54,86,0.35)] md:mt-[88px] md:text-2xl">
                面向工程與通路的穩定供貨支援
              </h2>
              <p className="mt-3 max-w-[460px] text-[15px] font-bold leading-6 tracking-[0.06em] text-white [text-shadow:0_1px_6px_rgba(32,54,86,0.35)] md:text-base">
                網站不做購物車與零售結帳，重點放在型號查詢、文件下載、案場詢價與合作溝通
              </p>
            </div>
            <ul className="grid gap-6 rounded-[4px] bg-white/90 p-5 md:gap-[38px] md:bg-transparent md:p-0">
              {strengths.map((item) => (
                <li key={item.title} className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-brand-grey text-white">
                    <LineIcon className="h-5 w-5">{item.icon}</LineIcon>
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-[0.1em] text-brand-blue">{item.title}</h3>
                    <p className="mt-0.5 text-xs font-bold tracking-[0.04em] text-brand-grey">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 合作流程與應用場域 */}
        <section className="px-4 py-14 md:py-[60px]">
          <div className="mx-auto grid max-w-[1150px] gap-14 md:grid-cols-2 md:gap-0">
            <div className="md:pr-10">
              <SectionTitle title="系統整合商與經銷商合作流程" description="適合大量採購、專案配貨、替代型號確認、既有案場升級與售後文件支援" />
              <div className="mx-auto mt-9 flex max-w-[480px] items-start justify-between gap-6">
                <ol className="grid gap-y-[38px] pt-[13px]">
                  {cooperationSteps.map((step, index) => (
                    <li key={step} className="flex items-center gap-2 text-[15px] font-bold tracking-[0.1em] text-brand-grey md:text-base">
                      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-grey text-[11px] leading-none text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                {/* 圖示依步驟高度對齊，左右交錯並以虛線串接 */}
                <div aria-hidden className="relative hidden h-[256px] w-[154px] shrink-0 sm:block">
                  <span className="absolute left-[77px] top-[25px] h-[190px] border-l border-dashed border-brand-grey/70" />
                  {stepIcons.map((icon, index) => {
                    const right = index % 2 === 1;
                    const top = index * 64 - 1 + (index === 3 ? 4 : 0);
                    return (
                      <div key={index}>
                        <span
                          className="absolute w-[26px] border-t border-dashed border-brand-grey/70"
                          style={{ top: top + 25, left: right ? 77 : 51 }}
                        />
                        <span
                          className="absolute flex h-[50px] w-[50px] items-center justify-center rounded-[6px] border-2 border-brand-navy bg-white text-brand-navy"
                          style={{ top, left: right ? 104 : 0 }}
                        >
                          <LineIcon className="h-6 w-6">{icon}</LineIcon>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:border-l md:border-slate-200 md:pl-10">
              <SectionTitle title="常見監控與弱電配置情境" description="依現場環境、距離、供電與既有設備，確認更合適的產品組合" />
              <div className="mx-auto mt-[42px] grid max-w-[520px] grid-cols-3 gap-3 sm:gap-[27px]">
                {applicationEntries.map((entry) => (
                  <Link
                    key={entry.title}
                    href="/applications"
                    className="group block bg-white shadow-[0_1px_6px_rgba(32,54,86,0.2)] transition-shadow hover:shadow-[0_6px_18px_rgba(32,54,86,0.24)]"
                  >
                    <span className="flex h-[60px] items-center justify-between px-3 text-sm font-bold tracking-[0.1em] text-brand-blue sm:h-[72px] sm:px-4 sm:text-base">
                      {entry.title}
                      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <Image
                      src={entry.image}
                      alt={entry.alt}
                      width={360}
                      height={440}
                      className="aspect-[155/188] w-full object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 技術文件與售後支援 */}
        <section className="bg-brand-navy px-4 py-12 md:py-[52px]">
          <div className="mx-auto flex max-w-[1110px] flex-col gap-8 md:flex-row md:items-end md:justify-between md:px-2">
            <div>
              <p className="inline-block border-b border-white pb-2 text-sm font-bold tracking-[0.08em] text-white">技術文件與售後支援</p>
              <h2 className="mt-4 text-[22px] font-bold tracking-[0.1em] text-white md:text-2xl">查型號、拿文件、確認案場搭配</h2>
              <p className="mt-1 text-[15px] font-bold leading-6 tracking-[0.04em] text-brand-grey md:text-base">
                產品頁保留型號、規格、適用場域、相容性與下載文件；文件下載頁整理工具軟體與操作說明書。
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 md:pb-[3px] lg:ml-6">
              <Link
                href="/inquiry"
                className="inline-flex h-9 w-[135px] items-center justify-center gap-3 rounded-[3px] bg-white text-sm font-bold tracking-[0.08em] text-brand-blue hover:bg-white/90"
              >
                詢價與合作
                <ArrowIcon />
              </Link>
              <Link
                href="/resources"
                className="inline-flex h-9 w-[135px] items-center justify-center gap-7 rounded-[3px] border-2 border-white text-sm font-bold tracking-[0.08em] text-white hover:bg-white/10"
              >
                文件下載
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
