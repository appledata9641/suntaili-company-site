"use client";

import type { ReactNode } from "react";
import { CheckboxFill } from "@/components/icons";

// 勾選框：設計稿 checkbox-fill（18×18，#203656），未勾選是 #e2e8f0 外框。
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function Checkbox({ checked, onChange, children, disabled = false, className = "", labelClassName = "" }: CheckboxProps) {
  return (
    <label className={`group inline-flex cursor-pointer items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-navy"
      >
        {checked ? (
          <CheckboxFill className="h-[22px] w-[22px] text-brand-navy" />
        ) : (
          <span className="block h-[16px] w-[16px] border border-brand-line bg-white group-hover:border-brand-grey" />
        )}
      </span>
      <span className={labelClassName}>{children}</span>
    </label>
  );
}
