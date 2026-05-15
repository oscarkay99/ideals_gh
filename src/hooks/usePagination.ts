import { useState, useEffect } from 'react';

export function usePagination<T>(items: T[], pageSize: number, resetOn?: unknown) {
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [resetOn]);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);
  const paginated = items.slice((safePage - 1) * pageSize, safePage * pageSize);

  return { page: safePage, setPage, paginated, totalPages, total, from, to };
}
