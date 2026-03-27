import { motion } from "framer-motion";
import { Search, ExternalLink, Copy, Check } from "lucide-react";
import { Skeleton } from "./Skeleton";
import type { CaseSummary } from "../types/api";
import StatusBadge from "./StatusBadge";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

interface Column {
    key: string;
    label: string;
    align?: "left" | "right";
}

interface CaseTableProps {
    cases: CaseSummary[];
    loading: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchPlaceholder?: string;
    emptyIcon?: React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    columns: Column[];
    renderRow: (
        caseItem: CaseSummary,
        helpers: {
            copy: (text: string, id: string | number) => void;
            isCopied: (id: string | number) => boolean;
        }
    ) => React.ReactNode;
}

export default function CaseTable({
    cases,
    loading,
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search by patient name or case ID...",
    emptyIcon,
    emptyTitle = "No cases found",
    emptyDescription,
    columns,
    renderRow,
}: CaseTableProps) {
    const { copy, isCopied } = useCopyToClipboard();

    const filteredCases = cases.filter(
        (c) =>
            (c.patientName ?? "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            c.caseId.toString().includes(searchQuery)
    );

    return (
        <div className="bg-white rounded-[32px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.04),0_10px_10px_-5px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            {/* Search Bar */}
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-[#1E293B] font-medium placeholder:text-gray-400 shadow-sm"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-8 py-5 text-left">
                                        <Skeleton className="h-3 w-16" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-8 py-5">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : filteredCases.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        {emptyIcon || (
                            <Search className="w-10 h-10 text-gray-200" />
                        )}
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-2">
                        {emptyTitle}
                    </p>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        {emptyDescription ||
                            (searchQuery
                                ? "Try refining your search terms."
                                : "Cases will appear here.")}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-8 py-5 text-xs font-extrabold text-[#64748B] uppercase tracking-[0.2em] ${
                                            col.align === "right"
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCases.map((caseItem, index) => (
                                <motion.tr
                                    key={caseItem.caseId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {renderRow(caseItem, { copy, isCopied })}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Reusable cell components
export function CaseIdCell({ caseId }: { caseId: number }) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-900">
                #{caseId}
            </span>
        </td>
    );
}

export function PatientNameCell({ name }: { name: string }) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-900">{name}</span>
        </td>
    );
}

export function StatusCell({
    status,
    percentage,
}: {
    status: string;
    percentage?: number;
}) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <StatusBadge status={status} percentage={percentage} />
        </td>
    );
}

export function ProgressCell({ percentage }: { percentage: number }) {
    const barColor =
        percentage >= 100
            ? "bg-success-500"
            : percentage >= 60
            ? "bg-primary-500"
            : "bg-warning-500";

    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div
                        className={`h-2 rounded-full ${barColor}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                    {percentage}%
                </span>
            </div>
        </td>
    );
}

export function FinancialsCell({
    raised,
    target,
}: {
    raised: number;
    target: number;
}) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm">
                <span className="font-semibold text-gray-900">
                    ₦{(raised || 0).toLocaleString()}
                </span>
                <span className="text-gray-500">
                    {" "}
                    / ₦{(target || 0).toLocaleString()}
                </span>
            </div>
        </td>
    );
}

export function VirtualAccountCell({
    accountNumber,
    caseId,
    copy,
    isCopied,
}: {
    accountNumber?: string;
    caseId: number;
    copy: (text: string, id: string | number) => void;
    isCopied: (id: string | number) => boolean;
}) {
    if (!accountNumber) {
        return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                N/A
            </td>
        );
    }

    return (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center gap-2 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit">
                <span>{accountNumber}</span>
                <button
                    onClick={() => copy(accountNumber, caseId)}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                    title="Copy Account Number"
                >
                    {isCopied(caseId) ? (
                        <Check className="w-4 h-4 text-success-600" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </td>
    );
}

export function ViewCaseCell({
    caseId,
    label = "View Case",
}: {
    caseId: number;
    label?: string;
}) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <a
                href={`/case/${caseId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
                {label}
                <ExternalLink className="w-4 h-4" />
            </a>
        </td>
    );
}

export function DateCell({ date }: { date: string }) {
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-500">
                {new Date(date).toLocaleDateString()}
            </span>
        </td>
    );
}
