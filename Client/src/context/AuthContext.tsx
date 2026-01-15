import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isSuperAdmin: boolean;
    login: (data: LoginResponse) => void;
    logout: () => void;
    checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = authService.getCurrentUser();
                // Ideally we verify token validity with handling 401 interceptors from api.ts
                // But checking storage existence is good initial state
                if (storedUser) {
                    setUser(storedUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth initialization failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (data: LoginResponse) => {
        if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            // Session storage is handled by authService.setSession inside login flow usually,
            // but in case we just update state:
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/auth/login';
    };

    const isSuperAdmin = user?.role === 'super_admin';

    const checkPermission = (permission: string): boolean => {
        if (isSuperAdmin) return true;
        if (user?.role === 'admin') return true; // Admins usually have most perms, but careful
        return user?.permissions?.includes(permission) || false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isSuperAdmin,
            login,
            logout,
            checkPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
