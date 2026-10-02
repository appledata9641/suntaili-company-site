import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";

interface FooterProps {
  // 首頁深色版面用 dark
  tone?: "light" | "dark";
}

const toneClasses = {
  light: {
    footer: "border-t border-slate-200 bg-white",
    text: "text-slate-600",
    heading: "text-slate-900",
    hover: "hover:text-slate-900",
    divider: "border-t border-slate-200",
    fine: "text-slate-500",
  },
  dark: {
    footer: "border-t border-[var(--line)] bg-[var(--ink)]",
    text: "text-[var(--muted)]",
    heading: "text-[var(--fg)]",
    hover: "hover:text-white",
    divider: "border-t border-[var(--line)]",
    fine: "text-[var(--muted)]",
  },
};

export default function Footer({ tone = "light" }: FooterProps) {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL;
  const c = toneClasses[tone];

  return (
    <footer className={c.footer}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <BrandLogo compact={false} href="" tone={tone} />
          <p className={`mt-3 text-sm leading-7 ${c.text}`}>{siteProfile.shortDescription}</p>
        </div>

        <div>
          <div className={`text-sm font-semibold ${c.heading}`}>快速連結</div>
          <ul className={`mt-3 space-y-2 text-sm ${c.text}`}>
            <li>
              <Link href="/products" className={c.hover}>
                產品中心
              </Link>
            </li>
            <li>
              <Link href="/categories" className={c.hover}>
                產品分類
              </Link>
            </li>
            <li>
              <Link href="/applications" className={c.hover}>
                應用場域
              </Link>
            </li>
            <li>
              <Link href="/resources" className={c.hover}>
                文件下載
              </Link>
            </li>
            <li>
              <Link href="/inquiry" className={c.hover}>
                詢價合作
              </Link>
            </li>
            <li>
              <Link href="/faq" className={c.hover}>
                常見問題
              </Link>
            </li>
            <li>
              <Link href="/about" className={c.hover}>
                關於我們
              </Link>
            </li>
            <li>
              <Link href="/contact" className={c.hover}>
                聯絡我們
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className={`text-sm font-semibold ${c.heading}`}>聯絡資訊</div>
          <ul className={`mt-3 space-y-2 text-sm ${c.text}`}>
            <li>
              電話：
              <a
                href={`tel:${siteProfile.contact.phone.replace(/[^\d+]/g, "")}`}
                data-ga-event="phone_click"
                data-ga-category="contact"
                data-ga-label="footer_phone"
                className={c.hover}
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
                className={c.hover}
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
                  className={c.hover}
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
      <div className={c.divider}>
        <div className={`mx-auto max-w-7xl px-4 py-4 text-xs ${c.fine}`}>
          © {new Date().getFullYear()} {siteProfile.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
