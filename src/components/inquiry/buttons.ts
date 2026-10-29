import { buttonClass, type ButtonVariant } from "@/components/ui/styles";

// 設計稿裡 196×58 的大按鈕（寄送 Email、文件下載、填寫表單需求）：字 18pt、字重 Medium、文字置中、圖示靠右。
// 內容請放 <span className="flex-1 text-center">文字</span> 加上圖示（箭頭 27px、下載 24px，同設計稿）。
export function wideButtonClass(variant: ButtonVariant, extra = "") {
  return buttonClass(variant, "lg", `w-full max-w-[320px] pl-6 pr-3 font-medium! tracking-[0.06em]! sm:w-[196px] lg:text-lg! ${extra}`);
}
