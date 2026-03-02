import { NextResponse } from "next/server";

export function parsePositiveInt(
  value: string | null,
  fallback: number,
  { min = 1, max = 100 }: { min?: number; max?: number } = {},
) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export function parseBoolean(value: string | null, fallback: boolean) {
  if (value == null) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  );
}

export function normalizeSearchTerm(input: string | null) {
  return (input ?? "").trim().toLowerCase();
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page: currentPage,
      pageSize,
      total,
      totalPages,
    },
  };
}
