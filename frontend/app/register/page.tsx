'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Basic validation
    if (!account.trim() || !password.trim()) {
      setError('Account and password are required');
      return;
    }

    setError('');

    try {
      // Check if account already exists
      const res = await fetch('/api/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      const data = await res.json();

      if (data.exists) {
        setError('Account already registered.');
        return;
      }

      // Navigate to nickname page with account and pin as query params
      router.push(`/nickname?account=${encodeURIComponent(account)}&pin=${encodeURIComponent(password)}`);
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create account</h1>

        <div>
          <div className="mb-4">
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <input
              type="text"
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Choose an account name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Create a password"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleRegister}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}