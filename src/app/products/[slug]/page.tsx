import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { productCategories } from "@/data/categories";
import { downloads } from "@/data/downloads";
import { publishedProducts } from "@/data/products";
import { sortDownloadsByDateDesc } from "@/lib/downloads";

export async function generateStaticParams() {
  return publishedProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = publishedProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const category = productCategories.find((item) => item.id === product.category);
  const relatedDownloads = sortDownloadsByDateDesc(
    downloads.filter((item) => item.productSlug === product.slug),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image
                src={product.coverImage}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {category?.name ?? "產品"}
                </span>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                  {product.model}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">產品特色</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {product.featureBullets.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">規格摘要</h2>
              <dl className="mt-4 space-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[100px_1fr] gap-3 text-sm">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="font-medium text-slate-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="相關下載"
            title="此型號可用文件"
            description="後續若改為受控下載，可再接 API 產生短效簽名網址。"
          />

          {relatedDownloads.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              目前尚未提供此型號的下載文件。
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {relatedDownloads.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-600">
                      {item.version} ・ {item.releaseDate} ・ {item.fileSize}
                    </div>
                    {item.notes ? (
                      <p className="mt-1 text-xs leading-6 text-slate-500">{item.notes}</p>
                    ) : null}
                  </div>
                  <Link
                    href={item.downloadUrl}
                    className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                  >
                    下載
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
