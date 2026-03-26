import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Loader2, CheckCircle, Shield } from "lucide-react";
import { caseAPI } from "../lib/api-service";
import type { BridgeApplicationResponse } from "../types/api";

interface BridgeApplicationModalProps {
    caseId: number;
    accountNumber: string;
    bankName?: string;
    bankCode?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BridgeApplicationModal({
    caseId,
    accountNumber,
    bankName = "WEMA BANK",
    bankCode = "035",
    onClose,
    onSuccess,
}: BridgeApplicationModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [bridgeResponse, setBridgeResponse] = useState<BridgeApplicationResponse | null>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        leadKinBvn: "",
        leadKinNin: "",
        agreedToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.agreedToTerms) {
            setError("You must agree to the guarantee agreement to proceed");
            return;
        }

        if (
            formData.leadKinBvn.length !== 11 ||
            !/^\d+$/.test(formData.leadKinBvn)
        ) {
            setError("BVN must be exactly 11 digits");
            return;
        }

        if (
            formData.leadKinNin.length !== 11 ||
            !/^\d+$/.test(formData.leadKinNin)
        ) {
            setError("NIN must be exactly 11 digits");
            return;
        }

        setLoading(true);

        try {
            const response = await caseAPI.applyForBridge(caseId, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                leadKinBvn: formData.leadKinBvn,
                leadKinNin: formData.leadKinNin,
                accountNumber: accountNumber,
                bankName,
                bankCode,
                agreedToTerms: formData.agreedToTerms,
            });

            setBridgeResponse(response);
            setSuccess(true);

            // Don't auto-close immediately, let them see the success message
            // and amount. They can click "Return to Case" or it can close after 5s
            setTimeout(() => {
                onSuccess();
            }, 5000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(
                error.response?.data?.message ||
                    "Failed to process bridge application. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (success && bridgeResponse) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-success-500 p-4 rounded-full">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        Bridge Loan Approved!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your bridge credit has been successfully disbursed
                    </p>

                    <div className="bg-success-50 border border-success-200 rounded-xl p-6 mb-6">
                        <p className="text-sm text-gray-600 mb-2">
                            Disbursed Amount
                        </p>
                        <p className="text-4xl font-heading font-bold text-success-600">
                            ₦
                            {(
                                bridgeResponse.bridged_amount ||
                                bridgeResponse.bridgedAmount ||
                                0
                            ).toLocaleString()}
                        </p>
                    </div>

                    {bridgeResponse.message && (
                        <p className="text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                            "{bridgeResponse.message}"
                        </p>
                    )}

                    <button
                        onClick={() => onSuccess()}
                        className="w-full bg-success-600 hover:bg-success-700 text-white font-bold py-4 px-4 rounded-lg transition-colors"
                    >
                        Return to Case
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
                >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-100 p-2 rounded-lg">
                                <Shield className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-gray-900">
                                    Apply for Bridge Loan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Instant credit verification via Interswitch
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-emergency-50 border border-emergency-200 rounded-lg p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-emergency-700">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary-600" />
                                Identity Verification Required
                            </h3>
                            <p className="text-sm text-gray-600">
                                We'll verify your identity using Interswitch's
                                secure platform. This helps us process your
                                bridge loan instantly.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Verification Number (BVN) *
                            </label>
                            <input
                                type="text"
                                name="leadKinBvn"
                                value={formData.leadKinBvn}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="22233344455"
                                maxLength={11}
                                pattern="[0-9]{11}"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                11 digits - Used for identity verification
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                National Identification Number (NIN) *
                            </label>
                            <input
                                type="text"
                                name="leadKinNin"
                                value={formData.leadKinNin}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="12345678901"
                                maxLength={11}
                                pattern="[0-9]{11}"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                11 digits
                            </p>
                        </div>

                        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Guarantee Agreement
                            </h3>
                            <p className="text-sm text-gray-700 mb-4">
                                I understand that by applying for this bridge
                                loan:
                            </p>
                            <ul className="text-sm text-gray-700 space-y-2 mb-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-600 mt-1">
                                        •
                                    </span>
                                    <span>
                                        The loan covers up to 40% of the
                                        remaining medical deposit
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-600 mt-1">
                                        •
                                    </span>
                                    <span>
                                        I am responsible for repaying this
                                        amount through continued donations or
                                        personal funds
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-warning-600 mt-1">
                                        •
                                    </span>
                                    <span>
                                        My identity will be verified via
                                        Interswitch for fraud prevention
                                    </span>
                                </li>
                            </ul>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                                <span className="text-sm text-gray-900">
                                    I have read and agree to the guarantee
                                    agreement and consent to identity
                                    verification
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-4 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.agreedToTerms}
                                className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying Identity...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
