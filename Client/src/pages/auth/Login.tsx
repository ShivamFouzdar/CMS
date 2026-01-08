import React, { useState } from 'react';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock, Shield, AlertCircle, Compass } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';

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

          // Small delay for animation
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 800);
        } else {
          setErrors({ general: 'Login response missing required data. Please try again.' });
          setIsLoading(false);
        }
      } else {
        setErrors({ general: 'Unexpected response from server. Please try again.' });
        setIsLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
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
          }, 800);
        } else {
          setErrors({ twoFactor: 'Verification response missing required data. Please try again.' });
          setVerifying2FA(false);
        }
      } else {
        setErrors({ twoFactor: 'Unexpected response from server. Please try again.' });
        setVerifying2FA(false);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || 'Invalid verification code. Please try again.';
      setErrors({ twoFactor: errorMessage });
      setTwoFactorCode('');
      setVerifying2FA(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-[#0F172A] overflow-hidden py-12 px-4 font-sans selection:bg-indigo-500/30">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <AuthCard
          glass
          className="max-w-md w-full relative z-10 border-slate-700/50 bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-black/50"
        >
          <form onSubmit={handle2FAVerification}>
            <div className="space-y-8 p-2">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25 ring-1 ring-white/10"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Two-Factor Authentication</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Enter the code from your authenticator app <br />to verify your identity.
                </p>
              </div>

              <AnimatePresence>
                {errors.twoFactor && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {errors.twoFactor}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {useBackupCode ? 'Backup Code' : 'Verification Code'}
                  </label>
                  <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                    {useBackupCode ? 'Use once' : 'Expires in 30s'}
                  </span>
                </div>

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
                  className="w-full text-center text-3xl font-mono tracking-[0.2em] px-4 py-6 bg-slate-950/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder-slate-600 shadow-inner"
                  maxLength={useBackupCode ? 9 : 6}
                  autoFocus
                  disabled={verifying2FA}
                />
              </div>

              <div className="space-y-4">
                <AuthButton
                  type="submit"
                  variant="premium"
                  loading={verifying2FA}
                  disabled={verifying2FA || (useBackupCode ? twoFactorCode.length < 8 : twoFactorCode.length !== 6)}
                  className="h-12 text-base font-semibold"
                >
                  Confirm Authentication
                </AuthButton>

                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setTwoFactorCode('');
                    setErrors({});
                  }}
                  className="w-full text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors py-2 uppercase tracking-wider"
                >
                  {useBackupCode ? 'Switch to Authenticator App' : 'I lost my device (Use Backup Code)'}
                </button>
              </div>

              <div className="pt-6 border-t border-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTempToken(null);
                    setTwoFactorCode('');
                    setUseBackupCode(false);
                    setErrors({});
                  }}
                  className="text-sm font-medium text-slate-500 hover:text-white transition-colors w-full flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Login
                </button>
              </div>
            </div>
          </form>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0B0F19] overflow-hidden py-12 px-4 font-sans selection:bg-indigo-500/30">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[150px]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Branding Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 hover:bg-white/10 transition-colors duration-300 cursor-default shadow-lg shadow-black/20">
            <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-md flex items-center justify-center shadow-inner">
              <Compass className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">CareerMap Admin</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">Welcome</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-violet-400">Back</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Sign in to your dashboard</p>
        </motion.div>

        <AuthCard
          glass
          className="relative overflow-hidden border-slate-700/50 bg-slate-900/40 backdrop-blur-2xl shadow-2xl shadow-black/80 w-full"
        >
          {/* Top Line Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 pt-2">
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3 overflow-hidden"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                <AuthInput
                  label="Email Address"
                  type="email"
                  placeholder="admin@careermapsolutions.com"
                  required
                  error={errors.email}
                  leftIcon={<Mail className="w-5 h-5 text-indigo-400" />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                  labelClassName="text-slate-400 font-medium"
                  inputClassName="bg-slate-950/50 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-white placeholder-slate-600 h-12"
                />

                <div className="space-y-1">
                  <AuthPasswordInput
                    label="Password"
                    placeholder="••••••••"
                    required
                    error={errors.password}
                    leftIcon={<Lock className="w-5 h-5 text-indigo-400" />}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={isLoading}
                    labelClassName="text-slate-400 font-medium"
                    inputClassName="bg-slate-950/50 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-white placeholder-slate-600 h-12"
                  />
                  <div className="flex justify-end">
                    <AuthLink to="/auth/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot Password?
                    </AuthLink>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <AuthButton
                  type="submit"
                  variant="premium"
                  loading={isLoading}
                  disabled={isLoading}
                  className="h-12 text-base font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-300"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
                </AuthButton>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f1522] px-2 text-slate-500">Secure Environment</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-3 h-3" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </form>
        </AuthCard>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-6 text-slate-600 text-sm font-medium"
        >
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
        </motion.div>
      </div>
    </div>
  );
}
