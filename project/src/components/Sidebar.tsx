import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    LayoutDashboard,
    FolderOpen,
    History,
    Settings,
    LogOut,
    ChevronsLeft,
    ChevronsRight,
    ChevronDown,
    User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
    const location = useLocation();
    const { hospitalData, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/dashboard/cases", icon: FolderOpen, label: "Active Cases" },
        { path: "/dashboard/history", icon: History, label: "History" },
        { path: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];

    const initials = hospitalData?.hospitalName
        ? hospitalData.hospitalName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "H";

    return (
        <aside
            className={`${
                collapsed ? "w-20" : "w-72"
            } bg-white border-r border-gray-100 h-screen flex flex-col transition-all duration-300 z-20 relative hidden md:flex`}
        >
            {/* Header */}
            <div className={`p-4 ${collapsed ? "px-3" : "px-6"} pt-6 border-b border-gray-50`}>
                <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} mb-6`}>
                    <Link to="/dashboard" className="flex items-center gap-2.5">
                        <div className="bg-primary-500 p-2 rounded-xl shadow-md shadow-primary-200 flex-shrink-0">
                            <Heart className="w-5 h-5 text-white" fill="white" />
                        </div>
                        {!collapsed && (
                            <span className="text-xl font-heading font-bold text-[#0F172A]">
                                LifeLink
                            </span>
                        )}
                    </Link>
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Hospital Info */}
                {hospitalData && (
                    <div
                        className={`${
                            collapsed
                                ? "flex justify-center"
                                : "flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                        }`}
                    >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{initials}</span>
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {hospitalData.hospitalName}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {hospitalData.adminName}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <div className="px-3 pt-4">
                    <button
                        onClick={() => setCollapsed(false)}
                        className="w-full p-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex justify-center"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className={`flex-1 ${collapsed ? "px-3" : "px-4"} py-4 space-y-1`}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : undefined}
                            className={`flex items-center gap-3 ${
                                collapsed ? "justify-center px-0 py-3" : "px-4 py-3"
                            } rounded-xl transition-all duration-200 group relative ${
                                isActive
                                    ? "bg-[#0F172A] text-white shadow-lg shadow-gray-200"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            {/* Active indicator line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-400 rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <Icon
                                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                                    isActive ? "text-primary-400" : ""
                                }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            {!collapsed && (
                                <span className="text-sm font-semibold">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Profile Dropdown */}
            <div className={`${collapsed ? "px-3" : "px-4"} pb-4 border-t border-gray-50 pt-4`}>
                {collapsed ? (
                    <button
                        onClick={logout}
                        title="Logout"
                        className="w-full flex justify-center p-3 rounded-xl text-emergency-500 hover:bg-emergency-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {hospitalData?.adminName || "Admin"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">Hospital Admin</p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                    profileOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden"
                                >
                                    <div className="p-3 border-b border-gray-50">
                                        <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {hospitalData?.hospitalName || "Hospital"}
                                        </p>
                                    </div>
                                    <Link
                                        to="/dashboard/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-emergency-600 hover:bg-emergency-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </aside>
    );
}
