import { useState } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    User,
    Mail,
    Phone,
    LogOut,
    Shield,
    Heart,
    Zap,
    Globe,
    Copy,
    Check,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Tab = "profile" | "platform" | "account";

export default function Settings() {
    const { hospitalData, hospitalEmail, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [copied, setCopied] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs: { key: Tab; label: string }[] = [
        { key: "profile", label: "Profile" },
        { key: "platform", label: "Platform Info" },
        { key: "account", label: "Account" },
    ];

    const profileFields = [
        { label: "Hospital Name", value: hospitalData?.hospitalName, icon: Building2 },
        { label: "Admin Name", value: hospitalData?.adminName, icon: User },
        { label: "Email Address", value: hospitalEmail, icon: Mail },
        { label: "Phone Number", value: hospitalData?.adminPhone, icon: Phone },
    ];

    const hospitalId = hospitalData?.hospitalId || hospitalData?.id;
    const caseLinkBase = `${window.location.origin}/case/`;

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 pb-28 md:pb-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-heading font-black text-[#0F172A] tracking-tight mb-1">
                            Settings
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Manage your hospital profile and account
                        </p>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${
                                        activeTab === tab.key
                                            ? "bg-[#0F172A] text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Hospital Profile Card */}
                                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    {hospitalData?.hospitalName
                                                        ?.split(" ")
                                                        .map((w) => w[0])
                                                        .join("")
                                                        .slice(0, 2)
                                                        .toUpperCase() || "H"}
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-heading font-bold text-gray-900">
                                                    {hospitalData?.hospitalName || "Hospital"}
                                                </h2>
                                                <p className="text-sm text-gray-400">
                                                    Hospital ID: {hospitalId || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {profileFields.map((field) => {
                                            const Icon = field.icon;
                                            return (
                                                <div
                                                    key={field.label}
                                                    className="flex items-center gap-4 px-6 py-4"
                                                >
                                                    <div className="bg-gray-50 p-2 rounded-lg">
                                                        <Icon className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-400 mb-0.5">
                                                            {field.label}
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {field.value || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Case Link */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                                        Case Link Format
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-4">
                                        Share this link format with patients' families to receive donations
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                            <code className="text-sm text-gray-600">
                                                {caseLinkBase}<span className="text-primary-500">[caseId]</span>
                                            </code>
                                        </div>
                                        <button
                                            onClick={() => copyText(caseLinkBase)}
                                            className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-success-500" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Platform Info Tab */}
                        {activeTab === "platform" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-5">
                                        Platform Features
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: Heart,
                                                title: "Emergency Case Funding",
                                                description: "Create cases with virtual accounts for instant patient funding",
                                                color: "bg-emergency-50 text-emergency-600",
                                            },
                                            {
                                                icon: Zap,
                                                title: "Bridge Loans",
                                                description: "Auto-unlock at 60% — up to 40% coverage at 11.5% interest, 14-day deadline",
                                                color: "bg-primary-50 text-primary-600",
                                            },
                                            {
                                                icon: Globe,
                                                title: "Multilingual AI Assistant",
                                                description: "Chat support in English, Yoruba, Hausa, Igbo, and Pidgin",
                                                color: "bg-secondary-50 text-secondary-600",
                                            },
                                            {
                                                icon: Shield,
                                                title: "HEFAMA Verification",
                                                description: "All hospitals are verified for fund security and compliance",
                                                color: "bg-success-50 text-success-600",
                                            },
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className={`${feature.color.split(" ")[0]} p-2.5 rounded-xl flex-shrink-0`}>
                                                    <feature.icon className={`w-5 h-5 ${feature.color.split(" ")[1]}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 mb-0.5">
                                                        {feature.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-3">
                                        Bridge Loan Terms
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: "Threshold", value: "60%" },
                                            { label: "Max Coverage", value: "40%" },
                                            { label: "Interest Rate", value: "11.5%" },
                                        ].map((item, i) => (
                                            <div key={i} className="text-center bg-gray-50 rounded-xl p-4">
                                                <p className="text-xl font-heading font-black text-primary-600">
                                                    {item.value}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Account Tab */}
                        {activeTab === "account" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-heading font-bold text-gray-900 mb-2">
                                        Session
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-5">
                                        You are currently signed in as{" "}
                                        <span className="font-semibold text-gray-700">
                                            {hospitalEmail || "admin"}
                                        </span>
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-emergency-600 font-semibold hover:bg-emergency-50 transition-all border border-emergency-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout Session
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                                    <p className="text-sm text-gray-400">
                                        Need help? Use the chat widget or contact{" "}
                                        <span className="font-medium text-gray-600">support@lifelink.ng</span>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
