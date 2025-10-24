'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { AuthService } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setAuthenticated, 
    setLoading 
  } = useAppStore();

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthenticated, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Property Valuation Platform
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your valuation forms
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
