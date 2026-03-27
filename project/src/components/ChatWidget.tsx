import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Globe } from "lucide-react";
import { aiAPI } from "../lib/api-service";
import { useAuth } from "../contexts/AuthContext";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const LANGUAGES = [
    { code: "en", label: "EN" },
    { code: "pcm", label: "Pidgin" },
    { code: "yo", label: "Yoruba" },
    { code: "ha", label: "Hausa" },
    { code: "ig", label: "Igbo" },
];

const QUICK_REPLIES = [
    "How do bridge loans work?",
    "How do I fund a case?",
    "What is LifeLink?",
    "How to share a case link?",
];

function TypingIndicator() {
    return (
        <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gray-500" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    );
}

function formatTime(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>();
    const [language, setLanguage] = useState("en");
    const [showLangPicker, setShowLangPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { hospitalId } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSend = async (text?: string) => {
        const trimmed = (text || input).trim();
        if (!trimmed || sending) return;

        const userMessage: Message = { role: "user", content: trimmed, timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            const response = await aiAPI.chat({
                message: trimmed,
                conversation_id: conversationId,
                language: language !== "en" ? language : undefined,
                hospital_id: hospitalId || undefined,
            });
            setConversationId(response.conversation_id);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.reply, timestamp: new Date() },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I'm unable to respond right now. Please try again later.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    const selectedLang = LANGUAGES.find((l) => l.code === language);

    return (
        <>
            {/* Floating button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#0F172A] text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        <MessageCircle className="w-6 h-6" />
                        {/* Pulse indicator */}
                        <span className="absolute top-0 right-0 w-3 h-3 bg-primary-400 rounded-full border-2 border-[#0F172A]">
                            <span className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-75" />
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[70vh] md:h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] text-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Bot className="w-5 h-5 text-primary-400" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success-400 rounded-full border border-[#0F172A]" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">LifeLink Assistant</p>
                                    <p className="text-[10px] text-gray-400">Online &middot; Multilingual support</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {/* Language picker */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowLangPicker(!showLangPicker)}
                                        className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Globe className="w-3 h-3" />
                                        {selectedLang?.label}
                                    </button>
                                    <AnimatePresence>
                                        {showLangPicker && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10 min-w-[120px]"
                                            >
                                                {LANGUAGES.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setLanguage(lang.code);
                                                            setShowLangPicker(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                                                            language === lang.code
                                                                ? "bg-primary-50 text-primary-700"
                                                                : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {lang.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && !sending && (
                                <div className="text-center py-8">
                                    <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Bot className="w-7 h-7 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                        Hi! I'm your LifeLink assistant
                                    </p>
                                    <p className="text-xs text-gray-400 mb-6">
                                        Ask about cases, payments, bridge loans, or anything else
                                    </p>

                                    {/* Quick Replies as Starters */}
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {QUICK_REPLIES.map((text) => (
                                            <button
                                                key={text}
                                                onClick={() => handleSend(text)}
                                                className="px-3 py-2 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-xl text-xs font-medium text-gray-600 hover:text-primary-700 transition-all"
                                            >
                                                {text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => {
                                const showTimestamp =
                                    i === messages.length - 1 ||
                                    messages[i + 1]?.role !== msg.role;

                                return (
                                    <div key={i}>
                                        <div
                                            className={`flex gap-2 ${
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                        >
                                            {msg.role === "assistant" && (
                                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Bot className="w-4 h-4 text-gray-500" />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                    msg.role === "user"
                                                        ? "bg-[#0F172A] text-white rounded-br-md"
                                                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                                                }`}
                                            >
                                                {msg.content}
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <User className="w-4 h-4 text-primary-600" />
                                                </div>
                                            )}
                                        </div>
                                        {showTimestamp && (
                                            <p
                                                className={`text-[10px] text-gray-400 mt-1 ${
                                                    msg.role === "user" ? "text-right mr-9" : "ml-9"
                                                }`}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            {sending && <TypingIndicator />}

                            {/* Quick Replies after assistant message */}
                            {messages.length > 0 && !sending && messages[messages.length - 1]?.role === "assistant" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-1.5 ml-9"
                                >
                                    {QUICK_REPLIES.slice(0, 3).map((text) => (
                                        <button
                                            key={text}
                                            onClick={() => handleSend(text)}
                                            className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-primary-200 hover:bg-primary-50 rounded-lg text-[11px] font-medium text-gray-500 hover:text-primary-700 transition-all"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        language === "en"
                                            ? "Type a message..."
                                            : language === "yo"
                                            ? "Kọ ifiranṣẹ kan..."
                                            : language === "ha"
                                            ? "Rubuta saƙo..."
                                            : language === "ig"
                                            ? "Dee ozi..."
                                            : language === "pcm"
                                            ? "Type message here..."
                                            : "Type a message..."
                                    }
                                    disabled={sending}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 disabled:opacity-50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || sending}
                                    className="p-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
