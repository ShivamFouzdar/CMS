import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface SettingFieldProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const SettingField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    className = "",
    disabled = false
}: SettingFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-1 min-h-[20px] flex items-end mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-full pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isPassword && !disabled && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};
