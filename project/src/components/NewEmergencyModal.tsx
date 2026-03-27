import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    AlertCircle,
    Loader2,
    CheckCircle2,
    Copy,
    ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { caseAPI } from "../lib/api-service";
import type { CaseInitiateResponse } from "../types/api";

interface NewEmergencyModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function NewEmergencyModal({
    onClose,
    onSuccess,
}: NewEmergencyModalProps) {
    const { hospitalId } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [caseResponse, setCaseResponse] = useState<CaseInitiateResponse | null>(null);

    const [formData, setFormData] = useState({
        patientName: "",
        leadKinName: "",
        patientEmail: "",
        leadKinPhone: "",
        depositTarget: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateStep1 = (): string | null => {
        if (!formData.patientName.trim()) return "Patient name is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.patientEmail))
            return "Please enter a valid email address.";
        const amount = Number(formData.depositTarget);
        if (!amount || amount < 1000)
            return "Deposit target must be at least ₦1,000.";
        if (amount > 100_000_000)
            return "Deposit target cannot exceed ₦100,000,000.";
        return null;
    };

    const validateStep2 = (): string | null => {
        if (!formData.leadKinName.trim())
            return "Next of kin name is required.";
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.leadKinPhone))
            return "Phone must be 10-15 digits (e.g. 2348012345678).";
        return null;
    };

    const handleStep1Continue = () => {
        const err = validateStep1();
        if (err) {
            setError(err);
            return;
        }
        setError("");
        setStep(2);
    };

    const handleSubmit = async () => {
        const err = validateStep2();
        if (err) {
            setError(err);
            return;
        }
        setError("");
        setLoading(true);

        try {
            if (!hospitalId) {
                throw new Error("Hospital ID not found. Please log in again.");
            }

            const response = await caseAPI.initiate({
                hId: hospitalId,
                patientName: formData.patientName,
                leadKinName: formData.leadKinName,
                patientEmail: formData.patientEmail,
                leadKinPhone: formData.leadKinPhone,
                depositTarget: Number(formData.depositTarget),
                patientCase: "OPEN",
            });

            setCaseResponse(response);
            setStep(3);
        } catch (err: unknown) {
            console.error("Case creation failed:", err);
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to create case. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const caseUrl = caseResponse
        ? `${window.location.origin}/case/${caseResponse.caseId}`
        : "";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-2xl font-heading font-bold text-gray-900">
                            {step === 3
                                ? "Case Created Successfully"
                                : "Create New Emergency Case"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        {step !== 3 && (
                            <div className="flex items-center justify-center mb-8">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            step >= 1
                                                ? "bg-primary-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        1
                                    </div>
                                    <div className="w-16 h-1 bg-gray-200">
                                        <div
                                            className={`h-full transition-all ${
                                                step >= 2
                                                    ? "bg-primary-500"
                                                    : "bg-gray-200"
                                            }`}
                                            style={{
                                                width:
                                                    step >= 2 ? "100%" : "0%",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            step >= 2
                                                ? "bg-primary-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        2
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 bg-emergency-50 border border-emergency-200 rounded-lg p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-emergency-700">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="patientEmail"
                                        value={formData.patientEmail}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="patient@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deposit Target Amount (₦) *
                                    </label>
                                    <input
                                        type="number"
                                        name="depositTarget"
                                        value={formData.depositTarget}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="300000"
                                        min="1000"
                                        required
                                    />
                                </div>

                                <button
                                    onClick={handleStep1Continue}
                                    disabled={
                                        !formData.patientName ||
                                        !formData.patientEmail ||
                                        !formData.depositTarget
                                    }
                                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                                >
                                    Continue to Next of Kin Details
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lead Next of Kin Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="leadKinName"
                                        value={formData.leadKinName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lead Next of Kin Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="leadKinPhone"
                                        value={formData.leadKinPhone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="234810576812"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={
                                            loading ||
                                            !formData.leadKinName ||
                                            !formData.leadKinPhone
                                        }
                                        className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating Case...
                                            </>
                                        ) : (
                                            "Create Case"
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && caseResponse && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-center mb-6">
                                    <div className="bg-success-500 p-4 rounded-full">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                                        Emergency Case Created
                                    </h3>
                                    <p className="text-gray-600">
                                        Virtual account generated successfully
                                    </p>
                                </div>

                                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Case ID
                                        </p>
                                        <p className="text-xl font-heading font-bold text-gray-900">
                                            #{caseResponse.caseId}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Account Number
                                        </p>
                                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                                            <p className="text-xl font-heading font-bold text-gray-900">
                                                {
                                                    caseResponse.virtualAccountNumber
                                                }
                                            </p>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        caseResponse.virtualAccountNumber
                                                    )
                                                }
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Bank Name
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {caseResponse.bankName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Account Name
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {caseResponse.accountName}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                                    <p className="text-sm text-warning-800">
                                        <strong>Important:</strong> Share the
                                        case link with family members to start
                                        receiving donations
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                                    <input
                                        type="text"
                                        value={caseUrl}
                                        readOnly
                                        className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(caseUrl)}
                                        className="text-primary-600 hover:text-primary-700"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                    <a
                                        href={caseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-700"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>

                                <button
                                    onClick={() => {
                                        onSuccess?.();
                                        onClose();
                                    }}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                                >
                                    Done
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
