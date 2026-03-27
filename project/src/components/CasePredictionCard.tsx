import { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    ChevronDown,
    Loader2,
    Target,
    Calendar,
    BarChart3,
} from "lucide-react";
import { aiAPI } from "../lib/api-service";
import type { CasePredictionResponse } from "../types/api";

interface CasePredictionCardProps {
    caseId: number;
    percentage: number;
}

function getConfidenceConfig(level: string) {
    switch (level) {
        case "HIGH":
            return { color: "text-success-600", bg: "bg-success-50", label: "High Confidence" };
        case "MEDIUM":
            return { color: "text-warning-600", bg: "bg-warning-50", label: "Medium Confidence" };
        case "LOW":
            return { color: "text-gray-500", bg: "bg-gray-100", label: "Low Confidence" };
        default:
            return { color: "text-gray-500", bg: "bg-gray-100", label: level };
    }
}

function getProbabilityColor(prob: number) {
    if (prob >= 0.7) return "from-success-400 to-success-500";
    if (prob >= 0.4) return "from-warning-400 to-warning-500";
    return "from-emergency-400 to-emergency-500";
}

function ProbabilityRing({ probability }: { probability: number }) {
    const pct = probability * 100;
    const circumference = 2 * Math.PI * 42;
    const gradientClass = getProbabilityColor(probability);

    return (
        <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#predGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray: `${(pct / 100) * circumference} ${circumference}` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="predGradient">
                        <stop
                            offset="0%"
                            className={gradientClass.split(" ")[0]}
                            stopColor={probability >= 0.4 ? "#10b981" : "#f43f5e"}
                        />
                        <stop
                            offset="100%"
                            stopColor={probability >= 0.7 ? "#10b981" : probability >= 0.4 ? "#f97316" : "#f43f5e"}
                        />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-black text-gray-900">
                    {Math.round(pct)}%
                </span>
                <span className="text-[9px] text-gray-400 font-semibold uppercase">likely</span>
            </div>
        </div>
    );
}

export default function CasePredictionCard({ caseId, percentage }: CasePredictionCardProps) {
    const [data, setData] = useState<CasePredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);

    const fetchPrediction = async () => {
        if (data) return;
        setLoading(true);
        setError("");
        try {
            const result = await aiAPI.getCasePrediction(caseId);
            setData(result);
        } catch {
            setError("Unable to generate prediction at this time.");
        } finally {
            setLoading(false);
        }
    };

    // Only show for active cases that aren't fully funded
    if (percentage >= 100) return null;

    const confidenceConfig = data ? getConfidenceConfig(data.confidence_level) : null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
                onClick={() => {
                    fetchPrediction();
                    setExpanded(!expanded);
                }}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-2.5 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-900">AI Success Prediction</h3>
                        <p className="text-xs text-gray-400">Funding outcome forecast</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {data && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600">
                            {Math.round(data.success_probability * 100)}% likely
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
                            <span className="text-sm text-gray-500">Generating prediction...</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-5 text-center">
                            <p className="text-sm text-emergency-600">{error}</p>
                        </div>
                    )}

                    {data && confidenceConfig && (
                        <div className="p-5 space-y-5">
                            {/* Probability + Key Stats */}
                            <div className="flex items-center gap-6">
                                <ProbabilityRing probability={data.success_probability} />
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary-500" />
                                        <span className="text-sm font-bold text-gray-900">
                                            Success Probability
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${confidenceConfig.bg} ${confidenceConfig.color}`}>
                                            {confidenceConfig.label}
                                        </span>
                                        {data.estimated_days_to_target !== null && (
                                            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary-50 text-secondary-600 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                ~{data.estimated_days_to_target} days to target
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Factors */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Prediction Factors
                                </h4>
                                <div className="space-y-2.5">
                                    {Object.entries(data.factors).map(([key, value]) => {
                                        const score = typeof value === "number" ? value : 0;
                                        const barColor = score >= 70 ? "bg-success-500" : score >= 40 ? "bg-warning-500" : "bg-emergency-500";
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
                                    <BarChart3 className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Forecast</span>
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
