import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Heart,
    LayoutDashboard,
    FolderOpen,
    History,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
    const location = useLocation();
    const { hospitalData, logout } = useAuth();

    const navItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/dashboard/cases", icon: FolderOpen, label: "Active Cases" },
        { path: "/dashboard/history", icon: History, label: "History" },
        { path: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <aside className="w-72 bg-white border-r border-gray-100 h-screen flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
            <div className="p-8 border-b border-gray-50">
                <div className="flex items-center gap-3.5 mb-8">
                    <div className="bg-primary-600 p-2.5 rounded-[14px] shadow-lg shadow-primary-200">
                        <Heart
                            className="w-6 h-6 text-white"
                            fill="white"
                            strokeWidth={2.5}
                        />
                    </div>
                    <h1 className="text-2xl font-heading font-extrabold text-[#0F172A] tracking-tight">
                        LifeLink
                    </h1>
                </div>
                {hospitalData && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                        <p className="text-sm font-bold text-[#1E293B] truncate mb-0.5">
                            {hospitalData.hospitalName}
                        </p>
                        <p className="text-xs font-semibold text-[#64748B] truncate opacity-80 uppercase tracking-wider">
                            {hospitalData.adminName}
                        </p>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                isActive
                                    ? "bg-[#0F172A] text-white shadow-xl shadow-slate-200 translate-x-1"
                                    : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                                    isActive ? "text-primary-400" : ""
                                }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="font-bold tracking-tight">
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_8px_#f43f5e]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gray-50">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-emergency-600 font-bold hover:bg-emergency-50 transition-all duration-300 w-full group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-emergency-100 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <LogOut
                        className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                        strokeWidth={2.5}
                    />
                    <span className="relative z-10 uppercase tracking-widest text-xs">
                        Logout Session
                    </span>
                </button>
            </div>
        </aside>
    );
}
