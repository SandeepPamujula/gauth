"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              MyApp
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session && (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

