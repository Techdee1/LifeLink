import { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    Loader2,
    TrendingUp,
} from "lucide-react";
import { aiAPI } from "../lib/api-service";
import type { RiskScoreResponse } from "../types/api";

interface RiskScoreCardProps {
    caseId: number;
    targetAmount: number;
    raisedAmount: number;
    percentage: number;
}

function getRiskConfig(level: string) {
    switch (level) {
        case "LOW":
            return { color: "text-success-600", bg: "bg-success-50", border: "border-success-200", icon: CheckCircle, label: "Low Risk" };
        case "MEDIUM":
            return { color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200", icon: AlertTriangle, label: "Medium Risk" };
        case "HIGH":
            return { color: "text-emergency-600", bg: "bg-emergency-50", border: "border-emergency-200", icon: AlertTriangle, label: "High Risk" };
        case "VERY_HIGH":
            return { color: "text-emergency-700", bg: "bg-emergency-50", border: "border-emergency-300", icon: XCircle, label: "Very High Risk" };
        default:
            return { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Shield, label: level };
    }
}

function getRecommendationConfig(rec: string) {
    switch (rec) {
        case "APPROVE":
            return { color: "text-success-700 bg-success-50 border-success-200", label: "Recommended to Approve" };
        case "REVIEW":
            return { color: "text-warning-700 bg-warning-50 border-warning-200", label: "Needs Review" };
        case "DENY":
            return { color: "text-emergency-700 bg-emergency-50 border-emergency-200", label: "Not Recommended" };
        default:
            return { color: "text-gray-700 bg-gray-50 border-gray-200", label: rec };
    }
}

function ScoreGauge({ score }: { score: number }) {
    const getColor = () => {
        if (score <= 30) return "from-success-400 to-success-500";
        if (score <= 50) return "from-success-400 to-warning-500";
        if (score <= 75) return "from-warning-400 to-emergency-500";
        return "from-emergency-400 to-emergency-600";
    };

    return (
        <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 264} 264`}
                    initial={{ strokeDasharray: "0 264" }}
                    animate={{ strokeDasharray: `${(score / 100) * 264} 264` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="scoreGradient">
                        <stop offset="0%" className={`${getColor().split(" ")[0]}`} stopColor={score <= 50 ? "#10b981" : "#f97316"} />
                        <stop offset="100%" stopColor={score <= 50 ? "#f97316" : "#f43f5e"} />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-black text-gray-900">{Math.round(score)}</span>
                <span className="text-[9px] text-gray-400 font-semibold uppercase">/ 100</span>
            </div>
        </div>
    );
}

export default function RiskScoreCard({ caseId, targetAmount, raisedAmount, percentage }: RiskScoreCardProps) {
    const [data, setData] = useState<RiskScoreResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);

    const fetchRiskScore = async () => {
        if (data) return;
        setLoading(true);
        setError("");
        try {
            const remaining = targetAmount - raisedAmount;
            const loanAmount = Math.min(remaining, targetAmount * 0.4);
            const result = await aiAPI.getRiskScore(caseId, { loan_amount: loanAmount });
            setData(result);
        } catch {
            setError("Unable to analyze risk at this time.");
        } finally {
            setLoading(false);
        }
    };

    // Only show for bridge-eligible cases (60%+)
    if (percentage < 60 || percentage >= 100) return null;

    const riskConfig = data ? getRiskConfig(data.risk_level) : null;
    const recConfig = data ? getRecommendationConfig(data.recommendation) : null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
                onClick={() => {
                    fetchRiskScore();
                    setExpanded(!expanded);
                }}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-secondary-50 p-2.5 rounded-xl">
                        <Shield className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-900">AI Risk Assessment</h3>
                        <p className="text-xs text-gray-400">Bridge loan eligibility analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {data && riskConfig && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${riskConfig.bg} ${riskConfig.color}`}>
                            {riskConfig.label}
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-gray-50"
                >
                    {loading && (
                        <div className="flex items-center justify-center py-10 gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                            <span className="text-sm text-gray-500">Analyzing risk factors...</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-5 text-center">
                            <p className="text-sm text-emergency-600">{error}</p>
                        </div>
                    )}

                    {data && riskConfig && recConfig && (
                        <div className="p-5 space-y-5">
                            {/* Score + Recommendation */}
                            <div className="flex items-center gap-6">
                                <ScoreGauge score={data.risk_score} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <riskConfig.icon className={`w-5 h-5 ${riskConfig.color}`} />
                                        <span className={`text-lg font-heading font-bold ${riskConfig.color}`}>
                                            {riskConfig.label}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${recConfig.color}`}>
                                        {recConfig.label}
                                    </span>
                                </div>
                            </div>

                            {/* Factors */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Risk Factors
                                </h4>
                                <div className="space-y-2.5">
                                    {Object.entries(data.factors).map(([key, value]) => {
                                        const score = typeof value === "number" ? value : 0;
                                        const barColor = score <= 30 ? "bg-success-500" : score <= 60 ? "bg-warning-500" : "bg-emergency-500";
                                        return (
                                            <div key={key}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-gray-600 capitalize">
                                                        {key.replace(/_/g, " ")}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-900">{Math.round(score)}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full rounded-full ${barColor}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(score, 100)}%` }}
                                                        transition={{ duration: 0.6, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Analysis</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{data.explanation}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
