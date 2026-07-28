import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";

export default function Footer() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <BrandLogo compact={false} href="" />
          <p className="mt-3 text-sm leading-7 text-slate-600">{siteProfile.shortDescription}</p>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">快速連結</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/products" className="hover:text-slate-900">
                產品中心
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-slate-900">
                產品分類
              </Link>
            </li>
            <li>
              <Link href="/applications" className="hover:text-slate-900">
                應用場域
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-slate-900">
                文件下載
              </Link>
            </li>
            <li>
              <Link href="/inquiry" className="hover:text-slate-900">
                詢價合作
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-slate-900">
                常見問題
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-slate-900">
                關於我們
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-slate-900">
                聯絡我們
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">聯絡資訊</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              電話：
              <a
                href={`tel:${siteProfile.contact.phone.replace(/[^\d+]/g, "")}`}
                data-ga-event="phone_click"
                data-ga-category="contact"
                data-ga-label="footer_phone"
                className="hover:text-slate-900"
              >
                {siteProfile.contact.phone}
              </a>
            </li>
            <li>
              Email：
              <a
                href={`mailto:${siteProfile.contact.email}`}
                data-ga-event="email_click"
                data-ga-category="contact"
                data-ga-label="footer_email"
                className="hover:text-slate-900"
              >
                {siteProfile.contact.email}
              </a>
            </li>
            {lineUrl ? (
              <li>
                LINE：
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ga-event="line_click"
                  data-ga-category="contact"
                  data-ga-label="footer_line"
                  className="hover:text-slate-900"
                >
                  加入 LINE 聯絡
                </a>
              </li>
            ) : null}
            <li>地址：{siteProfile.contact.address}</li>
            <li>統編：{siteProfile.contact.taxId}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteProfile.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
