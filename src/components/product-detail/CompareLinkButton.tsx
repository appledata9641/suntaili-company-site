"use client";

import Link from "next/link";
import { compareHref } from "@/lib/compare";
import { buttonClass } from "@/components/ui/styles";

// 「比較這些型號」：帶著目前型號與推薦型號前往型號比較頁
export default function CompareLinkButton({ slugs }: { slugs: string[] }) {
  return (
    <Link href={compareHref(slugs)} className={buttonClass("primary", "sm", "px-6 max-lg:h-11")}>
      比較這些型號
    </Link>
  );
}
