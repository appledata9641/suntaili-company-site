"use client";

// 分段切換：設計稿的「半球型｜槍型｜防護罩」「模組參數｜功能表控制｜一般規範」，14pt、#5b6d8b。
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  itemClassName?: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
  itemClassName = "",
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`inline-flex max-w-full overflow-x-auto ${className}`}>
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`h-[42px] min-w-[96px] shrink-0 border border-brand-blue px-4 text-sm font-medium tracking-[0.08em] sm:min-w-[128px] ${
              index > 0 ? "-ml-px" : ""
            } ${active ? "relative z-[1] bg-brand-blue text-white" : "bg-white text-brand-blue hover:bg-brand-panel"} ${itemClassName}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
