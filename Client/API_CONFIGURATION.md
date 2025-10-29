# API Base URL Configuration

## ✅ Summary
Created centralized API configuration using base URL from environment variables.

## Files Created

### 1. `Client/src/config/api.ts`
Central API configuration file with:
- Base URL from environment variable
- All API endpoints
- Helper functions for authenticated calls
- Type-safe endpoint definitions

### 2. `.env.example`
Environment variable template

### 3. Updated Files
- ✅ `Login.tsx` - Uses `API_ENDPOINTS`
- ✅ `Register.tsx` - Uses `API_ENDPOINTS`
- ✅ `Dashboard.tsx` - Uses `API_ENDPOINTS`

## Setup Instructions

### Step 1: Create `.env` file in Client

Create `Client/.env` file with:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000
```

### Step 2: For Different Environments

#### Development
```env
VITE_API_BASE_URL=http://localhost:5000
```

#### Production
```env
VITE_API_BASE_URL=https://your-domain.com
```

#### Staging
```env
VITE_API_BASE_URL=https://staging.your-domain.com
```

## Base URL Values

### For Your Current Setup:

**Server:** `http://localhost:5000`

**Client:** `http://localhost:5173`

## Environment Variable

Set this in `Client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## How It Works

### 1. Configuration File
```typescript
// Client/src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### 2. Endpoints
```typescript
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    // ... more endpoints
  },
  // ... more sections
};
```

### 3. Usage in Components
```typescript
import { API_ENDPOINTS } from '@/config/api';

// Use in API calls
const response = await axios.post(API_ENDPOINTS.auth.login, {
  email: 'user@example.com',
  password: 'password'
});
```

## Benefits

✅ **Centralized Configuration** - One place to manage all API URLs  
✅ **Environment-Based** - Different URLs for dev/staging/prod  
✅ **Type-Safe** - TypeScript support  
✅ **Easy Updates** - Change base URL in one place  
✅ **No Hardcoding** - No hardcoded URLs in components  

## Available Endpoints

### Auth Endpoints
- `API_ENDPOINTS.auth.login`
- `API_ENDPOINTS.auth.register`
- `API_ENDPOINTS.auth.logout`
- `API_ENDPOINTS.auth.me`
- `API_ENDPOINTS.auth.refresh`
- `API_ENDPOINTS.auth.validate`

### Job Application Endpoints
- `API_ENDPOINTS.jobApplication.submit`
- `API_ENDPOINTS.jobApplication.getAll`
- `API_ENDPOINTS.jobApplication.getById(id)`
- `API_ENDPOINTS.jobApplication.stats`
- `API_ENDPOINTS.jobApplication.downloadResume(id)`
- `API_ENDPOINTS.jobApplication.delete(id)`

### Contact Endpoints
- `API_ENDPOINTS.contact.submit`
- `API_ENDPOINTS.contact.submissions`

### Services Endpoints
- `API_ENDPOINTS.services.getAll`
- `API_ENDPOINTS.services.getBySlug(slug)`

### Reviews Endpoints
- `API_ENDPOINTS.reviews.getAll`
- `API_ENDPOINTS.reviews.getById(id)`
- `API_ENDPOINTS.reviews.submit`

## Example Usage

### Login Component
```typescript
import { API_ENDPOINTS } from '@/config/api';

const response = await axios.post(API_ENDPOINTS.auth.login, {
  email: formData.email,
  password: formData.password,
});
```

### Dashboard Component
```typescript
import { API_ENDPOINTS } from '@/config/api';

const response = await axios.get(API_ENDPOINTS.jobApplication.stats, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Quick Setup

1. **Create `.env` file in Client folder:**
```bash
cd Client
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

2. **Restart your dev server:**
```bash
npm run dev
```

3. **That's it!** Now all API calls use the base URL from `.env`

## Testing

After setting up, test the login:
1. Go to `http://localhost:5173/auth/login`
2. Email: `admin@careermapsolutions.com`
3. Password: `Admin@123`
4. Should work now! ✅

## Summary

✅ **Base URL configured** - `http://localhost:5000`  
✅ **Environment variable** - Set in `.env`  
✅ **All components updated** - Using `API_ENDPOINTS`  
✅ **Type-safe** - Full TypeScript support  
✅ **Easy to change** - Update `.env` for different environments  

**Ready to use!** 🎉

