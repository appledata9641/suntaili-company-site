"use client";

import Link from "next/link";
import { useState } from "react";
import { getTaxonomyTree } from "@/data/taxonomy";
import type { Product } from "@/types/product";

interface ProductHierarchyNavigatorProps {
  products: Product[];
  compact?: boolean;
  onNavigate?: () => void;
}

export default function ProductHierarchyNavigator({
  products,
  compact = false,
  onNavigate,
}: ProductHierarchyNavigatorProps) {
  const tree = getTaxonomyTree(products);
  const [activeGroupKey, setActiveGroupKey] = useState<string>(tree[0]?.group.key ?? "");
  const [openGroupKey, setOpenGroupKey] = useState<string>(tree[0]?.group.key ?? "");
  const [openSubcategoryKeys, setOpenSubcategoryKeys] = useState<Record<string, boolean>>({});

  if (tree.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        目前尚無可用的分類資料。
      </div>
    );
  }

  const activeGroup = tree.find((node) => node.group.key === activeGroupKey) ?? tree[0];

  return (
    <section className={compact ? "space-y-4" : "space-y-6"}>
      <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
        <aside className="space-y-2 border-r border-slate-200 pr-4">
          {tree.map((groupNode) => {
            const active = groupNode.group.key === activeGroup.group.key;
            return (
              <button
                key={groupNode.group.key}
                type="button"
                onClick={() => setActiveGroupKey(groupNode.group.key)}
                className={
                  active
                    ? "w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white"
                    : "w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                }
              >
                {groupNode.group.name}
              </button>
            );
          })}
        </aside>

        <div className="space-y-5">
          {activeGroup.categories.map((categoryNode) => (
            <div key={categoryNode.category.id} className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900">{categoryNode.category.name}</h3>
              <div className="space-y-3">
                {categoryNode.subcategories.map((subcategoryNode) => (
                  <div key={subcategoryNode.subcategory.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800">{subcategoryNode.subcategory.name}</h4>
                      <span className="text-xs text-slate-500">{subcategoryNode.products.length} 項</span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {subcategoryNode.products.map((product) => (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          onClick={onNavigate}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        >
                          <div className="font-medium">{product.model}</div>
                          <div className="line-clamp-1 text-xs text-slate-500">{product.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {tree.map((groupNode) => {
          const groupOpen = openGroupKey === groupNode.group.key;
          return (
            <div key={groupNode.group.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() =>
                  setOpenGroupKey((current) => (current === groupNode.group.key ? "" : groupNode.group.key))
                }
                aria-expanded={groupOpen}
              >
                <span className="text-sm font-semibold text-slate-900">{groupNode.group.name}</span>
                <span className="text-slate-500">{groupOpen ? "－" : "＋"}</span>
              </button>

              {groupOpen ? (
                <div className="space-y-3 border-t border-slate-100 px-4 py-3">
                  {groupNode.categories.map((categoryNode) => (
                    <div key={categoryNode.category.id} className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-800">{categoryNode.category.name}</h3>
                      {categoryNode.subcategories.map((subcategoryNode) => {
                        const subOpen = Boolean(openSubcategoryKeys[subcategoryNode.subcategory.key]);
                        return (
                          <div key={subcategoryNode.subcategory.key} className="rounded-xl border border-slate-200">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between px-3 py-2 text-left"
                              onClick={() =>
                                setOpenSubcategoryKeys((current) => ({
                                  ...current,
                                  [subcategoryNode.subcategory.key]: !current[subcategoryNode.subcategory.key],
                                }))
                              }
                              aria-expanded={subOpen}
                            >
                              <span className="text-sm text-slate-800">{subcategoryNode.subcategory.name}</span>
                              <span className="text-xs text-slate-500">
                                {subcategoryNode.products.length} 項 {subOpen ? "▲" : "▼"}
                              </span>
                            </button>
                            {subOpen ? (
                              <div className="space-y-2 border-t border-slate-100 p-2">
                                {subcategoryNode.products.map((product) => (
                                  <Link
                                    key={product.slug}
                                    href={`/products/${product.slug}`}
                                    onClick={onNavigate}
                                    className="block rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                                  >
                                    <div className="font-medium">{product.model}</div>
                                    <div className="line-clamp-1 text-xs text-slate-500">{product.name}</div>
                                  </Link>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
