'use client';

import React, { useState } from 'react';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import GlobalNavigation from '@/components/GlobalNavigation';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Request password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
	        // Route back into this app after password recovery
	        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/login?message=Password reset email sent!')}`,
      });

      if (resetError) {
        console.error('Password reset error:', resetError);
        setError(resetError.message || 'Failed to send password reset email');
        toast.error(resetError.message || 'Failed to send password reset email');
      } else {
        setSuccess(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GlobalNavigation
        userData={null}
        showBuilderActions={false}
        showMainNav={true}
        showAuthButtons={true}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Back to Login Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Card */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Email Sent!</h2>
                <p className="text-gray-400 mb-6">
                  Check your inbox at <span className="text-blue-400 font-medium">{email}</span> for password reset instructions.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <Link href="/contact-sales" className="text-blue-400 hover:text-blue-300">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

