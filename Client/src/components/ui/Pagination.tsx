import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  itemName?: string;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  itemsPerPage = 10,
  itemName = 'items',
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between ${className}`}>
      <div className="text-sm font-medium text-gray-700">
        Showing <span className="font-bold text-gray-900">page {page}</span> of{' '}
        <span className="font-bold text-gray-900">{totalPages}</span> ({total} total {itemName})
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-5 py-2 text-sm font-medium bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-5 py-2 text-sm font-medium bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

