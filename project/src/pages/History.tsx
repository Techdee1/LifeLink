import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    History as HistoryIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    TrendingUp,
    Clock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CaseTable, {
    CaseIdCell,
    PatientNameCell,
    StatusCell,
    DateCell,
    FinancialsCell,
    ViewCaseCell,
} from "../components/CaseTable";
import { caseAPI } from "../lib/api-service";
import type { CaseSummary } from "../types/api";

const PAGE_SIZE = 10;

const COLUMNS = [
    { key: "caseId", label: "Case" },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "actions", label: "Actions" },
];

export default function History() {
    const [cases, setCases] = useState<CaseSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchHistory = useCallback(async (pageNo: number) => {
        setLoading(true);
        try {
            const data = await caseAPI.getHistory(pageNo, PAGE_SIZE);
            const results = data || [];
            setCases(results);
            setHasMore(results.length === PAGE_SIZE);
        } catch (error) {
            console.error("Failed to fetch history:", error);
            setCases([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(page);
    }, [page, fetchHistory]);

    const totalRaised = cases.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const fullyFunded = cases.filter(
        (c) => c.status === "FULLY_FUNDED" || c.status === "CLOSED"
    ).length;

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 max-w-7xl mx-auto pb-28 md:pb-8">
                    {/* Header */}
                    <header className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl font-heading font-black text-[#0F172A] tracking-tight">
                                Case History
                            </h1>
                            <p className="text-gray-500 mt-1 text-base font-medium">
                                Review past emergency cases and their outcomes
                            </p>
                        </motion.div>
                    </header>

                    {/* Summary Stats Banner */}
                    {!loading && cases.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-3 gap-4 mb-8"
                        >
                            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                                <div className="bg-primary-50 p-2.5 rounded-xl">
                                    <HistoryIcon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-heading font-black text-gray-900">
                                        {cases.length}
                                    </p>
                                    <p className="text-xs text-gray-400">Cases This Page</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                                <div className="bg-success-50 p-2.5 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-success-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-heading font-black text-gray-900">
                                        {fullyFunded}
                                    </p>
                                    <p className="text-xs text-gray-400">Fully Funded</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                                <div className="bg-warning-50 p-2.5 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-warning-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-heading font-black text-gray-900">
                                        ₦{totalRaised.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">Total Raised</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Table */}
                    <CaseTable
                        cases={cases}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search history by patient name or case ID..."
                        emptyIcon={
                            <Clock className="w-8 h-8 text-gray-300" />
                        }
                        emptyTitle="No History Yet"
                        emptyDescription="Completed cases will appear here once you start funding patients."
                        columns={COLUMNS}
                        renderRow={(caseItem) => (
                            <>
                                <CaseIdCell caseId={caseItem.caseId} />
                                <PatientNameCell name={caseItem.patientName} />
                                <StatusCell status={caseItem.status} />
                                <DateCell date={caseItem.createdAt} />
                                <FinancialsCell
                                    raised={caseItem.raisedAmount}
                                    target={caseItem.targetAmount}
                                />
                                <ViewCaseCell caseId={caseItem.caseId} label="Details" />
                            </>
                        )}
                    />

                    {/* Pagination */}
                    {!loading && cases.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between mt-6"
                        >
                            <p className="text-sm text-gray-400 font-medium">
                                Page {page + 1}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 0}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!hasMore}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
