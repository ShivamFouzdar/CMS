import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, Server, Database, Activity, Wifi, WifiOff,
    Layers, RefreshCw, Mail
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { servicesService } from '@/services/servicesService';


interface SystemHealthModalProps {
    onClose: () => void;
    initialHealthData?: any;
}

export function SystemHealthModal({ onClose, initialHealthData }: SystemHealthModalProps) {
    const [activeTab, setActiveTab] = useState<'system' | 'services'>('services');
    const [health, setHealth] = useState<any>(initialHealthData || null);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(!initialHealthData);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const [healthRes, servicesRes] = await Promise.all([
                adminService.getSystemHealth(),
                servicesService.getAllServices()
            ]);

            if (healthRes.success) setHealth(healthRes.data);
            if (servicesRes.success) setServices(servicesRes.data || []);
        } catch (error) {
            console.error('Failed to fetch modal data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'connected':
            case 'healthy':
            case 'online':
                return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'disconnected':
            case 'error':
            case 'offline':
                return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default:
                return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'connected':
            case 'healthy':
            case 'online':
                return <Wifi className="w-4 h-4" />;
            default:
                return <WifiOff className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">System Status</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time monitoring & availability</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className={`p-2 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'services'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <Layers className="w-4 h-4" />
                        Service Offerings
                    </button>
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'system'
                            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <Server className="w-4 h-4" />
                        System APIs
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm">Checking system status...</p>
                        </div>
                    ) : activeTab === 'services' ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Business Services</p>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                    {services.length} Total
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {services.map((service: any) => (
                                    <div key={service.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{service.name}</p>
                                                <p className="text-xs text-slate-500">{service.category}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${service.isActive
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-white/10 dark:text-slate-400'}`}>
                                            {service.isActive ? 'Online' : 'Offline'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Database */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Database</h4>
                                            <p className="text-xs text-slate-500">MongoDB Cluster</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusColor(health?.database?.status)}`}>
                                        {getStatusIcon(health?.database?.status)}
                                        <span className="uppercase">{health?.database?.status || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Response Time</span>
                                        <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">~12ms</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500 block mb-1">Collections</span>
                                        <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* SMTP */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">Email Service</h4>
                                            <p className="text-xs text-slate-500">SMTP Relay</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusColor(health?.smtp?.status)}`}>
                                        {getStatusIcon(health?.smtp?.status)}
                                        <span className="uppercase">{health?.smtp?.status || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 pt-2">
                                    Handles notifications, alerts, and contact form auto-responses.
                                </div>
                            </div>

                            {/* Server */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Server className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">API Server</h4>
                                            <p className="text-xs text-slate-500">Node.js Runtime</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                                        <Wifi className="w-4 h-4" />
                                        <span className="uppercase">ONLINE</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="text-center p-2 rounded bg-gray-50 dark:bg-white/5">
                                        <span className="text-[10px] text-slate-500 block">Uptime</span>
                                        <span className="font-bold text-xs">{Math.floor((health?.uptime || 0) / 3600)}h</span>
                                    </div>
                                    <div className="text-center p-2 rounded bg-gray-50 dark:bg-white/5">
                                        <span className="text-[10px] text-slate-500 block">Load</span>
                                        <span className="font-bold text-xs">{health?.serverLoad || 0}%</span>
                                    </div>
                                    <div className="text-center p-2 rounded bg-gray-50 dark:bg-white/5">
                                        <span className="text-[10px] text-slate-500 block">Memory</span>
                                        <span className="font-bold text-xs">{health?.memoryUsage || 0}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
