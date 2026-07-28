import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { getProductCategory } from "@/lib/product-content";

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = productCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const products = publishedProducts.filter((product) => product.category === category.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <nav aria-label="麵包屑" className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-slate-900">
            產品分類
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{category.name}</span>
        </nav>

        <SectionHeading eyebrow="產品分類" title={category.name} description={category.description} />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const productCategory = getProductCategory(product);

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={product.coverImage}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {productCategory?.shortName ?? "產品"}
                    </span>
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                      {product.model}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-7 text-slate-950">{product.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
