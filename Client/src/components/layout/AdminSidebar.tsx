import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  Users,
} from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Services', path: '/admin/services', icon: Layers },
  { name: 'Applications', path: '/admin/job-applicants', icon: Briefcase },
  { name: 'Inquiries', path: '/admin/leads', icon: UserCheck },
  { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  { name: 'Users', path: '/admin/users', icon: Users, role: ['super_admin'] },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  role?: string[];
}

interface AdminSidebarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  } | null;
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export const AdminSidebar = memo(function AdminSidebar({
  user,
  mobileMenuOpen = false,
  onMobileMenuClose
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Header - Logo */}
      <div className={`h-14 flex items-center border-b border-gray-100 dark:border-white/5 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img src="/logo2.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Admin Panel</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Section Label */}
        {!collapsed && (
          <div className="px-4 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Main</span>
          </div>
        )}

        {/* Nav Items */}
        <nav className={`space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.filter(item => !item.role || (user?.role && item.role.includes(user.role))).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile && onMobileMenuClose) onMobileMenuClose();
                }}
                className={`
                  w-full flex items-center gap-3 h-10
                  ${collapsed ? 'justify-center px-2' : 'px-3'} 
                  rounded-lg transition-all duration-150
                  ${active
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'
                  }`} />
                {!collapsed && (
                  <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer - User */}
      <div className={`border-t border-gray-100 dark:border-white/5 ${collapsed ? 'p-2' : 'p-3'}`}>
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{user?.firstName?.charAt(0) || 'A'}</span>
              </div>
              <div
                className="min-w-0 flex-1 cursor-pointer group"
                onClick={() => navigate('/admin/profile')}
              >
                <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                  {user?.firstName || 'Admin'} {user?.lastName || ''}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate group-hover:text-indigo-400/70 transition-colors">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all shadow-lg"
              onClick={() => navigate('/admin/profile')}
            >
              <span className="text-xs font-bold text-white">{user?.firstName?.charAt(0) || 'A'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onMobileMenuClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-60 shadow-2xl z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-100 dark:border-white/5 transition-all duration-300 ease-out z-30"
      style={{ width: isCollapsed ? '80px' : '240px' }}
    >
      <SidebarContent collapsed={isCollapsed} />

      {/* Collapse Toggle */}
      <button
        onClick={() => {
          const newState = !isCollapsed;
          setIsCollapsed(newState);
          localStorage.setItem('sidebarCollapsed', String(newState));
          window.dispatchEvent(new Event('sidebarToggle'));
        }}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-md flex items-center justify-center transition-all hover:scale-110"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
        )}
      </button>
    </aside>
  );
});
