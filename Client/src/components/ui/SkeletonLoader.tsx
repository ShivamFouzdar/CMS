import { memo } from 'react';

interface SkeletonProps {
    className?: string;
}

// Base skeleton with pulse animation
const Skeleton = memo(function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%] rounded-lg ${className}`}
            style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
        />
    );
});

// Skeleton for stat cards
export const StatCardSkeleton = memo(function StatCardSkeleton() {
    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>
        </div>
    );
});

// Skeleton for table rows
export const TableRowSkeleton = memo(function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-gray-100 dark:border-white/5">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <Skeleton className={`h-4 ${i === 0 ? 'w-32' : 'w-20'}`} />
                </td>
            ))}
        </tr>
    );
});

// Skeleton for a full table
export const TableSkeleton = memo(function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-white/5">
                <Skeleton className="h-6 w-40" />
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-4 py-3 text-left">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    );
});

// Skeleton for dashboard page
export const DashboardSkeleton = memo(function DashboardSkeleton() {
    return (
        <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2 glass-card rounded-2xl p-6 space-y-4">
                    <Skeleton className="h-6 w-40" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-20 rounded-xl" />
                        <Skeleton className="h-20 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
});

// Add shimmer keyframes via a style tag (or add to index.css)
export function SkeletonStyles() {
    return (
        <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    );
}

export { Skeleton };
