import { useState, useEffect, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

interface UsePaginationReturn {
  page: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setTotal: (total: number) => void;
  setTotalPages: (totalPages: number) => void;
}

/**
 * Custom hook for pagination state management
 * Reduces boilerplate for paginated data
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = 1,
    itemsPerPage = 10,
    onPageChange,
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPageState(newPage);
        onPageChange?.(newPage);
      }
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages, setPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  return {
    page,
    totalPages,
    total,
    itemsPerPage,
    setPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setTotal,
    setTotalPages,
  };
}

