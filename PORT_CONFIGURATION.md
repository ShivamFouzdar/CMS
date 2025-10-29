# Port Configuration - Updated

## Current Configuration

### Server
- **Port**: `8000` (default)
- **Environment Variable**: `PORT=8000` in Server/.env
- **Start Command**: `npm run dev`

### Client
- **Port**: `5173` (Vite default)
- **API Base URL**: `http://localhost:8000` (default)
- **Environment Variable**: `VITE_API_BASE_URL=http://localhost:8000` in Client/.env

## Quick Start

### Terminal 1: Start Server
```bash
cd Server
npm run dev
```
Server will run on: **http://localhost:8000**

### Terminal 2: Start Client
```bash
cd Client
npm run dev
```
Client will run on: **http://localhost:5173**

## Configuration Files

### Server Configuration
**File**: `Server/src/index.ts`
```typescript
const PORT = process.env['PORT'] || 8000;
```

### Client Configuration
**File**: `Client/src/config/api.ts`
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

### Client `.env` (Create if needed)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## What Was Changed

1. ✅ Server port changed from 5000 to 8000
2. ✅ Client API base URL changed to 8000
3. ✅ CORS already configured for client origin

## CORS Configuration

Server allows these origins:
- `http://localhost:5173` ✅ (Vite client)
- `http://localhost:3000` (React default)
- `http://localhost:8001` (Custom port)
- `http://localhost:5174` (Vite alternative)

## Testing

1. **Start server**: `cd Server && npm run dev`
2. **Start client**: `cd Client && npm run dev`
3. **Test**: Go to `http://localhost:5173/auth/login`
4. **Submit form**: Homepage → "Find Your Dream Job"
5. **View admin**: Login → `/admin/job-applicants`

## Summary

✅ **Server**: Port 8000  
✅ **Client**: Calls http://localhost:8000  
✅ **CORS**: Configured  
✅ **Build**: Completed  

**Ready to use!** Start both servers and test! 🎉

