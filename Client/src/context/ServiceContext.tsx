
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { servicesService } from '@/services/servicesService';
import { Service } from '@/types';

interface ServiceContextType {
    services: Service[];
    isLoading: boolean;
    refreshServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const CACHE_KEY = 'services_cache';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const fetchServices = async () => {
        // Try to load from cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setServices(data);
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await servicesService.getActiveServices();
            if (response.success) {
                setServices(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: response.data,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <ServiceContext.Provider value={{ services, isLoading, refreshServices: fetchServices }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServices() {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
}
