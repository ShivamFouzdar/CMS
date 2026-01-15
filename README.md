# CareerMap Solutions (CMS)

A modern Business Process Outsourcing (BPO) and Knowledge Process Outsourcing (KPO) web platform.

## Features

### Public Portal
- **Service Showcase**: BPO, KPO, Legal, Recruitment, IT, and Brand Promotion.
- **Dynamic SEO**: Optimized meta tags for all service pages.
- **Contact & Job Application**: Integrated forms for lead generation and recruitment.

### Admin Panel
- **Dashboard**: Real-time analytics and statistics.
- **Content Management**: Reorder services via Drag-and-Drop.
- **Media Library**: Searchable asset management with Type filtering.
- **Lead Management**: View and export Contact/Job submissions to CSV.
- **Role-Based Access Control (RBAC)**: Super Admin vs Editor roles.
- **Audit Logs**: Comprehensive tracking of user activities.

### Notification System
- **Architecture**: Event-driven architecture using `emailService` (NodeMailer) and `notificationService` (DB persistence).
- **Triggers**:
    - **New Contact/Lead**: Emails Admin (`CONTACT_EMAIL`) + DB Notification.
    - **Job Application**: Emails Admin (`CONTACT_EMAIL`) + DB Notification.
    - **System Alerts**: Critical errors logged to DB.
- **UI**: Real-time indication of unread notifications in the Admin Navbar.

## Security Features

- **RBAC**: Middleware protections ensuring only authorized roles access critical endpoints.
- **Two-Factor Authentication (2FA)**:
    - QR Code setup (TOTP) via Google Authenticator/Authy.
    - Enforced on Login if enabled.
    - Recovery codes not yet implemented (Future roadmap).
- **Password Policies**: Secure reset flow via Email tokens.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion, React Query.
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **Testing**: Vitest, Supertest (Integration tests).
- **Authentication**: JWT with Role-Based Middleware.

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
2.  **Install dependencies**

    ```bash
    # Client
    cd Client
    npm install

    # Server
    cd ../Server
    npm install
    ```

3.  **Environment Variables**

    Create `.env` in `Server/`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/cms
    JWT_SECRET=your_secret_key
    CLIENT_URL=http://localhost:5173
    CONTACT_EMAIL=admin@example.com
    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    # Email Config (NodeMailer)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email
    SMTP_PASS=your_app_password
    ```

    Create `.env` in `Client/`:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    VITE_APP_BASE_URL=http://localhost:5173
    ```

4.  **Run Development Servers**

    ```bash
    # In one terminal (Server)
    cd Server
    npm run dev

    # In another terminal (Client)
    cd Client
    npm run dev
    ```

## Testing

Using **Vitest** for backend integration tests.

```bash
cd Server
npm test
```

**Suites**:
- `jobApplication.routes.test.ts`: Verifies application submission, retrieval, and deletion.
- `services.routes.test.ts`: Verifies service creation, retrieval, and reordering.
- `notifications.test.ts`: Verifies email and system notification logic.

## Scripts

- **`npm run dev`**: Start development server.
- **`npm run build`**: Build for production.
- **`npm run preview`**: Preview production build.
- **`node scripts/generate-sitemap.js`**: Generate `sitemap.xml` (Client).

## Project Structure

- `Client/`: React Frontend
- `Server/`: Node.js Backend API
- `docs/`: Additional documentation
