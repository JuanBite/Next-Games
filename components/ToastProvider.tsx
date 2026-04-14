"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counter = useRef(0);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = counter.current++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const alertClass = {
        success: "alert-success",
        error: "alert-error",
        info: "alert-info",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast toast-top toast-end z-[9999]">
                {toasts.map(t => (
                    <div key={t.id} className={`alert ${alertClass[t.type]} text-sm shadow-lg`}>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}