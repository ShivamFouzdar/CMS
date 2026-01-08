# API Documentation Guide - CareerMap Solutions

This guide explains how to use the interactive API documentation (Swagger/OpenAPI) for the CareerMap Solutions CMS Backend.

## 1. Accessing the Documentation

While the server is running, you can access the interactive documentation at:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 2. Interface Overview

### Tags (Categories)
The API is organized by functional tags:
- **Health**: System status and connectivity checks.
- **Auth**: User registration, login, and token management.
- **TwoFactor**: Setup and verification of 2FA.
- **Users**: User profile management (Admin & Self).
- **Services**: Service offerings and management.
- **Contacts**: Lead management and contact submissions.
- **Reviews**: Customer testimonials and reviews.
- **Admin**: Dashboard stats and system tools.

### Schemas
At the bottom of the page, you'll find **Schemas**. This defines the structure of data sent to and received from the API.
- **ApiResponse**: The global wrapper for all responses.

---

## 3. Standard Response Structure

All API responses follow a consistent JSON structure (`ApiResponse`):

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-01-07T12:00:00.000Z"
}
```

- **success**: Boolean indicating if the request succeeded.
- **message**: User-friendly description of the result.
- **data**: (Optional) The payload containing the requested information.
- **error**: (Optional) Error details, visible only in development mode.

---

## 4. How to Test Endpoints ("Try it out")

1.  **Select an Endpoint**: Click on any API route (e.g., `GET /health`).
2.  **Enter Parameters**: Click the **"Try it out"** button. If the route has parameters (like `:id` or query params), enter them in the fields provided.
3.  **Execute**: Click the big blue **"Execute"** button.
4.  **View Response**: Scroll down to see the **Server Response**, including the Status Code, Response Body, and Headers.

---

## 5. Authentication (JWT)

Most routes (Admin/Protected) require a JWT Bearer Token.

### How to Authenticate:
1.  **Login**: Use the `POST /api/auth/login` endpoint (under the **Auth** tag) to get an `accessToken`.
2.  **Authorize**: Click the green **"Authorize"** button at the top of the Swagger UI.
3.  **Enter Token**: In the popup, enter your token in the Value field:
    `eyJhbGciOiJIUzI1...` (Paste the access token directly).
4.  **Complete**: Click **Authorize**, then **Close**. 
5.  **Locked Icons**: You will see the "Lock" icons on protected routes closed, meaning you can now call them.

---

## 6. Common Status Codes

- **200 OK**: Request succeeded.
- **201 Created**: Resource created successfully (e.g., after a POST).
- **400 Bad Request**: Invalid input data (Validation failure).
- **401 Unauthorized**: Missing or invalid authentication token.
- **403 Forbidden**: You don't have permission (e.g., trying to access Admin routes as a Viewer).
- **404 Not Found**: The requested resource does not exist.
- **500 Internal Server Error**: A server-side error occurred.

---

> [!TIP]
> Use the **Health** endpoints first to verify that your connection to the database and system metrics are operational before testing complex business logic.
