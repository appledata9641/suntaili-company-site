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

export default function CategoryPills({
  items,
  activeId,
  onChange,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="分類篩選">
      {items.map((item) => {
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
            ].join(" ")}
            aria-pressed={active}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
