"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDropRightLine } from "@/components/icons";

// 下拉選單：設計稿「全部分類 ›」外框 #8a95a2、圓角 3px、14pt #5b6d8b；展開後選項清單，選中項目 #e2e8f0 底。
export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  // 清單字級：產品中心用 16pt，其餘 14pt
  listTextClassName?: string;
}

export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
  listTextClassName = "text-sm",
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = options.find((option) => option.value === value) ?? options[0];

  const choose = (next: T) => {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const openList = () => {
    setHighlight(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[highlight].value);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${ariaLabel}：${current?.label ?? ""}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex h-[34px] w-full items-center justify-between gap-2 rounded-[3px] border border-brand-grey bg-white pl-3 pr-2 text-left text-sm font-medium tracking-[0.04em] text-brand-blue hover:border-brand-blue"
      >
        <span className="truncate">{current?.label}</span>
        <ArrowDropRightLine className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-30 max-h-72 overflow-y-auto border border-t-0 border-brand-grey bg-white py-1 shadow-[0_6px_16px_rgba(32,54,86,0.1)]"
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option.value)}
                onMouseEnter={() => setHighlight(index)}
                className={`cursor-pointer px-5 py-[3px] font-medium text-brand-blue ${listTextClassName} ${
                  index === highlight ? "bg-brand-line" : selected ? "bg-brand-panel" : ""
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
