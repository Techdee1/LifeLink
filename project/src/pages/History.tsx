import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
    { key: "caseId", label: "Case ID" },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date Created" },
    { key: "amount", label: "Final Amount" },
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

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <header className="mb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl font-heading font-extrabold text-[#1E293B] tracking-tight">
                                Case History
                            </h1>
                            <p className="text-[#64748B] mt-1 text-lg font-medium">
                                View all past emergency cases and their outcomes
                            </p>
                        </motion.div>
                    </header>

                    <CaseTable
                        cases={cases}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search history by patient name or case ID..."
                        emptyIcon={
                            <HistoryIcon className="w-10 h-10 text-gray-200" />
                        }
                        emptyTitle="No History Yet"
                        emptyDescription="Completed cases will appear here"
                        columns={COLUMNS}
                        renderRow={(caseItem) => (
                            <>
                                <CaseIdCell caseId={caseItem.caseId} />
                                <PatientNameCell
                                    name={caseItem.patientName}
                                />
                                <StatusCell status={caseItem.status} />
                                <DateCell date={caseItem.createdAt} />
                                <FinancialsCell
                                    raised={caseItem.raisedAmount}
                                    target={caseItem.targetAmount}
                                />
                                <ViewCaseCell
                                    caseId={caseItem.caseId}
                                    label="Details"
                                />
                            </>
                        )}
                    />

                    {/* Pagination */}
                    {!loading && cases.length > 0 && (
                        <div className="flex items-center justify-between mt-6 px-2">
                            <p className="text-sm text-gray-500 font-medium">
                                Page {page + 1}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 0}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!hasMore}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
