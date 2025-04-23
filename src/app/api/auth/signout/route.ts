import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      // If no session, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Clear cookies to sign out
    const response = NextResponse.redirect(new URL("/", request.url));
    
    // Clear the session cookie
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    
    // Also clear the callback URL cookie if it exists
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("__Secure-next-auth.callback-url");
    
    return response;
  } catch (error) {
    console.error("Error during sign out:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
