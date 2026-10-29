"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 篩選條件與網址參數同步（文件下載、產品型錄共用）：
// 畫面以 state 為準，操作時立即反應；網址用 router.replace 跟上（關鍵字延遲 300ms，避免每打一個字就換一次網址）。
// 網址被外部改變時（例如從選單點「使用說明書」進來），改以網址為準。
interface UrlQueryOptions<Q> {
  // 頁面路徑，例如 "/resources/"
  path: string;
  parse: (params: URLSearchParams) => Q;
  // 把條件寫進網址參數；沒設定的條件要刪掉，其他不認得的參數保留
  write: (query: Q, params: URLSearchParams) => void;
}

interface UrlQueryState<Q> {
  query: Q;
  // 上次看到的網址參數
  seenUrl: string;
  // 自己送出、還沒反映到網址的參數
  pushed: string[];
}

const KEYWORD_DELAY = 300;

export function useUrlQuery<Q>({ path, parse, write }: UrlQueryOptions<Q>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlString = searchParams.toString();
  const [state, setState] = useState<UrlQueryState<Q>>(() => ({
    query: parse(new URLSearchParams(urlString)),
    seenUrl: urlString,
    pushed: [],
  }));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  let current = state;
  if (urlString !== state.seenUrl) {
    const index = state.pushed.indexOf(urlString);
    current =
      index >= 0
        ? { ...state, seenUrl: urlString, pushed: state.pushed.slice(index + 1) }
        : { query: parse(new URLSearchParams(urlString)), seenUrl: urlString, pushed: [] };
    setState(current);
  }

  useEffect(() => {
    const pending = timer;
    return () => {
      if (pending.current) clearTimeout(pending.current);
    };
  }, []);

  const push = (query: Q) => {
    // 已經離開這一頁就不再改網址
    if (window.location.pathname.replace(/\/+$/, "") !== path.replace(/\/+$/, "")) return;
    const params = new URLSearchParams(window.location.search);
    write(query, params);
    const next = params.toString();
    setState((prev) => ({ ...prev, pushed: [...prev.pushed, next] }));
    router.replace(next ? `${path}?${next}` : path, { scroll: false });
  };

  const setQuery = (query: Q, options: { delay?: boolean } = {}) => {
    setState((prev) => ({ ...prev, query }));
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (options.delay) {
      timer.current = setTimeout(() => {
        timer.current = null;
        push(query);
      }, KEYWORD_DELAY);
    } else {
      push(query);
    }
  };

  return [current.query, setQuery] as const;
}
