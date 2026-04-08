'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          Welcome!
        </h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-block rounded-md bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}