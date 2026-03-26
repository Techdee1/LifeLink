interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
        />
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
            {/* Search bar skeleton */}
            <Skeleton className="h-12 w-full max-w-md rounded-2xl" />
            {/* Table skeleton */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
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
        <div className="bg-white rounded-[32px] p-8 border border-gray-100">
            <Skeleton className="h-14 w-14 rounded-2xl mb-8" />
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

export function CaseDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-40" />
            <div className="bg-white rounded-2xl p-8 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-full" />
            </div>
        </div>
    );
}
