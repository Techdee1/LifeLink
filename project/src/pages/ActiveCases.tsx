import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    LayoutGrid,
    List,
    Heart,
    ExternalLink,
    Copy,
    Check,
    Filter,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import NewEmergencyModal from "../components/NewEmergencyModal";
import CaseTable, {
    CaseIdCell,
    PatientNameCell,
    StatusCell,
    ProgressCell,
    FinancialsCell,
    VirtualAccountCell,
    ViewCaseCell,
} from "../components/CaseTable";
import { caseAPI } from "../lib/api-service";
import type { CaseSummary, CaseStatus } from "../types/api";
import { Skeleton } from "../components/Skeleton";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

const COLUMNS = [
    { key: "caseId", label: "Case" },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status" },
    { key: "progress", label: "Progress" },
    { key: "financials", label: "Financials" },
    { key: "account", label: "Account" },
    { key: "actions", label: "Actions", align: "right" as const },
];

type FilterStatus = "ALL" | CaseStatus;

const STATUS_FILTERS: { label: string; value: FilterStatus; color: string }[] = [
    { label: "All", value: "ALL", color: "bg-gray-100 text-gray-700 border-gray-200" },
    { label: "Open", value: "OPEN", color: "bg-gray-50 text-gray-600 border-gray-200" },
    { label: "In Progress", value: "PARTIALLY_FUNDED", color: "bg-warning-50 text-warning-700 border-warning-200" },
    { label: "Bridge Eligible", value: "BRIDGE_ELIGIBLE", color: "bg-primary-50 text-primary-700 border-primary-200" },
    { label: "Fully Funded", value: "FULLY_FUNDED", color: "bg-success-50 text-success-700 border-success-200" },
];

function getStatusColor(status: string) {
    switch (status) {
        case "OPEN": return "bg-gray-100 text-gray-600";
        case "PARTIALLY_FUNDED": return "bg-warning-50 text-warning-700";
        case "BRIDGE_ELIGIBLE": return "bg-primary-50 text-primary-700";
        case "FULLY_FUNDED": return "bg-success-50 text-success-700";
        case "CLOSED": return "bg-secondary-50 text-secondary-700";
        default: return "bg-gray-100 text-gray-600";
    }
}

function getProgressColor(percentage: number) {
    if (percentage >= 100) return "bg-success-500";
    if (percentage >= 60) return "bg-primary-500";
    return "bg-warning-500";
}

function getStatusBorderColor(status: string) {
    switch (status) {
        case "OPEN": return "border-l-gray-300";
        case "PARTIALLY_FUNDED": return "border-l-warning-400";
        case "BRIDGE_ELIGIBLE": return "border-l-primary-400";
        case "FULLY_FUNDED": return "border-l-success-400";
        case "CLOSED": return "border-l-secondary-400";
        default: return "border-l-gray-300";
    }
}

function formatStatus(status: string) {
    return status.replace(/_/g, " ");
}

function CaseCard({ caseItem }: { caseItem: CaseSummary }) {
    const { copy, isCopied } = useCopyToClipboard();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white rounded-xl border border-gray-100 ${getStatusBorderColor(caseItem.status)} border-l-4 hover:shadow-lg transition-all duration-300 group`}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-4 h-4 text-primary-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{caseItem.patientName}</p>
                            <p className="text-xs text-gray-400">Case #{caseItem.caseId}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusColor(caseItem.status)}`}>
                        {formatStatus(caseItem.status)}
                    </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{caseItem.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${getProgressColor(caseItem.percentage)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(caseItem.percentage, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Financials */}
                <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-3">
                    <div>
                        <p className="text-xs text-gray-400">Raised</p>
                        <p className="text-sm font-bold text-gray-900">
                            ₦{(caseItem.raisedAmount || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Target</p>
                        <p className="text-sm font-bold text-gray-600">
                            ₦{(caseItem.targetAmount || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Account & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    {caseItem.virtualAccountNumber ? (
                        <button
                            onClick={() => copy(caseItem.virtualAccountNumber!, caseItem.caseId)}
                            className="flex items-center gap-1.5 text-xs font-mono bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                        >
                            <span className="text-gray-600">{caseItem.virtualAccountNumber}</span>
                            {isCopied(caseItem.caseId) ? (
                                <Check className="w-3.5 h-3.5 text-success-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-gray-400" />
                            )}
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400">No account</span>
                    )}
                    <Link
                        to={`/case/${caseItem.caseId}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        View
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function CardGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-1.5" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-lg" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full mb-4" />
                    <Skeleton className="h-16 w-full rounded-lg mb-4" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export default function ActiveCases() {
    const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cases, setCases] = useState<CaseSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const data = await caseAPI.getActive();
                setCases(data);
            } catch (error) {
                console.error("Failed to fetch active cases:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const filteredCases = cases.filter((c) => {
        const matchesSearch =
            (c.patientName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.caseId.toString().includes(searchQuery);
        const matchesFilter = statusFilter === "ALL" || c.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const filterCounts = STATUS_FILTERS.map((f) => ({
        ...f,
        count: f.value === "ALL" ? cases.length : cases.filter((c) => c.status === f.value).length,
    }));

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 max-w-7xl mx-auto pb-28 md:pb-8">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl font-heading font-black text-[#0F172A] tracking-tight">
                                Active Cases
                            </h1>
                            <p className="text-gray-500 mt-1 text-base font-medium">
                                {cases.length} case{cases.length !== 1 ? "s" : ""} in progress
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowNewEmergencyModal(true)}
                            className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-primary-500/20"
                        >
                            <Plus className="w-5 h-5 stroke-[3px]" />
                            <span className="text-sm">New Emergency</span>
                        </motion.button>
                    </header>

                    {/* Toolbar: Search + Filters + View Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 space-y-4"
                    >
                        {/* Search + View Toggle Row */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by patient name or case ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all text-sm text-gray-800 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-lg transition-all ${
                                        viewMode === "grid"
                                            ? "bg-[#0F172A] text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`p-2.5 rounded-lg transition-all ${
                                        viewMode === "table"
                                            ? "bg-[#0F172A] text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-gray-400" />
                            {filterCounts.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setStatusFilter(filter.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                        statusFilter === filter.value
                                            ? `${filter.color} ring-2 ring-offset-1 ring-gray-200`
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {filter.label}
                                    {filter.count > 0 && (
                                        <span className="ml-1.5 opacity-60">{filter.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            viewMode === "grid" ? (
                                <CardGridSkeleton />
                            ) : (
                                <CaseTable
                                    cases={[]}
                                    loading={true}
                                    searchQuery=""
                                    onSearchChange={() => {}}
                                    columns={COLUMNS}
                                    renderRow={() => null}
                                />
                            )
                        ) : filteredCases.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-gray-100 text-center py-20 px-6"
                            >
                                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <Search className="w-7 h-7 text-gray-300" />
                                </div>
                                <p className="text-lg font-bold text-gray-800 mb-1.5">
                                    {searchQuery || statusFilter !== "ALL"
                                        ? "No matching cases"
                                        : "No active cases yet"}
                                </p>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                    {searchQuery || statusFilter !== "ALL"
                                        ? "Try adjusting your search or filter."
                                        : "Create your first emergency case to get started."}
                                </p>
                            </motion.div>
                        ) : viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                            >
                                {filteredCases.map((caseItem) => (
                                    <CaseCard key={caseItem.caseId} caseItem={caseItem} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <CaseTable
                                    cases={filteredCases}
                                    loading={false}
                                    searchQuery=""
                                    onSearchChange={() => {}}
                                    columns={COLUMNS}
                                    renderRow={(caseItem, { copy, isCopied }) => (
                                        <>
                                            <CaseIdCell caseId={caseItem.caseId} />
                                            <PatientNameCell name={caseItem.patientName} />
                                            <StatusCell status={caseItem.status} percentage={caseItem.percentage} />
                                            <ProgressCell percentage={caseItem.percentage} />
                                            <FinancialsCell raised={caseItem.raisedAmount} target={caseItem.targetAmount} />
                                            <VirtualAccountCell
                                                accountNumber={caseItem.virtualAccountNumber}
                                                caseId={caseItem.caseId}
                                                copy={copy}
                                                isCopied={isCopied}
                                            />
                                            <ViewCaseCell caseId={caseItem.caseId} />
                                        </>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {showNewEmergencyModal && (
                <NewEmergencyModal
                    onClose={() => setShowNewEmergencyModal(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    );
}
