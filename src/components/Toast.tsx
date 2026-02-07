import { useEffect } from "react";
import type { ThemeColors } from "../types/theme";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
  themeColors: ThemeColors;
}

export function ToastItem({ toast, onClose, themeColors }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return themeColors.mode === "dark" ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)";
      case "error":
        return themeColors.mode === "dark" ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)";
      default:
        return themeColors.backgroundTertiary;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      default:
        return themeColors.accent;
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-lg shadow-lg mb-3 animate-fadeIn min-w-[280px] max-w-[400px]"
      style={{
        backgroundColor: getBgColor(),
        border: `1px solid ${getBorderColor()}`,
        color: themeColors.text,
      }}
    >
      <div style={{ color: getBorderColor() }}>{getIcon()}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: themeColors.text }}
        aria-label="Fechar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  themeColors: ThemeColors;
}

export function ToastContainer({ toasts, onClose, themeColors }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-10060 flex flex-col items-end"
      style={{ pointerEvents: "none" }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <ToastItem toast={toast} onClose={onClose} themeColors={themeColors} />
        </div>
      ))}
    </div>
  );
}
