import Link from "next/link";
import { ArrowRightLine, DownloadLine, FileTextFill, NetworkFill, TimeFill, WrenchFill } from "@/components/icons";
import { siteProfile } from "@/data/site";
import { wideButtonClass } from "./buttons";

// 「產品選型與應用諮詢」區塊：左側標題、中間詢問前建議準備的四項資料、右側寄信與文件下載按鈕。
const checklist = [
  { icon: FileTextFill, title: "產品型號與版本", description: "產品型號、韌體或軟體版本" },
  { icon: TimeFill, title: "問題情境與時間", description: "發生情況、時間點與錯誤訊息" },
  { icon: WrenchFill, title: "已執行的排查步驟", description: "已執行的檢查與處理方式" },
  { icon: NetworkFill, title: "現場網路與供電條件", description: "網路架構、PoE 與供電條件" },
];

const divider = "mx-5 h-px bg-brand-line lg:mx-0 lg:my-5 lg:h-auto lg:w-px";

export default function InquiryPrepPanel({ gaLabel = "inquiry_prep_email" }: { gaLabel?: string }) {
  return (
    <div className="grid border border-slate-300 border-t-[3px] border-t-brand-blue bg-white lg:min-h-[251px] lg:grid-cols-[minmax(0,1fr)_1px_514px_1px_minmax(0,1fr)]">
      <div className="flex items-center justify-center px-5 pb-5 pt-7 lg:p-4">
        <h3 className="text-center text-lg leading-[1.4] tracking-[0.1em] text-brand-blue lg:text-xl">
          詢問前建議準備資料
        </h3>
      </div>
      <div aria-hidden="true" className={divider} />
      <div className="flex justify-center px-5 py-7 lg:items-center lg:px-4 lg:py-6">
        <ol className="grid grid-cols-1 gap-x-4 gap-y-5 min-[400px]:grid-cols-2 lg:grid-cols-[220px_auto] lg:gap-x-0 lg:gap-y-[27px]">
          {checklist.map(({ icon: Icon, title, description }, index) => (
            <li key={title}>
              <Icon className="h-6 w-6 text-brand-blue" />
              <p className="mt-[3px] pl-1 text-sm font-bold leading-[1.4] tracking-[0.06em] text-brand-grey">
                {String(index + 1).padStart(2, "0")} {title}
              </p>
              <p className="mt-[3px] pl-1 text-xs font-medium leading-[1.4] tracking-[0.1em] text-brand-grey">{description}</p>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden="true" className={divider} />
      <div className="flex flex-col items-center justify-center gap-4 px-5 pb-8 pt-7 lg:py-4 lg:pl-6 lg:pr-4">
        <a
          href={`mailto:${siteProfile.contact.email}`}
          data-ga-event="email_click"
          data-ga-category="contact"
          data-ga-label={gaLabel}
          className={wideButtonClass("primary")}
        >
          <span className="flex-1 text-center">寄送 Email</span>
          <ArrowRightLine className="h-[27px] w-[27px] shrink-0" />
        </a>
        <Link href="/resources/" className={wideButtonClass("outline")}>
          <span className="flex-1 text-center">文件下載</span>
          <DownloadLine className="h-6 w-6 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
