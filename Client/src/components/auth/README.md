# Reusable Auth Components

## Overview
A collection of reusable authentication UI components designed for maximum flexibility and reusability across login and register forms.

## Components

### 1. **AuthCard**
A reusable card container for authentication forms.

**Props:**
```typescript
interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}
```

**Usage:**
```tsx
<AuthCard
  title="Welcome Back"
  description="Sign in to your account"
>
  {/* Form content */}
</AuthCard>
```

### 2. **AuthInput**
A reusable text input component with label, error handling, and icons.

**Props:**
```typescript
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}
```

**Usage:**
```tsx
<AuthInput
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
  error={errors.email}
  leftIcon={<Mail className="w-5 h-5" />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### 3. **AuthPasswordInput**
A password input with show/hide toggle functionality.

**Props:**
```typescript
interface AuthPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}
```

**Usage:**
```tsx
<AuthPasswordInput
  label="Password"
  placeholder="Enter your password"
  required
  error={errors.password}
  leftIcon={<Lock className="w-5 h-5" />}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### 4. **AuthButton**
A reusable button component with loading states and variants.

**Props:**
```typescript
interface AuthButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}
```

**Usage:**
```tsx
<AuthButton
  type="submit"
  variant="primary"
  loading={isLoading}
  fullWidth
>
  Sign In
</AuthButton>
```

### 5. **AuthLink**
A styled link component for navigation within auth flows.

**Props:**
```typescript
interface AuthLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted';
}
```

**Usage:**
```tsx
<AuthLink to="/register">Sign up</AuthLink>
<AuthLink to="/forgot-password" variant="muted">Forgot password?</AuthLink>
```

## Complete Examples

### Login Form
```tsx
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
import { Mail, Lock } from 'lucide-react';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  return (
    <form onSubmit={handleSubmit}>
      <AuthCard title="Welcome Back" description="Sign in to your account">
        <div className="space-y-4">
          <AuthInput
            label="Email"
            type="email"
            leftIcon={<Mail />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <AuthPasswordInput
            label="Password"
            leftIcon={<Lock />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          <AuthButton type="submit">Sign In</AuthButton>
          
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <AuthLink to="/register">Sign up</AuthLink>
          </div>
        </div>
      </AuthCard>
    </form>
  );
}
```

### Register Form
```tsx
function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <AuthCard title="Create Account" description="Get started today">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            
            <AuthInput
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          
          <AuthInput
            label="Email"
            type="email"
            leftIcon={<Mail />}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <AuthPasswordInput
            label="Password"
            leftIcon={<Lock />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          <AuthButton type="submit">Create Account</AuthButton>
          
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <AuthLink to="/login">Sign in</AuthLink>
          </div>
        </div>
      </AuthCard>
    </form>
  );
}
```

## Features

### ✅ **Reusability**
- Use same components for login and register
- Consistent styling across forms
- Easy to maintain and update

### ✅ **Flexibility**
- Customizable with className props
- Support for icons on left and right
- Multiple button variants

### ✅ **Accessibility**
- Proper ARIA labels
- Required field indicators
- Error messages with proper IDs

### ✅ **User Experience**
- Password visibility toggle
- Loading states
- Form validation errors
- Clear visual feedback

## File Structure

```
src/components/auth/
├── AuthCard.tsx              # Card container
├── AuthInput.tsx             # Text input
├── AuthPasswordInput.tsx    # Password input with toggle
├── AuthButton.tsx            # Button component
├── AuthLink.tsx              # Link component
├── index.ts                  # Barrel exports
├── examples/
│   ├── LoginForm.example.tsx
│   └── RegisterForm.example.tsx
└── README.md                 # This file
```

## Usage Tips

1. **Icons**: Use `lucide-react` for consistent icons
2. **Styling**: All components accept `className` prop for customization
3. **Validation**: Show errors in the `error` prop
4. **Loading**: Use `loading` prop on button during submission
5. **Responsive**: Components are mobile-friendly by default

## Best Practices

### ✅ DO
- Use these components for all auth forms
- Provide clear error messages
- Add proper validation
- Use loading states during submission

### ❌ DON'T
- Don't duplicate these components
- Don't remove accessibility features
- Don't hard-code values (use props)

## Integration

All components are ready to use:

```tsx
import { AuthCard, AuthInput, AuthPasswordInput, AuthButton, AuthLink } from '@/components/auth';
```

Simply import and use in your login/register pages!

## Summary

✅ **AuthCard** - Reusable card for auth forms  
✅ **AuthInput** - Text input with icons and errors  
✅ **AuthPasswordInput** - Password with visibility toggle  
✅ **AuthButton** - Button with loading states  
✅ **AuthLink** - Styled links for navigation  
✅ **Examples** - Complete form examples  
✅ **Fully reusable** - Use for any auth flow  

**All components created and ready to use!** 🎉

