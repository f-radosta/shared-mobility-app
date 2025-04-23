"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to check if user is authenticated
 * @returns Object containing authentication state and user data
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  
  return {
    isAuthenticated,
    isLoading,
    session,
    user: session?.user,
    isDriver: session?.user?.role === "DRIVER",
    isPassenger: session?.user?.role === "PASSENGER",
  };
}

/**
 * Hook to protect client components that require authentication
 * @param redirectTo Path to redirect to if not authenticated
 */
export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);
  
  return { isAuthenticated, isLoading };
}

/**
 * Hook to protect client components that require a specific role
 * @param requiredRole Role required to access the component
 * @param redirectTo Path to redirect to if not authorized
 */
export function useRequireRole(requiredRole: string, redirectTo = "/dashboard") {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== requiredRole) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requiredRole, redirectTo, router, user?.role]);
  
  return { isAuthenticated, isLoading, hasRequiredRole: user?.role === requiredRole };
}
