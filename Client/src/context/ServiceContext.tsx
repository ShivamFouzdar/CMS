
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

    const fetchServices = async () => {
        try {
            const response = await servicesService.getActiveServices();
            if (response.success) {
                setServices(response.data);
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
