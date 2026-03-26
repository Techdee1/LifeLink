import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { aiAPI } from "../lib/api-service";
import { useAuth } from "../contexts/AuthContext";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { hospitalId } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || sending) return;

        const userMessage: Message = { role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            const response = await aiAPI.chat({
                message: trimmed,
                conversation_id: conversationId,
                hospital_id: hospitalId || undefined,
            });
            setConversationId(response.conversation_id);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I'm unable to respond right now. Please try again later.",
                },
            ]);
        } finally {
            setSending(false);
        }
    };

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
                        className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        <MessageCircle className="w-6 h-6" />
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
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-[#0F172A] text-white">
                            <div className="flex items-center gap-3">
                                <Bot className="w-5 h-5 text-primary-400" />
                                <div>
                                    <p className="font-bold text-sm">
                                        LifeLink Assistant
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Ask anything about LifeLink
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <Bot className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 font-medium">
                                        How can I help you today?
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ask about cases, payments, or platform
                                        features
                                    </p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-2.5 ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Bot className="w-4 h-4 text-gray-500" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
                            ))}
                            {sending && (
                                <div className="flex gap-2.5 justify-start">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100">
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
                                    placeholder="Type a message..."
                                    disabled={sending}
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
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
