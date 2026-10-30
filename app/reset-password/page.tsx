'use client'

import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {token ? 'Reset Password' : 'Invalid Reset Link'}
        </h2>

        <div style={{ maxWidth: 400 }}>
          {token ? (
            <form>
              <div className="space-y-4">
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="New password"
                  required
                />
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">Password reset link is invalid or expired.</p>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          <a
            href="/forgot-password"
            className="text-primary-600 hover:text-primary-500 transition-colors"
          >
            Request a new reset link
          </a>
        </p>
      </div>
    </div>
  );
}