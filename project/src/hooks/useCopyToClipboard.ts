import { useState, useCallback } from "react";

export function useCopyToClipboard(resetDelay = 2000) {
    const [copiedId, setCopiedId] = useState<string | number | null>(null);

    const copy = useCallback(
        (text: string, id: string | number) => {
            navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), resetDelay);
        },
        [resetDelay]
    );

    const isCopied = useCallback(
        (id: string | number) => copiedId === id,
        [copiedId]
    );

    return { copy, isCopied };
}
