import { ReactNode } from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Shared Mobility App",
  description: "Login or register to your shared mobility account",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Branding/Info */}
      <div className="hidden md:flex bg-indigo-600 text-white flex-col justify-between p-10">
        <div>
          <Link href="/" className="text-xl font-bold">
            Shared Mobility
          </Link>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            Your journey starts here
          </h1>
          <p className="text-lg">
            Connect with drivers and passengers in your area for convenient, 
            affordable, and sustainable transportation.
          </p>
        </div>
        
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Shared Mobility App
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
