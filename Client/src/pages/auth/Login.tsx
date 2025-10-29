import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        email: formData.email,
        password: formData.password,
      });

      // Store tokens
      if (response.data.success && response.data.data.tokens) {
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <AuthCard
        title="Welcome Back"
        description="Sign in to your admin account"
        className="shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            <AuthInput
              label="Email Address"
              type="email"
              placeholder="admin@careermapsolutions.com"
              required
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isLoading}
            />

            <AuthPasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <AuthLink to="/auth/forgot-password">Forgot password?</AuthLink>
            </div>

            <AuthButton
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </AuthButton>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <AuthLink to="/auth/register">Sign up</AuthLink>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}

