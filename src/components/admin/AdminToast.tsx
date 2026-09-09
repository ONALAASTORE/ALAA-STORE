import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Database, 
  Boxes, 
  AlertCircle, 
  X, 
  Trash2
} from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  badge?: string;
  icon?: 'firestore' | 'inventory' | 'check' | 'alert' | 'trash';
  duration?: number;
}

interface AdminToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const AdminToastContainer: React.FC<AdminToastProps> = ({ toasts, onDismiss }) => {
  return (
    <aside 
      aria-label="Admin Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 4500;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const renderIcon = () => {
    switch (toast.icon) {
      case 'firestore':
        return (
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 shadow-inner">
            <Database className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
        );
      case 'inventory':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <Boxes className="w-4 h-4 text-emerald-400" />
          </div>
        );
      case 'trash':
        return (
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 shadow-inner">
            <Trash2 className="w-4 h-4 text-red-400" />
          </div>
        );
      case 'alert':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
        );
      case 'check':
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        );
    }
  };

  const getBorderAndGlow = () => {
    switch (toast.type) {
      case 'error':
        return 'border-red-500/40 shadow-[0_8px_30px_rgba(239,68,68,0.2)]';
      case 'warning':
        return 'border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.2)]';
      case 'info':
        return 'border-blue-500/40 shadow-[0_8px_30px_rgba(59,130,246,0.2)]';
      case 'success':
      default:
        return toast.icon === 'firestore'
          ? 'border-orange-500/40 shadow-[0_8px_30px_rgba(249,115,22,0.2)]'
          : 'border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.2)]';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border ${getBorderAndGlow()} p-4 text-slate-100 flex items-start gap-3 shadow-2xl`}
      role="alert"
    >
      {renderIcon()}

      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h4 className="text-xs font-bold text-white tracking-tight">
            {toast.title}
          </h4>
          {toast.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {toast.badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Subtle bottom progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[2.5px] ${
          toast.icon === 'firestore'
            ? 'bg-orange-500'
            : toast.icon === 'inventory'
            ? 'bg-emerald-500'
            : toast.type === 'error'
            ? 'bg-red-500'
            : toast.type === 'info'
            ? 'bg-blue-500'
            : 'bg-emerald-400'
        }`}
      />
    </motion.div>
  );
};
