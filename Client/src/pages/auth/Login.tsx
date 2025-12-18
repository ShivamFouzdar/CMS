import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock, Shield, Loader2, AlertCircle } from 'lucide-react';
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
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);

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

      // Check if 2FA is required
      if (response.data.success && response.data.data.requires2FA) {
        setTempToken(response.data.data.tempToken);
        setRequires2FA(true);
        setIsLoading(false);
        return;
      }

      // Store tokens and complete login
      if (response.data.success && response.data.data.tokens) {
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!twoFactorCode.trim()) {
      setErrors({ twoFactor: 'Verification code is required' });
      return;
    }

    setVerifying2FA(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.twoFactor?.verifyLogin || '/api/2fa/verify-login',
        {
          tempToken,
          code: useBackupCode ? undefined : twoFactorCode,
          backupCode: useBackupCode ? twoFactorCode : undefined,
        }
      );

      if (response.data.success && response.data.data.tokens) {
        // Store tokens and complete login
        localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid verification code. Please try again.';
      setErrors({ twoFactor: errorMessage });
      setTwoFactorCode('');
    } finally {
      setVerifying2FA(false);
    }
  };

  // Show 2FA verification step
  if (requires2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <AuthCard
          title="Two-Factor Authentication"
          description="Enter the 6-digit code from your authenticator app"
          className="shadow-2xl max-w-md"
        >
          <form onSubmit={handle2FAVerification}>
            <div className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">
                  Open your authenticator app and enter the code
                </p>
              </div>

              {errors.twoFactor && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.twoFactor}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {useBackupCode ? 'Backup Code' : '6-Digit Code'}
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => {
                    const value = useBackupCode 
                      ? e.target.value.replace(/[^A-Z0-9-]/gi, '').toUpperCase()
                      : e.target.value.replace(/\D/g, '').slice(0, 6);
                    setTwoFactorCode(value);
                  }}
                  placeholder={useBackupCode ? "XXXX-XXXX" : "000000"}
                  className="w-full text-center text-3xl font-mono tracking-widest px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={useBackupCode ? 9 : 6}
                  autoFocus
                  disabled={verifying2FA}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode);
                  setTwoFactorCode('');
                  setErrors({});
                }}
                className="text-sm text-blue-600 hover:text-blue-800 text-center w-full"
              >
                {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
              </button>

              <AuthButton
                type="submit"
                variant="primary"
                loading={verifying2FA}
                disabled={verifying2FA || (useBackupCode ? twoFactorCode.length < 8 : twoFactorCode.length !== 6)}
              >
                {verifying2FA ? 'Verifying...' : 'Verify & Continue'}
              </AuthButton>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTempToken(null);
                  setTwoFactorCode('');
                  setUseBackupCode(false);
                  setErrors({});
                }}
                className="text-sm text-gray-600 hover:text-gray-900 text-center w-full"
              >
                ← Back to login
              </button>
            </div>
          </form>
        </AuthCard>
      </div>
    );
  }

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

