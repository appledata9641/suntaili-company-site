"use client";

interface CategoryPillItem {
  id: string;
  label: string;
}

interface CategoryPillsProps {
  items: CategoryPillItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function CategoryPills({ items, activeId, onChange }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="產品分類切換">
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={
              active
                ? "rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white transition"
                : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400"
            }
            aria-pressed={active}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
