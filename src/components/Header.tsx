import HeaderClient from "@/components/HeaderClient";
import { productMenuColumns } from "@/data/navigation";
import { hasCenterCategoryProducts } from "@/lib/product-availability";

// 頁首：先在伺服器端依目前刊登的產品，拿掉沒有產品的分類（例如週邊配件），再交給 HeaderClient 處理選單互動。
// 產品資料只在建置時使用，不會送到瀏覽器。
export default function Header() {
  const productColumns = productMenuColumns.filter((column) => hasCenterCategoryProducts(column.category));
  return <HeaderClient productColumns={productColumns} />;
}
