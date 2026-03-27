import type { CaseStatus } from "../types/api";

interface StatusBadgeProps {
    status: CaseStatus | string;
    percentage?: number;
}

const STATUS_STYLES: Record<string, string> = {
    OPEN: "bg-gray-100 text-gray-700",
    PARTIALLY_FUNDED: "bg-warning-100 text-warning-700",
    BRIDGE_ELIGIBLE: "bg-primary-100 text-primary-700",
    FULLY_FUNDED: "bg-success-100 text-success-700",
    CLOSED: "bg-secondary-100 text-secondary-700",
    ARCHIVED: "bg-gray-100 text-gray-700",
};

function getLabel(status: string, percentage?: number): string {
    if (status === "FULLY_FUNDED") return "FULLY FUNDED";
    if (status === "CLOSED") return "CLOSED";
    if (status === "ARCHIVED") return "ARCHIVED";
    if (percentage !== undefined && percentage >= 60) return "60% REACHED";
    if (percentage !== undefined && percentage > 0) return "IN PROGRESS";
    return status.replace("_", " ");
}

export default function StatusBadge({ status, percentage }: StatusBadgeProps) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.OPEN;
    const label = getLabel(status, percentage);

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
        >
            {label}
        </span>
    );
}
