import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Settings as SettingsIcon, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { publicService } from '@/services/publicService';

interface MaintenanceData {
    email: string;
    phone: string;
    siteName: string;
}

export default function Maintenance() {
    const [maintenanceData, setMaintenanceData] = useState<MaintenanceData>({
        email: 'info@careermapsolutions.com',
        phone: '+91 90129 50370',
        siteName: 'CareerMap Solutions'
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Try to fetch public settings
                // If maintenance is ON, this returns 503 (caught by interceptor or here)
                // If maintenance is OFF, this returns 200 OK
                await publicService.getPublicSettings();

                // If we get here, the call succeeded, so maintenance is over
                window.location.href = '/';
            } catch (error: any) {
                // If we have dynamic contact info from the 503 response, use it
                if (error.status === 503 && error.data?.contact) {
                    setMaintenanceData(error.data.contact);
                }
            }
        };

        // Check immediately on mount
        checkStatus();

        // Check every 5 seconds
        const interval = setInterval(checkStatus, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleReload = async () => {
        try {
            await publicService.getPublicSettings();
            window.location.href = '/';
        } catch (error: any) {
            if (error.status === 503 && error.data?.contact) {
                setMaintenanceData(error.data.contact);
            } else {
                window.location.reload();
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full text-center relative z-10"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                    {/* Icon Animation */}
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-purple-100 rounded-full animate-pulse"></div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-20 h-20 bg-purple-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                                <SettingsIcon className="w-10 h-10 text-purple-600" />
                            </div>
                        </motion.div>
                        <div className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-4 border-white shadow-sm z-10">
                            <Hammer className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    >
                        {maintenanceData.siteName} is Under Maintenance
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 text-lg mb-8 leading-relaxed"
                    >
                        We're currently upgrading our system to serve you better. We'll be back shortly with an improved experience.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm text-gray-500"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>Estimated downtime: 30 minutes</span>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="border-t border-gray-100 pt-8"
                    >
                        <p className="text-gray-500 text-sm mb-4">Need urgent assistance?</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href={`mailto:${maintenanceData.email}`} className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                <Mail className="w-4 h-4" />
                                {maintenanceData.email}
                            </a>
                            <span className="hidden sm:inline text-gray-300">|</span>
                            <a href={`tel:${maintenanceData.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium">
                                <Phone className="w-4 h-4" />
                                {maintenanceData.phone}
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <Button
                            onClick={handleReload}
                            variant="outline"
                            className="border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200"
                        >
                            Check Status
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
