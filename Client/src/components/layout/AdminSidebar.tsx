import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  UserCheck,
  LogOut, 
  Settings,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Job Applicants', path: '/admin/job-applicants', icon: Briefcase },
  { name: 'Leads', path: '/admin/leads', icon: UserCheck },
  { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

// Debug: Log nav items to ensure they're loaded
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Admin Sidebar Nav Items:', navItems);
}

interface AdminSidebarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  } | null;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <>
      {/* Logo/Header */}
      <div className={`border-b border-gray-200 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300 ${collapsed ? 'p-4' : 'p-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              {user && (
                <p className="text-xs text-white/80 mt-0.5">
                  {user.firstName} {user.lastName}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'p-2' : 'p-4'} space-y-1`}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 font-medium group relative
                ${active 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
              {active && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className={`border-t border-gray-200 ${collapsed ? 'p-2' : 'p-4'} space-y-2`}>
        {user && !collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                {user.role && (
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{user.role}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {user && collapsed && (
          <div className="mb-2 flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 
            bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl 
            hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  // Mobile view with hamburger menu
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm z-40 flex items-center px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
          <div className="ml-3 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Admin</span>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <>
      <aside 
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-0 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-xl transition-all duration-300 ease-in-out z-30"
        style={{ width: isCollapsed ? '80px' : '288px' }}
      >
        <SidebarContent collapsed={isCollapsed} />
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => {
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            localStorage.setItem('sidebarCollapsed', String(newState));
            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new Event('sidebarToggle'));
          }}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 z-10 hover:border-blue-300"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </aside>
    </>
  );
}
