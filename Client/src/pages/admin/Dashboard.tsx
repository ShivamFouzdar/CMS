import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/ui/StatCard';
import { adminService, DashboardStats } from '@/services/adminService';
import {
  Users,
  MessageSquare,
  Briefcase,
  Star,
  ArrowRight,
  Activity,

  Server,
  RefreshCw,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';
import { SystemHealthModal } from '@/components/admin/SystemHealthModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes, healthRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentActivity(),
          adminService.getSystemHealth()
        ]);

        if (isMounted) {
          if (statsRes.success) setStats(statsRes.data);
          if (activityRes.success) setRecentActivity(activityRes.data || []);
          if (healthRes.success) setHealthData(healthRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const formatUptime = (seconds: number) => {
    if (!seconds) return '0h';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <AdminLayout>
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
              {greeting}, {user?.firstName || 'Admin'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Here's what's happening with your platform today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/40 p-2 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:rotate-180 duration-300"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Inquiries"
            value={stats?.contacts.total || 0}
            icon={Users}
            gradient="blue"
            subtitle={`${stats?.contacts.new || 0} new today`}
            onClick={() => navigate('/admin/leads')}
          />
          <StatCard
            title="Applications"
            value={stats?.jobs.total || 0}
            icon={Briefcase}
            gradient="indigo"
            subtitle="Processing active"
            onClick={() => navigate('/admin/job-applicants')}
          />
          <StatCard
            title="Site Reviews"
            value={stats?.reviews.total || 0}
            icon={Star}
            gradient="purple"
            subtitle={`${stats?.reviews.pending || 0} pending approval`}
            onClick={() => navigate('/admin/reviews')}
          />
          <StatCard
            title="Service Listings"
            value={stats?.services.total || 0}
            icon={Layers}
            gradient="green"
            subtitle={`${stats?.services.active || 0} active • ${(healthData?.database?.status === 'connected' ? 1 : 0) +
              (healthData?.smtp?.connected ? 1 : 0)
              } connected APIs`}
            onClick={() => setShowHealthModal(true)}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 glass-card rounded-2xl sm:rounded-3xl overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-white/[0.02]">
              <h3 className="text-lg sm:text-xl font-bold font-display flex items-center gap-2 sm:gap-3">
                <Activity className="w-6 h-6 text-indigo-400" />
                Recent Activity
              </h3>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div key={activity.id || idx} className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                      {activity.type === 'contact' ? <Users className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 dark:text-slate-200 font-medium">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activity.user}</span> {activity.action} a {activity.type}
                      </p>
                      <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-slate-400 dark:text-slate-600 self-center">
                      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">No recent activity found.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-3xl p-6 space-y-6">
              <h3 className="text-xl font-bold font-display flex items-center gap-3">
                <Server className="w-6 h-6 text-emerald-400" />
                System Health
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Server Load</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {healthData?.serverLoad || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${healthData?.serverLoad || 0}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Memory Usage</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {healthData?.memoryUsage || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${healthData?.memoryUsage || 0}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Disk Usage</span>
                    <span className="text-amber-500 font-bold">
                      {healthData?.disk?.percentage || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${healthData?.disk?.percentage || 0}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-400 dark:text-gray-500">
                    {formatBytes(healthData?.disk?.used || 0)} / {formatBytes(healthData?.disk?.total || 0)}
                  </p>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/5">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Database</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${healthData?.database?.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-bold text-slate-900 dark:text-white capitalize">
                      {healthData?.database?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Uptime</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatUptime(healthData?.uptime || 0)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-center text-gray-400 dark:text-gray-600 font-mono">
                  {healthData?.system?.platform} {healthData?.system?.arch} • Node {healthData?.system?.nodeVersion}
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/10 dark:to-purple-500/10">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/admin/settings')} className="p-3 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                  Settings
                </button>
                <button onClick={() => navigate('/admin/services')} className="p-3 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                  Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {showHealthModal && (
        <SystemHealthModal
          initialHealthData={healthData}
          onClose={() => setShowHealthModal(false)}
        />
      )}
    </AdminLayout>
  );
}
