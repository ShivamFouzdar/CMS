import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock, User } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.firstName) {
      setErrors((prev) => ({ ...prev, firstName: 'First name is required' }));
      return;
    }

    if (!formData.lastName) {
      setErrors((prev) => ({ ...prev, lastName: 'Last name is required' }));
      return;
    }

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }

    if (formData.password.length < 8) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'viewer', // Default role
      });

      if (response.data.success && response.data.data.tokens) {
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <AuthCard
        title="Create Account"
        description="Sign up to access the admin panel"
        className="shadow-2xl max-w-lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="First Name"
                type="text"
                placeholder="John"
                required
                error={errors.firstName}
                leftIcon={<User className="w-5 h-5" />}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={isLoading}
              />

              <AuthInput
                label="Last Name"
                type="text"
                placeholder="Doe"
                required
                error={errors.lastName}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <AuthInput
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
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
              placeholder="Create a strong password"
              required
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
            />

            <AuthPasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              required
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              disabled={isLoading}
            />

            <div className="text-sm text-gray-600">
              By signing up, you agree to our{' '}
              <AuthLink to="/terms" variant="muted">Terms of Service</AuthLink>{' '}
              and{' '}
              <AuthLink to="/privacy" variant="muted">
                Privacy Policy
              </AuthLink>
            </div>

            <AuthButton
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </AuthButton>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <AuthLink to="/auth/login">Sign in</AuthLink>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}

