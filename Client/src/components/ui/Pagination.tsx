
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  itemName = 'items',
  total = 0,
}: PaginationProps & { itemName?: string; total?: number }) {
  if (totalPages <= 1) return null;

  return (
    <div className={`bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between ${className}`}>
      <div className="text-sm font-medium text-gray-700">
        Showing <span className="font-bold text-gray-900">page {currentPage}</span> of{' '}
        <span className="font-bold text-gray-900">{totalPages}</span> ({total} total {itemName})
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 text-sm font-medium bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-5 py-2 text-sm font-medium bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

