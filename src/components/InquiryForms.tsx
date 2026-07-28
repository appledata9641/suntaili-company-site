"use client";

import { FormEvent } from "react";
import { siteProfile } from "@/data/site";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500";

const labelClass = "text-sm font-medium text-slate-800";

function openMailFromForm(event: FormEvent<HTMLFormElement>, subject: string) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const lines = Array.from(data.entries()).map(([key, value]) => `${key}: ${String(value).trim()}`);
  const body = lines.join("\n");
  const mailto = `mailto:${siteProfile.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}

export default function InquiryForms() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={(event) => openMailFromForm(event, "三泰利經銷合作 / 大量採購詢價")}
        data-ga-event="inquiry_form_submit"
        data-ga-category="lead"
        data-ga-label="bulk_purchase"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-950">經銷合作 / 大量採購詢價</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            公司名稱
            <input className={inputClass} name="公司名稱" autoComplete="organization" />
          </label>
          <label className={labelClass}>
            聯絡人
            <input className={inputClass} name="聯絡人" autoComplete="name" />
          </label>
          <label className={labelClass}>
            電話
            <input className={inputClass} name="電話" autoComplete="tel" />
          </label>
          <label className={labelClass}>
            Email
            <input className={inputClass} name="Email" type="email" autoComplete="email" />
          </label>
          <label className={labelClass}>
            需求類型
            <select className={inputClass} name="需求類型" defaultValue="批發採購">
              <option>批發採購</option>
              <option>經銷合作</option>
              <option>型號替代確認</option>
              <option>售後文件支援</option>
            </select>
          </label>
          <label className={labelClass}>
            預計交期
            <input className={inputClass} name="預計交期" placeholder="例：兩週內 / 可討論" />
          </label>
        </div>
        <label className={`${labelClass} mt-4 block`}>
          詢價品項與數量
          <textarea
            className={`${inputClass} min-h-32`}
            name="詢價品項與數量"
            placeholder="例：AC-535 20 台、RD-1308AH 3 台、PoE 交換器 5 台"
          />
        </label>
        <label className={`${labelClass} mt-4 block`}>
          備註
          <textarea
            className={`${inputClass} min-h-24`}
            name="備註"
            placeholder="可填寫預算、品牌偏好、既有設備型號或特殊需求"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            開啟 Email 送出
          </button>
          <a
            href={`mailto:${siteProfile.contact.email}`}
            data-ga-event="email_click"
            data-ga-category="contact"
            data-ga-label="inquiry_direct_email"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
          >
            直接寄信
          </a>
        </div>
      </form>

      <form
        onSubmit={(event) => openMailFromForm(event, "三泰利專案需求表單")}
        data-ga-event="inquiry_form_submit"
        data-ga-category="lead"
        data-ga-label="project_requirement"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-950">專案需求表單</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            案場類型
            <select className={inputClass} name="案場類型" defaultValue="商用空間">
              <option>商用空間</option>
              <option>住宅社區</option>
              <option>工廠倉儲</option>
              <option>停車場 / 出入口</option>
              <option>弱電整合案</option>
            </select>
          </label>
          <label className={labelClass}>
            預估攝影機數量
            <input className={inputClass} name="預估攝影機數量" placeholder="例：8 支 / 16 支" />
          </label>
          <label className={labelClass}>
            既有主機或系統
            <input className={inputClass} name="既有主機或系統" placeholder="例：AHD DVR / NVR / 尚未確認" />
          </label>
          <label className={labelClass}>
            安裝環境
            <select className={inputClass} name="安裝環境" defaultValue="室內外都有">
              <option>室內</option>
              <option>室外</option>
              <option>室內外都有</option>
              <option>尚未確認</option>
            </select>
          </label>
        </div>
        <label className={`${labelClass} mt-4 block`}>
          現場條件
          <textarea
            className={`${inputClass} min-h-32`}
            name="現場條件"
            placeholder="可填寫線路距離、是否有同軸線、是否需要 PoE、夜視距離、防水需求等"
          />
        </label>
        <label className={`${labelClass} mt-4 block`}>
          希望協助內容
          <textarea
            className={`${inputClass} min-h-24`}
            name="希望協助內容"
            placeholder="例：配貨建議、替代型號、技術文件、主機相容性確認"
          />
        </label>
        <button
          type="submit"
          className="mt-5 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          開啟 Email 送出
        </button>
      </form>
    </div>
  );
}
