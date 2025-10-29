import React from 'react';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock } from 'lucide-react';

/**
 * Example Login Form Component
 * Demonstrates how to use the reusable auth components
 */
export function LoginFormExample() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    // Add your login logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Welcome Back"
        description="Sign in to your account to continue"
      >
        <div className="space-y-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            error={errors.email}
            leftIcon={<Mail className="w-5 h-5" />}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <AuthLink to="/forgot-password">Forgot password?</AuthLink>
          </div>

          <AuthButton type="submit" variant="primary" loading={false}>
            Sign In
          </AuthButton>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <AuthLink to="/register">Sign up</AuthLink>
          </div>
        </div>
      </AuthCard>
    </form>
  );
}

