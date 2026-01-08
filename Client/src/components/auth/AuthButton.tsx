import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'premium';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function AuthButton({
  children,
  loading = false,
  disabled = false,
  fullWidth = true,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
  ...props
}: AuthButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
    secondary: 'bg-slate-700 hover:bg-slate-800 text-white shadow-slate-200',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    premium: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white shadow-indigo-200 transition-all duration-500',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg',
        'flex items-center justify-center space-x-2',
        fullWidth && 'w-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <span>{children}</span>
      )}
    </motion.button>
  );
}
