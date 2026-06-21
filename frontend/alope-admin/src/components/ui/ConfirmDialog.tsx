import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  
  const iconMap = {
    danger: (
      <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 flex items-center justify-center border border-red-200/50 dark:border-red-900/30">
        <Trash2 className="h-6 w-6" />
      </div>
    ),
    warning: (
      <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-650 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-900/30">
        <AlertTriangle className="h-6 w-6" />
      </div>
    ),
    info: (
      <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 flex items-center justify-center border border-blue-200/50 dark:border-blue-900/30">
        <HelpCircle className="h-6 w-6" />
      </div>
    ),
  };

  const confirmButtonClass = {
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-650 dark:hover:bg-red-750 text-white font-bold rounded-xl shadow-lg shadow-red-500/10 hover:shadow transition',
    warning: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/10 hover:shadow transition',
    info: 'bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold rounded-xl shadow-lg hover:shadow transition',
  }[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidthClass="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        {/* Visual Icon */}
        {iconMap[variant]}

        <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-4 leading-tight">
          {title}
        </h3>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2.5 max-w-sm leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full mt-6 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-200 rounded-xl font-bold py-2.5 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 cursor-pointer ${confirmButtonClass}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
