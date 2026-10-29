"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, MouseEvent, Suspense, useEffect, useRef, type ReactNode } from "react";
import { ArrowDownSLine, FilePaper2Line, ShakeHandsLine } from "@/components/icons";
import { buttonClass } from "@/components/ui/styles";
import { siteProfile } from "@/data/site";

// 依設計稿：標籤 12pt、輸入框 3px 圓角、提示文字 10pt #8a95a2。
// 手機版輸入文字用 16px，避免 iOS 點輸入框時自動放大畫面。
const fieldClass =
  "w-full rounded-[3px] border border-slate-300 bg-white px-3 text-base font-medium text-brand-navy shadow-sm placeholder:text-sm placeholder:font-normal placeholder:text-brand-grey hover:border-brand-grey focus:border-brand-blue lg:text-xs lg:placeholder:text-[10px]";
const inputClass = `${fieldClass} h-11 lg:h-8`;
const textareaClass = `${fieldClass} block resize-y py-2 leading-normal`;
const labelClass = "mb-[5px] block text-sm leading-4 text-brand-navy lg:text-xs";

// 送出按鈕：設計稿 103×36、字 12pt
const submitClass = buttonClass(
  "primary",
  "sm",
  "h-11! w-[110px] px-0! text-sm! font-medium! tracking-[0.08em]! lg:h-9! lg:w-[103px] lg:text-xs!"
);
const mailClass = buttonClass(
  "outline",
  "sm",
  "h-11! w-[110px] border! px-0! text-sm! font-medium! tracking-[0.08em]! lg:h-9! lg:w-[103px] lg:text-xs!"
);

// 表單錨點（#bulk-form、#project-form）跳轉時保留上方標題與固定頁首的空間
// （桌機頁首捲動後會從 110px 縮成 72px，所以桌機留多一點）；
// 表單內標點維持全形寬度（設計稿此區是表單截圖，未套用比例標點）
const formClass =
  "flex flex-1 flex-col scroll-mt-[140px]! [font-feature-settings:normal] lg:scroll-mt-[142px]! border border-slate-300 border-t-[3px] border-t-brand-blue bg-white px-5 pb-8 pt-6 sm:px-8 lg:pb-[37px] lg:pl-[54px] lg:pr-[62px] lg:pt-5";

const BULK_SUBJECT = "三泰利經銷合作 / 大量採購詢價";
const PROJECT_SUBJECT = "三泰利專案需求表單";
const BULK_ITEMS_ID = "bulk-items";

function buildMailDraft(form: HTMLFormElement, subject: string) {
  const data = new FormData(form);
  const lines = Array.from(data.entries())
    .map(([key, value]) => [key, String(value).trim()] as const)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);

  const body = lines.join("\n");

  return {
    subject,
    body,
    to: siteProfile.contact.email,
  };
}

function openGmailFromForm(event: FormEvent<HTMLFormElement>, subject: string) {
  event.preventDefault();

  const draft = buildMailDraft(event.currentTarget, subject);
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: draft.to,
    su: draft.subject,
    body: draft.body,
  });

  const gmailWindow = window.open(
    `https://mail.google.com/mail/?${params.toString()}`,
    "_blank",
    "noopener,noreferrer"
  );

  if (gmailWindow) {
    gmailWindow.opener = null;
  }
}

function openDefaultMailFromButton(event: MouseEvent<HTMLButtonElement>, subject: string) {
  const form = event.currentTarget.form;
  if (!form) return;

  const draft = buildMailDraft(form, subject);
  const mailto = `mailto:${draft.to}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  window.location.href = mailto;
}

function TextField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input className={inputClass} name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="relative block">
        <select className={`${inputClass} cursor-pointer appearance-none pr-8`} name={name} defaultValue={defaultValue}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ArrowDownSLine className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy" />
      </span>
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  heightClass,
}: {
  label: string;
  name: string;
  placeholder: string;
  heightClass: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea className={`${textareaClass} ${heightClass}`} name={name} placeholder={placeholder} />
    </label>
  );
}

// 「詢價品項與數量」：從產品頁「詢問此型號」帶入 ?model=型號 時，預先填入型號並捲動到這個欄位。
function BulkItemsTextarea({ model = "" }: { model?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (model) {
      ref.current?.scrollIntoView({ block: "center" });
    }
  }, [model]);

  return (
    <textarea
      ref={ref}
      id={BULK_ITEMS_ID}
      className={`${textareaClass} h-[120px] lg:h-[98px]`}
      name="詢價品項與數量"
      defaultValue={model ? `${model} ` : undefined}
      placeholder="例：AC-535 20 台、RD-1308AH 3 台、PoE 交換器 5 台"
    />
  );
}

function BulkItemsFromQuery() {
  const searchParams = useSearchParams();
  const model = (searchParams.get("model") ?? "").trim().slice(0, 80);
  // 以型號當 key：網址的型號改變時重新建立欄位，讓預設值生效
  return <BulkItemsTextarea key={model} model={model} />;
}

function FormBlock({
  title,
  icon,
  titleId,
  children,
}: {
  title: string;
  icon: ReactNode;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={titleId} className="flex flex-col">
      <h2
        id={titleId}
        className="mb-4 flex items-center justify-center gap-3 text-center text-[20px] font-medium leading-[1.4] tracking-[0.1em] text-brand-navy lg:mb-[19px] lg:text-2xl"
      >
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function FormButtons({ subject, gaLabel }: { subject: string; gaLabel: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1">
      <button type="submit" className={submitClass}>
        Gmail送出
      </button>
      <button
        type="button"
        onClick={(event) => openDefaultMailFromButton(event, subject)}
        data-ga-event="email_click"
        data-ga-category="contact"
        data-ga-label={gaLabel}
        className={mailClass}
      >
        用預設郵件
      </button>
    </div>
  );
}

export default function InquiryForms({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-12 lg:grid-cols-2 lg:gap-[58px] ${className}`}>
      <FormBlock
        title="經銷合作 / 大量採購詢價"
        titleId="bulk-form-title"
        icon={<ShakeHandsLine className="h-[26px] w-[26px] shrink-0" />}
      >
        <form
          id="bulk-form"
          onSubmit={(event) => openGmailFromForm(event, BULK_SUBJECT)}
          data-ga-event="inquiry_form_submit"
          data-ga-category="lead"
          data-ga-label="bulk_purchase"
          className={formClass}
        >
          <div className="grid gap-x-[13px] gap-y-2 sm:grid-cols-2">
            <TextField label="公司名稱" name="公司名稱" autoComplete="organization" />
            <TextField label="聯絡人" name="聯絡人" autoComplete="name" />
            <TextField label="電話" name="電話" type="tel" autoComplete="tel" />
            <TextField label="Email" name="Email" type="email" autoComplete="email" />
            <SelectField
              label="需求類型"
              name="需求類型"
              defaultValue="批發採購"
              options={["批發採購", "經銷合作", "型號替代確認", "售後文件支援"]}
            />
            <TextField label="預計交期" name="預計交期" placeholder="例：兩週內 / 可討論" />
          </div>
          <div className="mt-[10px]">
            <label htmlFor={BULK_ITEMS_ID} className={labelClass}>
              詢價品項與數量
            </label>
            <Suspense fallback={<BulkItemsTextarea />}>
              <BulkItemsFromQuery />
            </Suspense>
          </div>
          <div className="mt-3">
            <TextareaField
              label="備註"
              name="備註"
              placeholder="可填寫預算、品牌偏好、既有設備型號或特殊需求"
              heightClass="h-24 lg:h-[74px]"
            />
          </div>
          <FormButtons subject={BULK_SUBJECT} gaLabel="inquiry_default_email" />
        </form>
      </FormBlock>

      <FormBlock
        title="專案需求表單"
        titleId="project-form-title"
        icon={<FilePaper2Line className="h-[26px] w-[26px] shrink-0" />}
      >
        <form
          id="project-form"
          onSubmit={(event) => openGmailFromForm(event, PROJECT_SUBJECT)}
          data-ga-event="inquiry_form_submit"
          data-ga-category="lead"
          data-ga-label="project_requirement"
          className={formClass}
        >
          <div className="grid gap-x-[13px] gap-y-2 sm:grid-cols-2">
            <SelectField
              label="案場類型"
              name="案場類型"
              defaultValue="商用空間"
              options={["商用空間", "住宅社區", "工廠倉儲", "停車場 / 出入口", "弱電整合案"]}
            />
            <TextField label="預估攝影機數量" name="預估攝影機數量" placeholder="例：8 支 / 16 支" />
            <TextField label="既有主機或系統" name="既有主機或系統" placeholder="例：AHD DVR / NVR / 尚未確認" />
            <SelectField
              label="安裝環境"
              name="安裝環境"
              defaultValue="室內外都有"
              options={["室內", "室外", "室內外都有", "尚未確認"]}
            />
          </div>
          <div className="mt-[10px]">
            <TextareaField
              label="現場條件"
              name="現場條件"
              placeholder="可填寫線路距離、是否有同軸線、是否需要 PoE、夜視距離、防水需求等"
              heightClass="h-[120px] lg:h-[98px]"
            />
          </div>
          <div className="mt-3">
            <TextareaField
              label="希望協助內容"
              name="希望協助內容"
              placeholder="例：配貨建議、替代型號、技術文件、主機相容性確認"
              heightClass="h-24 lg:h-[74px]"
            />
          </div>
          <FormButtons subject={PROJECT_SUBJECT} gaLabel="project_default_email" />
        </form>
      </FormBlock>
    </div>
  );
}
