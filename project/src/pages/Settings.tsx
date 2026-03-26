import { motion } from "framer-motion";
import { Building2, User, Mail, Phone, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const { hospitalData, hospitalEmail, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const profileFields = [
        {
            label: "Hospital Name",
            value: hospitalData?.hospitalName,
            icon: Building2,
        },
        {
            label: "Admin Name",
            value: hospitalData?.adminName,
            icon: User,
        },
        {
            label: "Email Address",
            value: hospitalEmail,
            icon: Mail,
        },
        {
            label: "Phone Number",
            value: hospitalData?.adminPhone,
            icon: Phone,
        },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                        Settings
                    </h1>

                    <div className="space-y-6 max-w-2xl">
                        {/* Hospital Profile */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Hospital Profile
                            </h2>
                            <div className="space-y-4">
                                {profileFields.map((field) => {
                                    const Icon = field.icon;
                                    return (
                                        <div
                                            key={field.label}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                        >
                                            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                                                <Icon className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                                                    {field.label}
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {field.value || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Account
                            </h2>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-5 py-3 rounded-xl text-emergency-600 font-bold hover:bg-emergency-50 transition-all duration-200 border border-emergency-200"
                            >
                                <LogOut className="w-5 h-5" strokeWidth={2.5} />
                                <span>Logout Session</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
