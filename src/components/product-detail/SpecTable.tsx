"use client";

import { useState } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import type { SpecGroupKey } from "@/lib/catalog";
import type { SpecGroupData } from "@/components/product-detail/product-detail-data";

interface SpecTableProps {
  model: string;
  groups: SpecGroupData[];
}

// 規格表：上方分段按鈕跳到對應組別；組別標題列底色 #f8fafc
export default function SpecTable({ model, groups }: SpecTableProps) {
  const [active, setActive] = useState<SpecGroupKey>(groups[0]?.key ?? "module");

  const select = (key: SpecGroupKey) => {
    setActive(key);
    // 平滑捲動跟著全站設定（使用者偏好減少動態時不做動畫）
    document.getElementById(`spec-${key}`)?.scrollIntoView({ block: "start" });
  };

  return (
    <div>
      {groups.length > 1 ? (
        <div className="flex justify-center">
          <SegmentedControl
            options={groups.map((group) => ({ value: group.key, label: group.label }))}
            value={active}
            onChange={select}
            ariaLabel="規格分類"
          />
        </div>
      ) : null}

      <table className={`w-full table-fixed border-collapse ${groups.length > 1 ? "mt-[38px]" : ""}`}>
        <caption className="sr-only">{model} 規格資訊</caption>
        <colgroup>
          <col className="w-[112px] sm:w-[200px] lg:w-[230px]" />
          <col />
        </colgroup>
        {groups.map((group) => (
          <tbody key={group.key} id={`spec-${group.key}`} className="scroll-mt-[126px]! lg:scroll-mt-[146px]!">
            <tr>
              <th
                colSpan={2}
                scope="rowgroup"
                className="h-[56px] border-y-2 border-brand-line bg-brand-panel px-4 text-left text-[15px] font-medium tracking-[0.02em] text-brand-navy sm:px-[30px] lg:h-[61px] lg:text-base"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row, index) => (
              <tr key={`${row.label}-${index}`} className="border-b border-brand-line">
                <th
                  scope="row"
                  className="py-[11px] pl-4 pr-3 text-left align-top text-xs font-medium leading-[18px] text-brand-muted sm:pl-[30px]"
                >
                  {row.label}
                </th>
                <td className="break-words py-[11px] pr-4 align-top text-xs font-medium leading-[18px] text-brand-muted sm:pr-[30px]">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
