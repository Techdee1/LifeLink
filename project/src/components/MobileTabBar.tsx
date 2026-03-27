import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, History, Settings } from "lucide-react";

const tabs = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { path: "/dashboard/cases", icon: FolderOpen, label: "Cases" },
    { path: "/dashboard/history", icon: History, label: "History" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function MobileTabBar() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                                isActive
                                    ? "text-primary-600"
                                    : "text-gray-400"
                            }`}
                        >
                            <div
                                className={`p-1.5 rounded-lg transition-all ${
                                    isActive ? "bg-primary-50" : ""
                                }`}
                            >
                                <Icon
                                    className="w-5 h-5"
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className="text-[10px] font-semibold">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
