import React, { useState } from 'react';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock, Shield, AlertCircle, Compass, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
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

      if (response.data.success && response.data.data?.requires2FA) {
        setTempToken(response.data.data.tempToken);
        setRequires2FA(true);
        setIsLoading(false);
        return;
      }

      if (response.data.success && response.data.data?.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        const user = response.data.data.user;

        if (accessToken && user) {
          localStorage.setItem('accessToken', accessToken);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          localStorage.setItem('user', JSON.stringify(user));

          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 50);
        } else {
          setErrors({ general: 'Login response missing required data. Please try again.' });
        }
      } else {
        setErrors({ general: 'Unexpected response from server. Please try again.' });
      }
    } catch (error: any) {
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
      if (!tempToken) {
        setErrors({ twoFactor: 'Session expired. Please login again.' });
        setVerifying2FA(false);
        return;
      }

      const verifyLoginUrl = API_ENDPOINTS.twoFactor?.verifyLogin || `${API_BASE_URL}/api/2fa/verify-login`;
      const response = await axios.post(
        verifyLoginUrl,
        {
          tempToken,
          code: useBackupCode ? undefined : twoFactorCode,
          backupCode: useBackupCode ? twoFactorCode : undefined,
        }
      );

      if (response.data.success && response.data.data?.tokens) {
        const tokens = response.data.data.tokens;
        const user = response.data.data.user;

        if (tokens.accessToken && user) {
          localStorage.setItem('accessToken', tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken);
          }
          localStorage.setItem('user', JSON.stringify(user));

          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 50);
        } else {
          setErrors({ twoFactor: 'Verification response missing required data. Please try again.' });
        }
      } else {
        setErrors({ twoFactor: 'Unexpected response from server. Please try again.' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Invalid verification code. Please try again.';
      setErrors({ twoFactor: errorMessage });
      setTwoFactorCode('');
    } finally {
      setVerifying2FA(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <AuthCard
          glass
          className="max-w-md relative z-10"
        >
          <form onSubmit={handle2FAVerification}>
            <div className="space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 rotate-3"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Verification</h2>
                <p className="text-slate-500 text-sm">
                  Enter the verification code from your authenticator app
                </p>
              </div>

              {errors.twoFactor && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.twoFactor}
                </motion.div>
              )}

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  {useBackupCode ? 'Backup Recovery Code' : '6-Digit Authentication Code'}
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
                  placeholder={useBackupCode ? "XXXX-XXXX" : "000 000"}
                  className="w-full text-center text-3xl font-mono tracking-[0.2em] px-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  maxLength={useBackupCode ? 9 : 6}
                  autoFocus
                  disabled={verifying2FA}
                />
              </div>

              <div className="flex flex-col gap-4">
                <AuthButton
                  type="submit"
                  variant="premium"
                  loading={verifying2FA}
                  disabled={verifying2FA || (useBackupCode ? twoFactorCode.length < 8 : twoFactorCode.length !== 6)}
                >
                  Confirm & Access Dashboard
                </AuthButton>

                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setTwoFactorCode('');
                    setErrors({});
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors py-2 uppercase tracking-widest"
                >
                  {useBackupCode ? 'Use App Code' : 'Use Backup Code'}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTempToken(null);
                    setTwoFactorCode('');
                    setUseBackupCode(false);
                    setErrors({});
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors w-full flex items-center justify-center gap-2"
                >
                  <span>←</span> Return to Login
                </button>
              </div>
            </div>
          </form>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden py-12 px-4 italic-none">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 group cursor-default">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-widest text-white/90 uppercase">CareerMap Admin</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Back</span>
          </h1>
          <p className="text-slate-400 mt-3 font-medium">Elevate your business management</p>
        </motion.div>

        <AuthCard
          glass
          className="relative overflow-hidden group border-white/10"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {errors.general && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errors.general}
                </motion.div>
              )}

              <AuthInput
                label="Identity"
                type="email"
                placeholder="admin@careermapsolutions.com"
                required
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5 text-indigo-500/70" />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
                inputClassName="bg-slate-50/50 border-slate-100 focus:bg-white transition-all py-3.5 rounded-xl text-slate-900 font-medium"
              />

              <AuthPasswordInput
                label="Secrets"
                placeholder="••••••••"
                required
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5 text-indigo-500/70" />}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group/check">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      defaultChecked
                    />
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-300" />
                    <ChevronRight className="absolute inset-0 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity m-auto" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-3 group-hover/check:text-slate-700 transition-colors">Keep Signed In</span>
                </label>
                <AuthLink to="/auth/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                  Reset Link
                </AuthLink>
              </div>

              <div className="pt-2">
                <AuthButton
                  type="submit"
                  variant="premium"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Initialize Session'}
                </AuthButton>
              </div>

              <div className="text-center pt-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Secure Access only
                </p>
              </div>
            </div>
          </form>
        </AuthCard>

        {/* Support Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-slate-500 text-[10px] uppercase tracking-[.25em] font-bold"
        >
          Secure Access Module &bull; Powered by CareerMap
        </motion.p>
      </div>
    </div>
  );
}
