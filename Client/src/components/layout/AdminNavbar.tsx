import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Bell,
    Sun,
    Moon,
    Monitor,
    Menu,
    X,
    Home,
    Check
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { notificationService, Notification } from '@/services/notificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const currentTitle = routeTitles[location.pathname] || 'Admin Panel';

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getNotifications(1, 5);
            if (response.success && response.data) {
                setNotifications(response.data);
                // Access unreadCount from meta if available
                setUnreadCount(response.meta?.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'new-lead': return 'bg-blue-500';
            case 'job-application': return 'bg-purple-500';
            case 'review': return 'bg-yellow-500';
            case 'system-alert': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

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

                {/* Right Section: Actions + User */}
                <div className="flex items-center gap-2 sm:gap-4">

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
                    <div className="relative" ref={notificationRef}>
                        <button
                            data-testid="notification-bell"
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-slate-400"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification._id}
                                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {notification.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <span className="text-[10px] text-gray-400">
                                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                    </span>
                                                                    {!notification.read && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleMarkAsRead(notification._id);
                                                                            }}
                                                                            className="text-[10px] text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                                                                        >
                                                                            <Check className="w-3 h-3" /> Mark read
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {notifications.length > 0 && (
                                        <div className="p-3 border-t border-gray-100 dark:border-white/5 text-center">
                                            <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium">
                                                View all notifications
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
