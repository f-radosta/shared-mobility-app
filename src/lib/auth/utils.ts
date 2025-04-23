import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./index";

/**
 * Get the current session on the server
 * @returns The current session or null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user is authenticated on the server
 * @returns The session if authenticated, null otherwise
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Require authentication for server components
 * @param redirectTo Path to redirect to if not authenticated
 * @returns The session if authenticated
 */
export async function requireAuth(redirectTo = "/login") {
  const session = await getSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Require a specific role for server components
 * @param requiredRole Role required to access the component
 * @param redirectTo Path to redirect to if not authorized
 * @returns The session if authenticated and authorized
 */
export async function requireRole(requiredRole: string, redirectTo = "/dashboard") {
  const session = await requireAuth();
  
  if (session.user.role !== requiredRole) {
    redirect(redirectTo);
  }
  
  return session;
}
