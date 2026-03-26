import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
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
import type { CaseSummary } from "../types/api";

const COLUMNS = [
    { key: "caseId", label: "Case Profile" },
    { key: "patient", label: "Patient" },
    { key: "status", label: "Status" },
    { key: "progress", label: "Funding Progress" },
    { key: "financials", label: "Financials" },
    { key: "account", label: "Disbursement" },
    { key: "actions", label: "Actions", align: "right" as const },
];

export default function ActiveCases() {
    const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cases, setCases] = useState<CaseSummary[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <header className="flex items-center justify-between mb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl font-heading font-extrabold text-[#1E293B] tracking-tight">
                                Active Cases
                            </h1>
                            <p className="text-[#64748B] mt-1 text-lg font-medium">
                                Manage and monitor all emergency cases in
                                real-time
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNewEmergencyModal(true)}
                            className="bg-[#0F172A] hover:bg-[#334155] text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)]"
                        >
                            <Plus className="w-5 h-5 stroke-[3px]" />
                            New Emergency
                        </motion.button>
                    </header>

                    <CaseTable
                        cases={cases}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        searchPlaceholder="Search by patient name or case ID..."
                        emptyIcon={
                            <Search className="w-10 h-10 text-gray-200" />
                        }
                        emptyTitle="No active cases found"
                        columns={COLUMNS}
                        renderRow={(caseItem, { copy, isCopied }) => (
                            <>
                                <CaseIdCell caseId={caseItem.caseId} />
                                <PatientNameCell
                                    name={caseItem.patientName}
                                />
                                <StatusCell
                                    status={caseItem.status}
                                    percentage={caseItem.percentage}
                                />
                                <ProgressCell
                                    percentage={caseItem.percentage}
                                />
                                <FinancialsCell
                                    raised={caseItem.raisedAmount}
                                    target={caseItem.targetAmount}
                                />
                                <VirtualAccountCell
                                    accountNumber={
                                        caseItem.virtualAccountNumber
                                    }
                                    caseId={caseItem.caseId}
                                    copy={copy}
                                    isCopied={isCopied}
                                />
                                <ViewCaseCell caseId={caseItem.caseId} />
                            </>
                        )}
                    />
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
