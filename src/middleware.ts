import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/register",
];

// Paths that require specific roles
const roleRestrictedPaths = {
  "/dashboard/vehicles": ["DRIVER"],
  "/api/vehicles": ["DRIVER"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check if the path is an API route for NextAuth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  
  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If no token, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Check role-based access for specific paths
  for (const [path, roles] of Object.entries(roleRestrictedPaths)) {
    if (pathname.startsWith(path) && !roles.includes(token.role as string)) {
      // Redirect to dashboard if user doesn't have the required role
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except static files, images, and other assets
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$).*)",
  ],
};
