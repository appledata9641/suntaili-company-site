import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { siteProfile } from "@/data/site";

export default function Footer() {
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
              <Link href="/resources" className="hover:text-slate-900">
                文件下載
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
            <li>電話：{siteProfile.contact.phone}</li>
            <li>Email：{siteProfile.contact.email}</li>
            <li>LINE：{siteProfile.contact.lineId}</li>
            <li>{siteProfile.contact.address}</li>
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
