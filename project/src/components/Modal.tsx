import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({
    children,
    onClose,
    title,
    subtitle,
    icon,
    maxWidth = "max-w-2xl",
}: ModalProps) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full my-8 max-h-[90vh] overflow-y-auto`}
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <div className="flex items-center gap-3">
                            {icon}
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-gray-900">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-sm text-gray-600">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6">{children}</div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
