import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication after component mounts to ensure localStorage is available
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    const authenticated = !!(token && user);
    setIsAuthenticated(authenticated);
    setIsChecking(false);
  }, []);

  // Show nothing while checking to prevent flash
  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

