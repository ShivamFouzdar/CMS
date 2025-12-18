import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  headerClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

export function DetailModal({
  isOpen,
  onClose,
  title,
  icon,
  headerClassName = 'bg-gradient-to-r from-blue-600 to-indigo-600',
  children,
  footer,
  maxWidth = '2xl',
  showCloseButton = true,
}: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle ${maxWidthClasses[maxWidth]} sm:w-full border border-gray-200`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className={`${headerClassName} px-6 py-5 border-b border-blue-700`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {icon && (
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper component for detail sections
interface DetailSectionProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DetailSection({ label, value, className = '' }: DetailSectionProps) {
  return (
    <div className={className}>
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </h4>
      <div className="text-base text-gray-900">{value}</div>
    </div>
  );
}

// Helper component for action buttons
interface DetailActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailActions({ children, className = '' }: DetailActionsProps) {
  return (
    <div className={`flex items-center justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
}

