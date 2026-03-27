interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
    );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-5">
                    <Skeleton className="h-5 w-full" />
                </td>
            ))}
        </tr>
    );
}

export function TableSkeleton({
    rows = 5,
    columns = 6,
}: {
    rows?: number;
    columns?: number;
}) {
    return (
        <div className="space-y-3">
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="p-5 text-left">
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
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

export function CaseDetailSkeleton() {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Hero skeleton */}
            <Skeleton className="h-64 w-full rounded-2xl" />
            {/* Progress bar skeleton */}
            <div className="bg-white rounded-2xl p-8 space-y-4 border border-gray-100">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-6 w-full rounded-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
            </div>
            {/* Two column */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
                <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            </div>
        </div>
    );
}
