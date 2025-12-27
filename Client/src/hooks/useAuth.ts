import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions?: string[];
  isEmailVerified?: boolean;
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme?: string;
    language?: string;
  };
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => void;
}

/**
 * Custom hook for authentication state management
 * Provides user data, token, and authentication status
 */
export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const userData = localStorage.getItem('user');
    const authToken = localStorage.getItem('accessToken');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setToken(authToken);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initialize auth state immediately on mount
    refreshUser();
    
    // Listen for storage changes (e.g., when login sets tokens in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        refreshUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    logout,
    refreshUser,
  };
}

