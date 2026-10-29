// 搜尋用的文字正規化：全形轉半形、轉小寫，讓「ＶＭＳ」「vms」都找得到
export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLowerCase();
}
