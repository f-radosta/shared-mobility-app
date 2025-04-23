"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, Car, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Shared Mobility
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/")
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive("/dashboard")
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  {session.user.role === "DRIVER" && (
                    <Link
                      href="/dashboard/vehicles"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname.startsWith("/dashboard/vehicles")
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      My Vehicles
                    </Link>
                  )}
                  
                  {session.user.role === "DRIVER" ? (
                    <Link
                      href="/dashboard/rides"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname.startsWith("/dashboard/rides")
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      Manage Rides
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/my-rides"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname.startsWith("/dashboard/my-rides")
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      My Rides
                    </Link>
                  )}
                  
                  {session.user.role === "PASSENGER" && (
                    <Link
                      href="/dashboard/request-ride"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname.startsWith("/dashboard/request-ride")
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      Request Ride
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* User menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
                <a
                  href="/api/auth/signout"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/")
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Home
            </Link>
            
            {session && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/dashboard")
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Dashboard
                </Link>
                
                {session.user.role === "DRIVER" && (
                  <Link
                    href="/dashboard/vehicles"
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname.startsWith("/dashboard/vehicles")
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    My Vehicles
                  </Link>
                )}
                
                {session.user.role === "DRIVER" ? (
                  <Link
                    href="/dashboard/rides"
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname.startsWith("/dashboard/rides")
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Manage Rides
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/my-rides"
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname.startsWith("/dashboard/my-rides")
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    My Rides
                  </Link>
                )}
                
                {session.user.role === "PASSENGER" && (
                  <Link
                    href="/dashboard/request-ride"
                    onClick={closeMenu}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname.startsWith("/dashboard/request-ride")
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Request Ride
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {session.user.name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <a
                    href="/api/auth/signout"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                    onClick={closeMenu}
                  >
                    Sign out
                  </a>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-2 py-2 rounded-md"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block text-base font-medium text-indigo-600 hover:text-indigo-800 px-2 py-2 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
