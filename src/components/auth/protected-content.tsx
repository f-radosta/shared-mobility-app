"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/utils/auth";

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: "DRIVER" | "PASSENGER";
}

/**
 * Component that conditionally renders content based on authentication state and user role
 */
export default function ProtectedContent({
  children,
  fallback = null,
  requiredRole,
}: ProtectedContentProps) {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, show fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // If role is required but user doesn't have it, show fallback
  if (requiredRole && user?.role !== requiredRole) {
    return <>{fallback}</>;
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
}
