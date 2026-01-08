import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Bell,
    Sun,
    Moon,
    Monitor,
    Menu,
    X,
    Home
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AdminNavbarProps {
    onMenuToggle?: () => void;
    isMobileMenuOpen?: boolean;
}

const routeTitles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/job-applicants': 'Job Applicants',
    '/admin/leads': 'Inquiries',
    '/admin/reviews': 'Reviews',
    '/admin/settings': 'Settings',
};

export function AdminNavbar({ onMenuToggle, isMobileMenuOpen }: AdminNavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentTitle = routeTitles[location.pathname] || 'Admin Panel';

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left Section: Mobile Menu + Breadcrumb */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-gray-700 dark:text-slate-200" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-700 dark:text-slate-200" />
                        )}
                    </button>

                    {/* Breadcrumb */}
                    <nav className="hidden sm:flex items-center gap-2 text-sm">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden md:inline">Home</span>
                        </button>
                        <span className="text-gray-300 dark:text-slate-600">/</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{currentTitle}</span>
                    </nav>

                    {/* Mobile Title */}
                    <h1 className="sm:hidden text-lg font-bold text-gray-900 dark:text-white">{currentTitle}</h1>
                </div>

                {/* Right Section: Search + Actions + User */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Search */}
                    <div className="relative">
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.input
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="absolute right-10 top-1/2 -translate-y-1/2 w-[200px] px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                />
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-slate-400"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Theme Toggle - 3 Options */}
                    <div className="hidden sm:flex items-center gap-0.5 p-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
                            title="Light Mode"
                        >
                            <Sun className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 text-yellow-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
                            title="Dark Mode"
                        >
                            <Moon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setTheme('system')}
                            className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
                            title="System Theme"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-slate-400">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                </div>
            </div>
        </header>
    );
}
