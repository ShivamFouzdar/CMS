# CMS Server

A modern Express.js + TypeScript backend server for the CMS application.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript
- **Security** - Helmet for security headers
- **CORS** - Cross-origin resource sharing
- **Compression** - Gzip compression
- **Logging** - Morgan HTTP request logger
- **Error Handling** - Centralized error handling
- **Environment Variables** - Dotenv configuration

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   ├── cors.ts      # CORS configuration
│   └── helmet.ts    # Security configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
│   ├── errorHandler.ts
│   └── notFoundHandler.ts
├── routes/          # API routes
│   ├── health.ts    # Health check routes
│   └── api.ts       # Main API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   └── helpers.ts   # Common helper functions
└── index.ts         # Main server file
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your configuration

## 🚀 Development

Start the development server with hot reload:
```bash
npm run dev
```

Start with file watching:
```bash
npm run dev:watch
```

## 🏗️ Build

Build the TypeScript code:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system information

### API Routes
- `GET /api` - API information

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |

## 🛡️ Security

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Sanitization and validation utilities
- **Error Handling** - Secure error responses

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run dev:watch` - Start with file watching
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 🔮 Future Features

- Database integration (MongoDB/PostgreSQL)
- Authentication & Authorization
- File upload handling
- Rate limiting
- API documentation
- Testing suite
- Docker support
