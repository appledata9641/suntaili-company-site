import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  categoryName: string;
}

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {categoryName}
          </span>
          <span className="text-xs text-slate-500">{product.model}</span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 text-sm font-medium text-slate-900">查看產品詳情</div>
      </div>
    </Link>
  );
}
