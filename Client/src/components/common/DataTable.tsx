import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    onRowClick?: (item: T) => void;
    pagination?: {
        page: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
    actions?: React.ReactNode;
    title?: string;
    description?: string;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    searchBar?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
    columns,
    data,
    loading,
    onRowClick,
    pagination,
    actions,
    title,
    description,
    selectable = false,
    onSelectionChange,
    searchBar
}: DataTableProps<T>) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = data.map(item => String(item.id));
            setSelectedIds(allIds);
            onSelectionChange?.(allIds);
        } else {
            setSelectedIds([]);
            onSelectionChange?.([]);
        }
    };

    const handleSelectOne = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation(); // Prevent row click
        let newSelected: string[];
        if (e.target.checked) {
            newSelected = [...selectedIds, id];
        } else {
            newSelected = selectedIds.filter(itemId => itemId !== id);
        }
        setSelectedIds(newSelected);
        onSelectionChange?.(newSelected);
    };

    const isAllSelected = data.length > 0 && selectedIds.length === data.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

    return (
        <div className="space-y-6">
            {/* Table Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    {title && <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white transition-colors">{title}</h2>}
                    {description && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">{description}</p>}
                </div>

                <div className="flex items-center gap-3">
                    {/* Show search bar if provided */}
                    {searchBar && <div className="flex-1 min-w-[250px]">{searchBar}</div>}

                    {/* Show Bulk Actions if items selected */}
                    {selectable && selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                                {selectedIds.length} selected
                            </span>
                        </div>
                    )}
                    {actions}
                </div>
            </div>

            {/* Main Table Container */}
            <div className="glass-card rounded-2xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5">
                                {selectable && (
                                    <th className="px-6 py-4 w-12">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </th>
                                )}
                                {columns.map((column, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ${column.className || ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.header}
                                            {column.sortable && <ArrowUp className="w-3 h-3 opacity-30" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            <AnimatePresence>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <tr key={`skeleton-${idx}`}>
                                            {selectable && <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse" /></td>}
                                            {columns.map((_, colIdx) => (
                                                <td key={colIdx} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : data.length > 0 ? (
                                    data.map((item, idx) => (
                                        <motion.tr
                                            key={item.id || idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            onClick={() => onRowClick?.(item)}
                                            className={`group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${selectedIds.includes(String(item.id)) ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                                        >
                                            {selectable && (
                                                <td className="px-6 py-5">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(String(item.id))}
                                                        onChange={(e) => handleSelectOne(String(item.id), e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                    />
                                                </td>
                                            )}
                                            {columns.map((column, colIdx) => (
                                                <td key={colIdx} className={`px-6 py-5 text-sm text-slate-700 dark:text-slate-300 ${column.className || ''}`}>
                                                    {typeof column.accessor === 'function'
                                                        ? column.accessor(item)
                                                        : (item[column.accessor] as React.ReactNode)}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                                <Inbox className="w-10 h-10 opacity-20" />
                                                <p className="font-medium">No results found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Console */}
                {pagination && (
                    <div className="px-6 py-4 bg-gray-50/30 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">
                            Showing <span className="text-slate-700 dark:text-slate-300 font-bold">{data.length}</span> of <span className="text-slate-700 dark:text-slate-300 font-bold">{pagination.totalItems}</span> entries
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => pagination.onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors border border-gray-200 dark:border-white/5 text-slate-600 dark:text-slate-400"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1 px-2 font-display">
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pagination.page}</span>
                                <span className="text-slate-400 dark:text-slate-600">/</span>
                                <span className="text-slate-500 dark:text-slate-500">{pagination.totalPages}</span>
                            </div>

                            <button
                                onClick={() => pagination.onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors border border-gray-200 dark:border-white/5 text-slate-600 dark:text-slate-400"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
