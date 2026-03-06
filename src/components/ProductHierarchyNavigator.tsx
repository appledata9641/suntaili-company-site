"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { menuTaxonomyGroups } from "@/data/taxonomy";
import type { TaxonomyMenuNode } from "@/types/taxonomy";
import type { Product } from "@/types/product";

interface ProductHierarchyNavigatorProps {
  products: Product[];
  compact?: boolean;
  onNavigate?: () => void;
  initialQuery?: string;
}

interface LeafEntry {
  key: string;
  label: string;
  products: Product[];
}

interface BranchEntry {
  key: string;
  label: string;
  leaves: LeafEntry[];
}

interface ColumnEntry {
  key: string;
  label: string;
  branches: BranchEntry[];
}

interface GroupEntry {
  key: string;
  name: string;
  columns: ColumnEntry[];
}

export default function ProductHierarchyNavigator({
  products,
  compact = false,
  onNavigate,
  initialQuery = "",
}: ProductHierarchyNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handleKeywordSync = (event: Event) => {
      const customEvent = event as CustomEvent<{ keyword?: string }>;
      const keyword = customEvent.detail?.keyword?.trim();
      if (!keyword) return;
      setSearchQuery(keyword);
    };

    window.addEventListener("suntaili:product-keyword", handleKeywordSync as EventListener);
    return () => {
      window.removeEventListener("suntaili:product-keyword", handleKeywordSync as EventListener);
    };
  }, []);

  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  const resolveProducts = (slugs?: string[]) =>
    (slugs ?? [])
      .map((slug) => productBySlug.get(slug))
      .filter((product): product is Product => Boolean(product));

  const collectLeaves = (node: TaxonomyMenuNode): LeafEntry[] => {
    const directProducts = resolveProducts(node.productSlugs);
    const directLeaves =
      directProducts.length > 0
        ? [
            {
              key: `${node.key}__leaf`,
              label: node.label,
              products: directProducts,
            },
          ]
        : [];
    const childLeaves = node.children?.flatMap((child) => collectLeaves(child)) ?? [];
    return [...directLeaves, ...childLeaves];
  };

  const buildColumnEntries = (node: TaxonomyMenuNode): ColumnEntry | null => {
    if (node.children && node.children.length > 0) {
      const branches = node.children
        .map((child) => ({
          key: child.key,
          label: child.label,
          leaves: collectLeaves(child),
        }))
        .filter((branch) => branch.leaves.length > 0);

      if (branches.length === 0) return null;

      return {
        key: node.key,
        label: node.label,
        branches,
      };
    }

    const directProducts = resolveProducts(node.productSlugs);
    if (directProducts.length === 0) return null;

    return {
      key: node.key,
      label: node.label,
      branches: [
        {
          key: `${node.key}__branch`,
          label: node.label,
          leaves: [
            {
              key: `${node.key}__leaf`,
              label: node.label,
              products: directProducts,
            },
          ],
        },
      ],
    };
  };

  const allGroups: GroupEntry[] = menuTaxonomyGroups
    .map((group) => ({
      key: group.key,
      name: group.name,
      columns: group.columns
        .map((column) => buildColumnEntries(column))
        .filter((column): column is ColumnEntry => Boolean(column)),
    }))
    .filter((group) => group.columns.length > 0);

  const normalizedQuery = deferredSearchQuery.toLowerCase().replace(/\s+/g, " ").trim();
  const hasQuery = normalizedQuery.length > 0;

  const filteredGroups: GroupEntry[] = hasQuery
    ? allGroups
        .map((group) => {
          const groupHit = group.name.toLowerCase().includes(normalizedQuery);

          const columns = group.columns
            .map((column) => {
              const columnHit = column.label.toLowerCase().includes(normalizedQuery);

              const branches = column.branches
                .map((branch) => {
                  const branchHit = branch.label.toLowerCase().includes(normalizedQuery);

                  const leaves = branch.leaves
                    .map((leaf) => {
                      const leafHit = leaf.label.toLowerCase().includes(normalizedQuery);

                      const filteredProducts = leaf.products.filter((product) =>
                        [product.model, product.name, product.shortDescription, ...(product.tags ?? [])]
                          .join(" ")
                          .toLowerCase()
                          .includes(normalizedQuery),
                      );

                      if (groupHit || columnHit || branchHit || leafHit) return leaf;
                      if (filteredProducts.length === 0) return null;

                      return {
                        ...leaf,
                        products: filteredProducts,
                      };
                    })
                    .filter((leaf): leaf is LeafEntry => Boolean(leaf));

                  if (groupHit || columnHit || branchHit) return branch;
                  if (leaves.length === 0) return null;

                  return {
                    ...branch,
                    leaves,
                  };
                })
                .filter((branch): branch is BranchEntry => Boolean(branch));

              if (groupHit || columnHit) return column;
              if (branches.length === 0) return null;

              return {
                ...column,
                branches,
              };
            })
            .filter((column): column is ColumnEntry => Boolean(column));

          if (groupHit) return group;
          if (columns.length === 0) return null;

          return {
            ...group,
            columns,
          };
        })
        .filter((group): group is GroupEntry => Boolean(group))
    : allGroups;

  const [activeGroupKey, setActiveGroupKey] = useState<string>("");
  const [activeColumnKeys, setActiveColumnKeys] = useState<Record<string, string>>({});
  const [activeBranchKeys, setActiveBranchKeys] = useState<Record<string, string>>({});
  const [openGroupKey, setOpenGroupKey] = useState<string>("");
  const [openBranchKeys, setOpenBranchKeys] = useState<Record<string, boolean>>({});

  if (filteredGroups.length === 0) {
    return (
      <section className={compact ? "space-y-4" : "space-y-6"}>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="hierarchy-search" className="mb-2 block text-sm font-medium text-slate-700">
            搜尋分類 / 品牌 / 型號
          </label>
          <input
            id="hierarchy-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="例如：三泰利、AVTECH、DVR 8路、2MP"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          找不到符合條件的分類或型號，請換個關鍵字。
        </div>
      </section>
    );
  }

  const activeGroup = filteredGroups.find((group) => group.key === activeGroupKey) ?? filteredGroups[0];
  const activeColumn =
    activeGroup.columns.find((column) => column.key === activeColumnKeys[activeGroup.key]) ?? activeGroup.columns[0];
  const activeBranch =
    activeColumn.branches.find((branch) => branch.key === activeBranchKeys[activeColumn.key]) ??
    activeColumn.branches[0];

  return (
    <section className={compact ? "space-y-4" : "space-y-6"}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="hierarchy-search" className="mb-2 block text-sm font-medium text-slate-700">
          搜尋分類 / 品牌 / 型號
        </label>
        <input
          id="hierarchy-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="例如：三泰利、AVTECH、DVR 8路、2MP"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="hidden flex-wrap gap-2 lg:flex">
        {filteredGroups.map((group) => (
          <button
            key={group.key}
            type="button"
            onClick={() => setActiveGroupKey(group.key)}
            className={
              group.key === activeGroup.key
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
            }
          >
            {group.name}
          </button>
        ))}
      </div>

      <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
        <aside className="space-y-2 border-r border-slate-200 pr-4">
          {activeGroup.columns.map((column) => (
            <button
              key={column.key}
              type="button"
              onClick={() =>
                setActiveColumnKeys((current) => ({
                  ...current,
                  [activeGroup.key]: column.key,
                }))
              }
              className={
                column.key === activeColumn.key
                  ? "w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white"
                  : "w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              }
            >
              {column.label}
            </button>
          ))}
        </aside>

        <div className="grid grid-cols-[220px_1fr] gap-6">
          <aside className="space-y-2 border-r border-slate-200 pr-4">
            {activeColumn.branches.map((branch) => (
              <button
                key={branch.key}
                type="button"
                onClick={() =>
                  setActiveBranchKeys((current) => ({
                    ...current,
                    [activeColumn.key]: branch.key,
                  }))
                }
                className={
                  branch.key === activeBranch.key
                    ? "w-full rounded-xl bg-slate-900 px-3 py-2 text-left text-sm font-medium text-white"
                    : "w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                }
              >
                {branch.label}
              </button>
            ))}
          </aside>

          <div className="space-y-3">
            {activeBranch.leaves.map((leaf) => (
              <div key={leaf.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">{leaf.label}</h4>
                  <span className="text-xs text-slate-500">{leaf.products.length} 項</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {leaf.products.map((product) => (
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
      </div>

      <div className="space-y-3 lg:hidden">
        {filteredGroups.map((group) => {
          const groupOpen = openGroupKey === group.key;
          return (
            <div key={group.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setOpenGroupKey((current) => (current === group.key ? "" : group.key))}
                aria-expanded={groupOpen}
              >
                <span className="text-sm font-semibold text-slate-900">{group.name}</span>
                <span className="text-slate-500">{groupOpen ? "▲" : "▼"}</span>
              </button>

              {groupOpen ? (
                <div className="space-y-3 border-t border-slate-100 px-4 py-3">
                  {group.columns.map((column) => (
                    <div key={column.key} className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-800">{column.label}</h3>
                      {column.branches.map((branch) => {
                        const branchOpen = Boolean(openBranchKeys[branch.key]);
                        return (
                          <div key={branch.key} className="rounded-xl border border-slate-200">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between px-3 py-2 text-left"
                              onClick={() =>
                                setOpenBranchKeys((current) => ({
                                  ...current,
                                  [branch.key]: !current[branch.key],
                                }))
                              }
                              aria-expanded={branchOpen}
                            >
                              <span className="text-sm text-slate-800">{branch.label}</span>
                              <span className="text-xs text-slate-500">{branchOpen ? "－" : "＋"}</span>
                            </button>

                            {branchOpen ? (
                              <div className="space-y-2 border-t border-slate-100 p-2">
                                {branch.leaves.map((leaf) => (
                                  <div key={leaf.key} className="space-y-2 rounded-lg bg-slate-50 p-2">
                                    <div className="text-xs font-semibold text-slate-700">
                                      {leaf.label} ({leaf.products.length} 項)
                                    </div>
                                    {leaf.products.map((product) => (
                                      <Link
                                        key={product.slug}
                                        href={`/products/${product.slug}`}
                                        onClick={onNavigate}
                                        className="block rounded-lg bg-white px-3 py-2 text-sm text-slate-700"
                                      >
                                        <div className="font-medium">{product.model}</div>
                                        <div className="line-clamp-1 text-xs text-slate-500">{product.name}</div>
                                      </Link>
                                    ))}
                                  </div>
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
