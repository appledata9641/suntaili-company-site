import Link from "next/link";
import { FacebookCircleFill, LineFill, ShoppingBag3Fill } from "@/components/icons";
import { footerColumns } from "@/data/navigation";
import { siteProfile } from "@/data/site";
import { hasCenterCategoryProducts } from "@/lib/product-availability";

// 產品分類連結：該分類目前沒有刊登產品就先不列（例如週邊配件）
const columns = footerColumns.map((column) => ({
  ...column,
  links: column.links.filter((link) => !link.category || hasCenterCategoryProducts(link.category)),
}));

// 頁尾：依美編設計稿（主頁最下方）。四欄連結＋右側聯絡資訊，下方公司簡介與版權。
export default function Footer() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL;
  // 蝦皮賣場、Facebook 粉專的網址在 src/data/site.ts 的 social 填寫，沒填就不顯示
  const shopeeUrl = siteProfile.social?.shopee;
  const facebookUrl = siteProfile.social?.facebook;
  const { contact } = siteProfile;

  return (
    <footer className="border-t border-brand-line bg-white">
      <div className="mx-auto grid max-w-[1076px] gap-10 px-4 pb-7 pt-10 lg:grid-cols-[1fr_auto] lg:gap-8 xl:px-0">
        <nav aria-label="頁尾連結" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-0 lg:w-[568px]">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold tracking-[0.08em] text-brand-navy">{column.title}</h2>
              <ul className="mt-[7px]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs font-medium leading-6 text-brand-grey hover:text-brand-navy">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:w-[220px]">
          <h2 className="text-sm font-bold tracking-[0.08em] text-brand-navy">聯絡資訊</h2>
          <ul className="mt-[7px] text-xs font-medium leading-6 tracking-[0.04em] text-brand-navy">
            <li>
              電話：
              <a
                href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                data-ga-event="phone_click"
                data-ga-category="contact"
                data-ga-label="footer_phone"
                className="hover:underline"
              >
                {contact.phone}
              </a>
            </li>
            <li>服務時間：{contact.serviceHours}</li>
            <li>
              Email：
              <a
                href={`mailto:${contact.email}`}
                data-ga-event="email_click"
                data-ga-category="contact"
                data-ga-label="footer_email"
                className="hover:underline"
              >
                {contact.email}
              </a>
            </li>
            <li>地址：{contact.address}</li>
            {contact.taxId ? <li>統編：{contact.taxId}</li> : null}
          </ul>
          {lineUrl || shopeeUrl || facebookUrl ? (
            <div className="mt-4 flex items-center gap-3 text-brand-navy">
              {lineUrl ? (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ga-event="line_click"
                  data-ga-category="contact"
                  data-ga-label="footer_line"
                  aria-label="加入三泰利 LINE 官方帳號"
                  className="hover:opacity-80"
                >
                  <LineFill className="h-8 w-8" />
                </a>
              ) : null}
              {shopeeUrl ? (
                <a
                  href={shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ga-event="shopee_click"
                  data-ga-category="contact"
                  data-ga-label="footer_shopee"
                  aria-label="三泰利蝦皮賣場"
                  title="三泰利蝦皮賣場"
                  className="hover:opacity-80"
                >
                  <ShoppingBag3Fill className="h-8 w-8" />
                </a>
              ) : null}
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ga-event="facebook_click"
                  data-ga-category="contact"
                  data-ga-label="footer_facebook"
                  aria-label="三泰利 Facebook 粉絲專頁"
                  className="hover:opacity-80"
                >
                  <FacebookCircleFill className="h-8 w-8" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-brand-line">
        <p className="mx-auto max-w-[1076px] px-4 py-4 text-xs font-medium leading-5 tracking-[0.04em] text-brand-grey xl:px-0">
          三泰利企業有限公司專注於台灣工廠直營AHD組裝客製化、安防監控、
          <br className="hidden sm:inline" />
          監控器材批發與弱電整合，提供穩定供貨與技術支援。
        </p>
      </div>
      <div className="border-t border-brand-line">
        <p className="mx-auto max-w-[1076px] px-4 py-4 text-[10px] font-medium text-brand-grey xl:px-0">
          © {new Date().getFullYear()} {siteProfile.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
