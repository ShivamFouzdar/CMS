# Complete Setup Instructions

## Environment Configuration

### ✅ Base URL Configuration Complete

All API calls now use a centralized base URL from environment variables.

## Quick Setup

### Step 1: Create Client `.env` File

Create `Client/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 2: Environment Variables

**Client - `Client/.env`:**
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000

# Optional - Analytics
# VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Server - `Server/.env` (create if doesn't exist):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8001

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Database (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/cms_db
```

## Base URL Values

### Default (Development)
```
Client Base URL: http://localhost:5173
Server Base URL: http://localhost:5000
```

### Production
```
Client Base URL: https://yourdomain.com
Server Base URL: https://api.yourdomain.com
```

### Custom Ports
If your server runs on a different port:
```env
# In Client/.env
VITE_API_BASE_URL=http://localhost:YOUR_PORT
```

## How to Use

### 1. Start the Server
```bash
cd Server
npm run dev
```
Server will run on `http://localhost:5000`

### 2. Start the Client
```bash
cd Client
npm run dev
```
Client will run on `http://localhost:5173`

### 3. Access Login
```
http://localhost:5173/auth/login
```

### 4. Login Credentials
```
Email: admin@careermapsolutions.com
Password: Admin@123
```

## What Changed

### ✅ Created Files
1. `Client/src/config/api.ts` - Central API configuration
2. `Client/API_CONFIGURATION.md` - Configuration guide
3. `Client/.env.example` - Environment template

### ✅ Updated Files
1. `Login.tsx` - Uses `API_ENDPOINTS.auth.login`
2. `Register.tsx` - Uses `API_ENDPOINTS.auth.register`
3. `Dashboard.tsx` - Uses `API_ENDPOINTS.jobApplication.stats`

### ✅ Fixed CORS
- Added `http://localhost:5173` to allowed origins
- Updated `Server/src/index.ts`

## API Endpoints Available

### Authentication
```typescript
import { API_ENDPOINTS } from '@/config/api';

API_ENDPOINTS.auth.login      // POST
API_ENDPOINTS.auth.register    // POST
API_ENDPOINTS.auth.logout      // POST
API_ENDPOINTS.auth.me          // GET
API_ENDPOINTS.auth.refresh     // POST
```

### Job Applications
```typescript
API_ENDPOINTS.jobApplication.submit
API_ENDPOINTS.jobApplication.getAll
API_ENDPOINTS.jobApplication.getById(id)
API_ENDPOINTS.jobApplication.stats
```

### Other Endpoints
```typescript
API_ENDPOINTS.contact.submit
API_ENDPOINTS.services.getAll
API_ENDPOINTS.reviews.getAll
```

## Usage Example

```typescript
import { API_ENDPOINTS } from '@/config/api';
import axios from 'axios';

// Login
const response = await axios.post(API_ENDPOINTS.auth.login, {
  email: 'user@example.com',
  password: 'password123'
});

// Get stats (with auth)
const stats = await axios.get(API_ENDPOINTS.jobApplication.stats, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Environment-Specific Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Staging
```env
VITE_API_BASE_URL=https://staging-api.yourdomain.com
```

### Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Troubleshooting

### CORS Errors
- Check that server allows your client origin
- Update `Server/src/index.ts` if needed

### API Connection Failed
- Verify server is running on correct port
- Check `.env` file exists and has correct URL
- Restart dev server after changing `.env`

### Environment Variables Not Loading
- Vite uses `VITE_` prefix
- Restart dev server after `.env` changes
- Check file is in `Client/` directory

## Summary

✅ **Base URL configured** - From `.env` file  
✅ **All components updated** - Using `API_ENDPOINTS`  
✅ **CORS fixed** - Client origin allowed  
✅ **Type-safe** - Full TypeScript support  
✅ **Environment-based** - Easy to switch environments  

**Set `.env` file and you're ready to go!** 🎉

