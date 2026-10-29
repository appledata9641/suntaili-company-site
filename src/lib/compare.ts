"use client";

import { useSyncExternalStore } from "react";

// 產品比較清單（最多 4 件）：存在瀏覽器裡，產品中心勾選「比較」、產品頁「型號比較」共用。
export const MAX_COMPARE = 4;
const STORAGE_KEY = "suntaili-compare";
const EVENT_NAME = "suntaili-compare-change";

export function compareHref(slugs: string[]) {
  return slugs.length ? `/products/compare/?items=${slugs.map(encodeURIComponent).join(",")}` : "/products/compare/";
}

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

let cache: string[] | null = null;
const EMPTY: string[] = [];

function getSnapshot(): string[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  const onChange = () => {
    cache = readStorage();
    callback();
  };
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT_NAME, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT_NAME, onChange);
  };
}

export function setCompareList(slugs: string[]) {
  const next = Array.from(new Set(slugs)).slice(0, MAX_COMPARE);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 無痕模式等無法寫入時，只在這次瀏覽有效
  }
  cache = next;
  window.dispatchEvent(new Event(EVENT_NAME));
}

// 回傳目前的比較清單與操作方法
export function useCompareList() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (slug: string) => {
    if (list.includes(slug)) {
      setCompareList(list.filter((item) => item !== slug));
      return true;
    }
    if (list.length >= MAX_COMPARE) return false;
    setCompareList([...list, slug]);
    return true;
  };

  return {
    list,
    isFull: list.length >= MAX_COMPARE,
    has: (slug: string) => list.includes(slug),
    toggle,
    remove: (slug: string) => setCompareList(list.filter((item) => item !== slug)),
    clear: () => setCompareList([]),
    set: setCompareList,
  };
}
