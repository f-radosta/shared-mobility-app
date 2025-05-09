import { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p className="mb-2">
            <strong>This web application is a student course project.</strong>
          </p>
          <p>&copy; {new Date().getFullYear()} Shared Mobility App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
