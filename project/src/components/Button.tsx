import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "destructive" | "dark";

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    animated?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary:
        "bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white",
    secondary:
        "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700",
    destructive:
        "bg-emergency-500 hover:bg-emergency-600 disabled:bg-gray-400 text-white",
    dark: "bg-[#0F172A] hover:bg-[#334155] disabled:bg-gray-400 text-white shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)]",
};

export default function Button({
    children,
    variant = "primary",
    loading = false,
    loadingText,
    disabled = false,
    onClick,
    type = "button",
    className = "",
    icon,
    fullWidth = false,
    animated = false,
}: ButtonProps) {
    const base = `font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
        fullWidth ? "w-full" : ""
    } ${VARIANT_STYLES[variant]} ${className}`;

    const content = loading ? (
        <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {loadingText || children}
        </>
    ) : (
        <>
            {icon}
            {children}
        </>
    );

    if (animated) {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type={type}
                disabled={disabled || loading}
                onClick={onClick}
                className={base}
            >
                {content}
            </motion.button>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={base}
        >
            {content}
        </button>
    );
}
