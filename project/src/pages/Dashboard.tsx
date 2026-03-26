import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Activity, TrendingUp, Users, Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NewEmergencyModal from "../components/NewEmergencyModal";
import { useAuth } from "../contexts/AuthContext";
import { hospitalAPI } from "../lib/api-service";
import { DashboardData } from "../types/api";

export default function Dashboard() {
    const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
    const { hospitalData } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await hospitalAPI.getDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchDashboardData();
    }, []);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `₦${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `₦${(value / 1000).toFixed(1)}K`;
        }
        return `₦${value}`;
    };

    const stats = [
        {
            label: "Active Cases",
            value: dashboardData?.activeCases?.toString() || "0",
            icon: Activity,
            color: "text-primary-500",
            bg: "bg-primary-500/10",
        },
        {
            label: "Bridged Funded",
            value: dashboardData?.bridgedFunded
                ? formatCurrency(dashboardData.bridgedFunded)
                : "₦0",
            icon: TrendingUp,
            color: "text-secondary-500",
            bg: "bg-secondary-500/10",
        },
        {
            label: "Lives Saved",
            value: dashboardData?.livesSaved?.toString() || "0",
            icon: Users,
            color: "text-success-500",
            bg: "bg-success-500/10",
        },
        {
            label: "Avg Response",
            value: dashboardData ? "< 24h" : "--",
            icon: Clock,
            color: "text-emergency-500",
            bg: "bg-emergency-500/10",
        },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-10 max-w-7xl mx-auto">
                    <header className="flex items-center justify-between mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-heading font-black text-[#0F172A] tracking-tight">
                                Welcome back,{" "}
                                {hospitalData?.adminName?.split(" ")[0] ||
                                    "Admin"}{" "}
                                👋
                            </h1>
                            <p className="text-[#64748B] mt-2 text-lg font-medium">
                                Hospital Command Center •{" "}
                                {new Date().toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNewEmergencyModal(true)}
                            className="bg-primary-500 hover:bg-primary-600 text-white font-extrabold px-10 py-5 rounded-[24px] flex items-center gap-3 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <Plus className="w-5 h-5 stroke-[4px] relative z-10" />
                            <span className="relative z-10 uppercase tracking-widest text-sm font-black">
                                Initiate Case
                            </span>
                        </motion.button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        y: -8,
                                        shadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
                                    }}
                                    className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative group cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                                        <Icon className="w-full h-full" />
                                    </div>

                                    <div className="flex items-start justify-between mb-8">
                                        <div
                                            className={`${stat.bg} p-4 rounded-2xl`}
                                        >
                                            <Icon
                                                className={`w-8 h-8 ${stat.color} stroke-[2.5px]`}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-4xl font-heading font-black text-[#0F172A] tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-[13px] font-bold text-[#64748B] mt-1.5 uppercase tracking-[0.15em] opacity-70 leading-none">
                                            {stat.label}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />

                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-heading font-black text-[#0F172A] uppercase tracking-wider">
                                    Recent Activity
                                </h2>
                                <button className="text-xs font-black text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-[0.2em] border-b-2 border-primary-500/10 pb-1">
                                    View All
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-slate-50 p-10 rounded-[40px] mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Activity className="w-20 h-20 text-slate-200 animate-pulse" />
                                </div>
                                <p className="text-2xl font-black text-[#0F172A] mb-3">
                                    No activity recorded yet
                                </p>
                                <p className="text-[#64748B] font-medium max-w-sm mx-auto leading-relaxed">
                                    Once you start creating emergency cases,
                                    your team's activity will appear here in
                                    real-time.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0F172A] rounded-[40px] shadow-2xl p-10 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700" />

                            <div className="relative z-10">
                                <h3 className="text-white text-xl font-heading font-black uppercase tracking-[0.2em] mb-8">
                                    Bridge Eligibility
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-success-500 shadow-[0_0_12px_#10b981]" />
                                        <span className="text-slate-300 font-bold text-sm">
                                            System Latency: 4ms
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_12px_#0ea5e9]" />
                                        <span className="text-slate-300 font-bold text-sm">
                                            Secure Connection Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 pt-12">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-4">
                                    Quick Action
                                </p>
                                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-5 rounded-[24px] transition-all border border-white/10 uppercase tracking-[0.2em] text-xs">
                                    Run Diagnostic
                                </button>
                            </div>
                        </div>
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
