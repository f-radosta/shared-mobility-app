"use client";

import Link from "next/link";

interface RidesPaginationProps {
  currentPage: number;
  totalPages: number;
  activeTab: string;
}

export function RidesPagination({ currentPage, totalPages, activeTab }: RidesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Create an array of page numbers to display
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/dashboard/my-rides?tab=${activeTab}&page=${page}`}
            className={`px-4 py-2 text-sm font-medium ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}
      </nav>
    </div>
  );
}
