import Image from "next/image";
import { siteProfile } from "@/data/site";

// 總公司聯絡卡（立即諮詢、聯絡我們）：左側公司外觀照片，右側聯絡方式、主要聯絡人與服務時間。
// 依卡片本身的寬度（container query）決定左右並排或上下堆疊，放在窄欄位也不會擠壞。
interface ContactCardProps {
  headingLevel?: "h2" | "h3";
  // GA 事件標籤前綴：inquiry_card → inquiry_card_email / inquiry_card_phone
  gaLabelPrefix?: string;
  className?: string;
}

const linkClass = "underline-offset-4 hover:text-brand-navy hover:underline";

export default function ContactCard({
  headingLevel: Heading = "h2",
  gaLabelPrefix = "contact_card",
  className = "",
}: ContactCardProps) {
  const { contact } = siteProfile;
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL;

  return (
    <section className={`@container bg-white shadow-[0_1px_8px_rgba(0,0,0,0.1)] ${className}`}>
      <div className="flex flex-col items-center gap-7 px-5 py-8 @3xl:flex-row @3xl:justify-center @3xl:gap-12 @3xl:pb-[45px] @3xl:pt-11 @min-[1080px]:pl-[74px]">
        <Image
          src="/images/site/inquiry/company.webp"
          alt="三泰利企業有限公司總公司外觀"
          width={312}
          height={312}
          sizes="312px"
          className="aspect-square w-full max-w-[312px] shrink-0 object-cover"
        />
        <div className="w-full max-w-[420px] @3xl:w-auto @3xl:max-w-none">
          <Heading className="text-[22px] font-medium leading-[1.4] tracking-[0.08em] text-brand-navy @3xl:text-2xl">總公司</Heading>
          <dl className="mt-4 text-[15px] font-medium leading-[1.4] tracking-[0.1em] text-brand-grey @3xl:mt-[26px] @3xl:text-base [&_dt]:font-bold">
            <div>
              <dt>聯絡方式</dt>
              <dd>
                信箱:
                <a
                  href={`mailto:${contact.email}`}
                  data-ga-event="email_click"
                  data-ga-category="contact"
                  data-ga-label={`${gaLabelPrefix}_email`}
                  className={linkClass}
                >
                  {contact.email}
                </a>
              </dd>
              <dd>
                電話:
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  data-ga-event="phone_click"
                  data-ga-category="contact"
                  data-ga-label={`${gaLabelPrefix}_phone`}
                  className={linkClass}
                >
                  {contact.phone}
                </a>
              </dd>
              {lineUrl ? (
                <dd>
                  LINE:
                  <a
                    href={lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ga-event="line_click"
                    data-ga-category="contact"
                    data-ga-label={`${gaLabelPrefix}_line`}
                    className={linkClass}
                  >
                    加入 LINE 聯絡
                  </a>
                </dd>
              ) : null}
            </div>
            {contact.contactPerson ? (
              <div className="mt-[9px]">
                <dt>主要聯絡人</dt>
                <dd>{contact.contactPerson}</dd>
                {/* 聯絡人電話在 src/data/site.ts 的 contactPersonPhone 設定（目前是公司電話） */}
                {contact.contactPersonPhone ? (
                  <dd>
                    電話:
                    <a
                      href={`tel:${contact.contactPersonPhone.replace(/[^\d+]/g, "")}`}
                      data-ga-event="phone_click"
                      data-ga-category="contact"
                      data-ga-label={`${gaLabelPrefix}_contact_phone`}
                      className={linkClass}
                    >
                      {contact.contactPersonPhone}
                    </a>
                  </dd>
                ) : null}
              </div>
            ) : null}
            <div className="mt-[9px]">
              <dt>服務時間</dt>
              <dd>{contact.serviceHours}</dd>
              <dd>非服務時段收到的詢問會於下一個工作時段盡快回覆</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
