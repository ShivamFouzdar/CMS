import React from 'react';
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock, User, Phone } from 'lucide-react';

/**
 * Example Register Form Component
 * Demonstrates how to use the reusable auth components for registration
 */
export function RegisterFormExample() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
    // Add your registration logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <AuthCard
        title="Create Account"
        description="Sign up to get started with CareerMap Solutions"
      >
        <div className="space-y-4">
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
            />
          </div>

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

          <AuthInput
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            leftIcon={<Phone className="w-5 h-5" />}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
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
          />

          <div className="text-sm text-gray-600">
            By signing up, you agree to our{' '}
            <AuthLink to="/terms" variant="muted">Terms of Service</AuthLink>{' '}
            and{' '}
            <AuthLink to="/privacy" variant="muted">
              Privacy Policy
            </AuthLink>
          </div>

          <AuthButton type="submit" variant="primary" loading={false}>
            Create Account
          </AuthButton>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <AuthLink to="/login">Sign in</AuthLink>
          </div>
        </div>
      </AuthCard>
    </form>
  );
}

