'use client';

import React, {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { toast } from 'react-hot-toast';

import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get redirect URL from query params
  const next = searchParams.get('next') || '/templates';
  const message = searchParams.get('message');
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
    }
  }, [message, errorParam]);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(next);
      }
    };
    checkUser();
  }, [router, next, supabase]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Login page - Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, redirecting to:', next);
        toast.success('Welcome back!');
        router.push(next);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, next, supabase.auth]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation - minimal for auth pages */}
      <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 shadow-lg">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src="/horse-logo.png"
                alt="SmartATS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
              SmartATS
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <Target className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">SmartATS</span>
          </Link>

          {/* Login Form */}
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={async (e: React.FormEvent) => {
              e.preventDefault();
              setError('');
              setLoading(true);

            try {
              console.log('Attempting to sign in with email:', email);

              const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              console.log('Sign in response:', { user: data.user?.email, error });

              if (error) {
                console.error('Sign in error:', error);
                setError(error.message);
                toast.error(error.message);
              } else if (data.user) {
                console.log('Sign in successful, user:', data.user.email);
                // Don't redirect here, let the auth state listener handle it
                toast.success('Signing you in...');
              } else {
                console.error('No user data returned from sign in');
                setError('Sign in failed - no user data returned');
                toast.error('Sign in failed');
              }
            } catch (error) {
              console.error('Unexpected login error:', error);
              setError('An unexpected error occurred');
              toast.error('Failed to sign in');
            } finally {
              setLoading(false);
            }
          }} className="space-y-4">
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
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-4 w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-3 border border-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up for free
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}


