import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Plus,
    Activity,
    TrendingUp,
    Users,
    Clock,
    ArrowRight,
    FolderOpen,
    History,
    MessageCircle,
    Heart,
    Zap,
    FileText,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import NewEmergencyModal from "../components/NewEmergencyModal";
import { useAuth } from "../contexts/AuthContext";
import { hospitalAPI, caseAPI } from "../lib/api-service";
import { DashboardData, CaseSummary } from "../types/api";

export default function Dashboard() {
    const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
    const { hospitalData } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [recentCases, setRecentCases] = useState<CaseSummary[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboard, active] = await Promise.all([
                    hospitalAPI.getDashboardData(),
                    caseAPI.getActive().catch(() => []),
                ]);
                setDashboardData(dashboard);
                setRecentCases(active.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `₦${(value / 1000).toFixed(1)}K`;
        return `₦${value.toLocaleString()}`;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const stats = [
        {
            label: "Active Cases",
            value: dashboardData?.activeCases?.toString() || "0",
            icon: Activity,
            color: "text-primary-600",
            bg: "bg-primary-50",
            border: "border-primary-100",
        },
        {
            label: "Bridge Funded",
            value: dashboardData?.bridgedFunded
                ? formatCurrency(dashboardData.bridgedFunded)
                : "₦0",
            icon: TrendingUp,
            color: "text-secondary-600",
            bg: "bg-secondary-50",
            border: "border-secondary-100",
        },
        {
            label: "Lives Saved",
            value: dashboardData?.livesSaved?.toString() || "0",
            icon: Users,
            color: "text-success-600",
            bg: "bg-success-50",
            border: "border-success-100",
        },
        {
            label: "Avg Response",
            value: dashboardData ? "< 24h" : "--",
            icon: Clock,
            color: "text-warning-600",
            bg: "bg-warning-50",
            border: "border-warning-100",
        },
    ];

    const quickActions = [
        {
            label: "New Emergency Case",
            description: "Create a funding case for a patient",
            icon: Plus,
            color: "bg-primary-500 text-white",
            onClick: () => setShowNewEmergencyModal(true),
        },
        {
            label: "View Active Cases",
            description: "Monitor ongoing cases",
            icon: FolderOpen,
            color: "bg-gray-100 text-gray-700",
            to: "/dashboard/cases",
        },
        {
            label: "Case History",
            description: "Review completed cases",
            icon: History,
            color: "bg-gray-100 text-gray-700",
            to: "/dashboard/history",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-gray-100 text-gray-600";
            case "PARTIALLY_FUNDED":
                return "bg-warning-50 text-warning-700";
            case "BRIDGE_ELIGIBLE":
                return "bg-primary-50 text-primary-700";
            case "FULLY_FUNDED":
                return "bg-success-50 text-success-700";
            case "CLOSED":
                return "bg-secondary-50 text-secondary-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const formatStatus = (status: string) => {
        return status.replace(/_/g, " ");
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-28 md:pb-10">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-heading font-black text-[#0F172A] tracking-tight">
                                {getGreeting()},{" "}
                                {hospitalData?.adminName?.split(" ")[0] || "Admin"}
                            </h1>
                            <p className="text-gray-500 mt-1.5 text-base font-medium">
                                {hospitalData?.hospitalName || "Hospital"} &middot;{" "}
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
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
                            <span className="text-sm">Initiate Case</span>
                        </motion.button>
                    </header>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className={`bg-white rounded-2xl p-5 md:p-6 border ${stat.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
                                >
                                    <div className={`${stat.bg} p-2.5 rounded-xl w-fit mb-4`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <p className="text-2xl md:text-3xl font-heading font-black text-[#0F172A] tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mb-10"
                    >
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {quickActions.map((action, index) =>
                                action.to ? (
                                    <Link
                                        key={index}
                                        to={action.to}
                                        className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group"
                                    >
                                        <div className={`${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900">{action.label}</p>
                                            <p className="text-xs text-gray-400">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ) : (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group text-left"
                                    >
                                        <div className={`${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900">{action.label}</p>
                                            <p className="text-xs text-gray-400">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                )
                            )}
                        </div>
                    </motion.div>

                    {/* Two Column: Recent Cases + Bridge Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Cases */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary-50 p-2 rounded-lg">
                                        <FileText className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <h2 className="text-lg font-heading font-bold text-gray-900">
                                        Recent Cases
                                    </h2>
                                </div>
                                <Link
                                    to="/dashboard/cases"
                                    className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                                >
                                    View all
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {recentCases.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {recentCases.map((c, index) => (
                                        <motion.div
                                            key={c.caseId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.05 }}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center flex-shrink-0">
                                                    <Heart className="w-4 h-4 text-primary-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {c.patientName}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Case #{c.caseId}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Progress */}
                                                <div className="hidden sm:flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                c.percentage >= 100
                                                                    ? "bg-success-500"
                                                                    : c.percentage >= 60
                                                                    ? "bg-primary-500"
                                                                    : "bg-warning-500"
                                                            }`}
                                                            style={{ width: `${Math.min(c.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500 w-10 text-right">
                                                        {c.percentage}%
                                                    </span>
                                                </div>

                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusColor(c.status)}`}>
                                                    {formatStatus(c.status)}
                                                </span>

                                                <Link
                                                    to={`/case/${c.caseId}`}
                                                    className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                    <div className="bg-gray-50 p-5 rounded-2xl mb-5">
                                        <Activity className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-bold text-gray-800 mb-1.5">
                                        No cases yet
                                    </p>
                                    <p className="text-sm text-gray-400 max-w-xs">
                                        Create your first emergency case to start
                                        receiving funds for patients.
                                    </p>
                                    <button
                                        onClick={() => setShowNewEmergencyModal(true)}
                                        className="mt-5 text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1.5 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create first case
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Bridge Info + Platform Tips */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Bridge Info Card */}
                            <div className="bg-[#0F172A] rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                                <div className="relative z-10">
                                    <div className="bg-primary-500/20 p-2.5 rounded-xl w-fit mb-4">
                                        <Zap className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <h3 className="text-lg font-heading font-bold text-white mb-2">
                                        Bridge Loans
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                                        When a case reaches 60% of the target, the patient's
                                        next of kin can apply for an instant bridge loan to cover
                                        the remaining gap.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                            <span className="text-xs text-gray-400">Threshold</span>
                                            <span className="text-sm font-bold text-primary-400">60%</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                            <span className="text-xs text-gray-400">Max Coverage</span>
                                            <span className="text-sm font-bold text-primary-400">40% of target</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                            <span className="text-xs text-gray-400">Interest Rate</span>
                                            <span className="text-sm font-bold text-primary-400">11.5%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Assistant Tip */}
                            <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-6 border border-secondary-100">
                                <div className="bg-white p-2.5 rounded-xl w-fit mb-4 shadow-sm">
                                    <MessageCircle className="w-5 h-5 text-secondary-600" />
                                </div>
                                <h3 className="text-base font-heading font-bold text-gray-900 mb-1.5">
                                    AI Assistant
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    Need help? Use the chat widget in the bottom-right corner.
                                    It supports Yoruba, Hausa, Igbo, Pidgin and English.
                                </p>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-secondary-600">
                                    <span>Available 24/7</span>
                                    <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {showNewEmergencyModal && (
                <NewEmergencyModal
                    onClose={() => setShowNewEmergencyModal(false)}
                />
            )}
        </div>
    );
}
