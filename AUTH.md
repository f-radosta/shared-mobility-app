# Authentication System Documentation

This document provides a comprehensive overview of the authentication and authorization system implemented in the Shared Mobility App.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [User Authentication Flow](#user-authentication-flow)
4. [Password Security](#password-security)
5. [Session Management](#session-management)
6. [Role-Based Access Control](#role-based-access-control)
7. [Middleware Protection](#middleware-protection)
8. [API Route Security](#api-route-security)
9. [Client-Side Authentication](#client-side-authentication)
10. [Server-Side Authentication](#server-side-authentication)
11. [Security Considerations](#security-considerations)
12. [Testing Authentication](#testing-authentication)

## Overview

The Shared Mobility App implements a secure authentication system that allows users to register, login, and access role-specific features. The system enforces proper authorization checks to ensure users can only access and modify their own data.

Key features:
- Secure user registration with email validation
- Password-based authentication with strong hashing
- Role-based access control (Passenger/Driver)
- Protected API routes and client-side components
- Persistent sessions with secure JWT tokens
- Conditional UI rendering based on authentication state

## Technology Stack

The authentication system uses the following technologies:

- **NextAuth.js**: Core authentication framework with JWT strategy
- **Prisma**: Database ORM for user storage and retrieval (direct queries, no adapter)
- **bcryptjs**: Secure password hashing
- **Zod**: Input validation for registration and login
- **React Hook Form**: Form handling and client-side validation
- **JWT**: JSON Web Tokens for secure session management

## User Authentication Flow

### Registration Flow

1. User fills out the registration form with:
   - Name
   - Email
   - Password (with confirmation)
   - Role selection (Passenger or Driver)

2. Client-side validation ensures:
   - Email is properly formatted
   - Password meets complexity requirements
   - Password confirmation matches
   - All required fields are filled

3. Form data is submitted to `/api/auth/register` endpoint

4. Server-side validation with Zod verifies input data

5. System checks if the email is already registered

6. Password is securely hashed using bcrypt

7. New user record is created in the database

8. User is automatically logged in and redirected to the dashboard

### Login Flow

1. User enters email and password on the login form

2. Form data is submitted to NextAuth.js endpoint

3. System retrieves the user record by email

4. Password is verified against the stored hash using bcrypt

5. If authentication succeeds:
   - JWT session token is generated
   - User is automatically logged in and redirected to the dashboard (default destination)
   - Session is persisted in browser

6. If authentication fails:
   - Error message is displayed
   - User remains on login page

## Password Security

The system implements strong password security measures:

- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

- **Password Hashing**:
  - Uses bcrypt with a cost factor of 10
  - Unique salt generated for each password
  - Original passwords never stored in the database

Example of password hashing implementation:
```typescript
// Generate a salt with cost factor 10
const salt = await bcrypt.genSalt(10);
// Hash the password with the generated salt
const hashedPassword = await bcrypt.hash(password, salt);
```

## Session Management

Sessions are managed using JWT (JSON Web Tokens):

- **Session Configuration**:
  - JWT strategy for stateless authentication
  - 30-day session expiry
  - Secure HTTP-only cookies
  - CSRF protection built into NextAuth.js

- **Session Data**:
  - User ID
  - User email
  - User name (if available)
  - User role (Passenger/Driver)

- **Session Provider**:
  - Wraps the application to provide session context
  - Makes authentication state available throughout the app

## Role-Based Access Control

The system implements role-based access control (RBAC) with two primary roles:

- **Passenger**: Can browse vehicles, request rides, and manage their ride history
- **Driver**: Can manage vehicles, accept/reject ride requests, and view ride history

Role-specific access is enforced at multiple levels:

1. **UI Level**: Conditional rendering based on user role
2. **Client-Side**: Route protection with redirects
3. **Server-Side**: API route protection
4. **Middleware**: Global route protection

## Middleware Protection

The application uses Next.js middleware to protect routes based on authentication status and user roles:

- **Public Routes**: Accessible to all users (home page, login, register)
- **Protected Routes**: Require authentication (dashboard, profile)
- **Role-Specific Routes**: Require specific roles (vehicle management for drivers)

The middleware automatically redirects unauthorized users to the appropriate page:
- Unauthenticated users → Login page
- Authenticated but unauthorized users → Dashboard

## API Route Security

API routes are protected through multiple security layers:

1. **Authentication Check**: Verifies the user is logged in
2. **Role Verification**: Ensures the user has the required role
3. **Ownership Validation**: Confirms the user owns the requested resource
4. **Input Validation**: Validates and sanitizes all input data
5. **Error Handling**: Returns appropriate error responses

Example of a protected API route:
```typescript
export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Get user's vehicles (only for drivers)
    if (session.user.role !== "DRIVER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
    });
    
    return NextResponse.json({ vehicles });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Client-Side Authentication

The application uses client components with the "use client" directive for authentication pages and forms. This ensures proper handling of client-side state and event handlers.

The application provides several utilities for client-side authentication:

### useAuth Hook

A custom hook that provides authentication state and user information:

```typescript
const { 
  isAuthenticated, 
  isLoading, 
  user, 
  isDriver, 
  isPassenger 
} = useAuth();
```

### useRequireAuth Hook

Protects client components by redirecting unauthenticated users:

```typescript
const { isAuthenticated, isLoading } = useRequireAuth("/login");

if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return null;

return <ProtectedComponent />;
```

### useRequireRole Hook

Ensures users have the required role to access a component:

```typescript
const { hasRequiredRole } = useRequireRole("DRIVER", "/dashboard");

if (!hasRequiredRole) return null;

return <DriverOnlyComponent />;
```

### ProtectedContent Component

A component that conditionally renders content based on authentication state:

```tsx
<ProtectedContent
  requiredRole="DRIVER"
  fallback={<AccessDeniedMessage />}
>
  <DriverDashboard />
</ProtectedContent>
```

## Server-Side Authentication

Server components can use these utilities for authentication:

### getSession

Retrieves the current session:

```typescript
const session = await getSession();
```

### getCurrentUser

Gets the current authenticated user:

```typescript
const user = await getCurrentUser();
```

### requireAuth

Ensures the user is authenticated or redirects:

```typescript
const session = await requireAuth("/login");
```

### requireRole

Ensures the user has the required role or redirects:

```typescript
const session = await requireRole("DRIVER", "/dashboard");
```

## Security Considerations

The authentication system implements several security best practices:

- **Password Security**: Strong hashing with bcrypt and salt
- **Input Validation**: Both client and server-side validation
- **CSRF Protection**: Built into NextAuth.js
- **XSS Protection**: React's built-in protection and proper escaping
- **Session Security**: HTTP-only cookies and JWT
- **Rate Limiting**: Prevents brute force attacks (implemented by NextAuth.js)
- **Secure Redirects**: Validated redirect URLs
- **Error Handling**: Generic error messages to prevent information leakage

## Testing Authentication

To test the authentication system:

1. **Register a new account**:
   - Visit `/register`
   - Fill out the form with valid information
   - Select either Passenger or Driver role
   - Upon successful registration, you'll be automatically logged in and redirected to the dashboard

2. **Login with credentials**:
   - Visit `/login`
   - Enter email and password
   - You should be redirected to the dashboard

3. **Test role-based access**:
   - As a Driver: You should see vehicle management options
   - As a Passenger: You should see ride booking options

4. **Test protected routes**:
   - Try accessing `/dashboard` without logging in
   - You should be redirected to the login page

5. **Test session persistence**:
   - Login and close the browser
   - Reopen and visit the application
   - You should still be logged in

---

This authentication system provides a secure, robust foundation for the Shared Mobility App, ensuring that users can safely register, login, and access appropriate features based on their role.
