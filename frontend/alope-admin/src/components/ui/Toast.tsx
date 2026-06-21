import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const toast = React.useMemo(() => ({
    success: (msg: string, duration?: number) => addToast(msg, 'success', duration),
    error: (msg: string, duration?: number) => addToast(msg, 'error', duration),
    warning: (msg: string, duration?: number) => addToast(msg, 'warning', duration),
    info: (msg: string, duration?: number) => addToast(msg, 'info', duration),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps extends ToastMessage {
  onClose: () => void;
}

function ToastItem({ message, type = 'success', duration = 4000, onClose }: ToastItemProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-white dark:bg-zinc-900 border-emerald-500/30 dark:border-emerald-500/20',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
      bar: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-white dark:bg-zinc-900 border-red-500/30 dark:border-red-500/20',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
      bar: 'bg-red-500'
    },
    warning: {
      bg: 'bg-white dark:bg-zinc-900 border-amber-500/30 dark:border-amber-500/20',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
      bar: 'bg-amber-500'
    },
    info: {
      bg: 'bg-white dark:bg-zinc-900 border-blue-500/30 dark:border-blue-500/20',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
      bar: 'bg-blue-500'
    }
  }[type];

  return (
    <div 
      className={`pointer-events-auto flex flex-col overflow-hidden w-full rounded-2xl border bg-white/95 dark:bg-zinc-900/95 shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all`}
    >
      <div className="flex items-center gap-3.5 p-4">
        {config.icon}
        <p className={`flex-1 text-sm font-semibold leading-snug ${config.text}`}>
          {message}
        </p>
        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50 transition cursor-pointer shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Animated Timer Progress Bar */}
      <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800">
        <div 
          className={`h-full ${config.bar} transition-all ease-linear`}
          style={{ width: `${progress}%`, transitionDuration: '30ms' }}
        />
      </div>
    </div>
  );
}
