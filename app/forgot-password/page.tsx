'use client'

import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        <p className="text-gray-600 mb-6">
          Enter your email address below and we'll send you a password reset link.
        </p>

        <form className="space-y-4" style={{ maxWidth: 400 }} onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const email = formData.get('email') as string;
          try {
            const res = await fetch('/api/auth/forgot-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
              credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
              router.push('/');
            } else {
              alert(data.error || 'Something went wrong');
            }
          } catch (err) {
            alert('Something went wrong. Please try again.');
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}