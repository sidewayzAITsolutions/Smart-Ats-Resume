// app/signup/page.tsx
'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Mail,
  Target,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { createClient } from '@/lib/supabase/client';

export default function SignupPage(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, redirecting to templates');
        toast.success('Welcome! Redirecting to templates...');
        router.push('/templates');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Check for required character types based on Supabase requirements
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password);

    if (!hasLowercase || !hasUppercase || !hasNumbers || !hasSpecialChars) {
      setError('Password must contain at least one lowercase letter, uppercase letter, number, and special character (!@#$%^&*()_+-=[]{}|;\':",./<>?)');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup process...');

	      // Ensure Supabase confirmation links return to *this* app (not a stale Site URL like localhost)
	      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/templates')}`;

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
	          emailRedirectTo,
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        console.log('User created:', data.user);

        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // Email confirmation is disabled - user is immediately confirmed
          console.log('Email confirmation disabled, user is confirmed');

          try {
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              is_premium: false,
              // subscription_status intentionally omitted for free users (NULL is allowed)
            });
            console.log('Profile created successfully');
          } catch (profileError) {
            console.error('Profile creation error:', profileError);
            // Don't fail the signup for profile creation errors
          }

          toast.success('Account created successfully!');
          router.push('/templates');
        } else {
          // Email confirmation is enabled - user needs to check email
          console.log('Email confirmation required');
          toast.success('Account created! Please check your email to confirm your account, then return to sign in.');
          // Don't redirect immediately, let the user see the success message
          setTimeout(() => {
            router.push('/login?message=' + encodeURIComponent('Please check your email to confirm your account, then sign in here.'));
          }, 2000);
        }
      } else {
        console.error('No user data returned from signup');
        setError('Failed to create account - no user data returned');
        toast.error('Failed to create account');
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      setError('An unexpected error occurred');
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const strengthColor = {
    weak: 'text-red-500',
    medium: 'text-yellow-500',
    strong: 'text-green-500'
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
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8"><div><Target className="w-8 h-8 text-blue-500" /><span className="text-2xl font-bold text-white">SmartATS</span></div></Link>

        {/* Signup Form */}
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Create Your Account
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Start optimizing your resume with AI that delivers results
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {password && (
                <p className={`text-xs mt-1 ${strengthColor[passwordStrength() || 'weak']}`}>
                  Password strength: {passwordStrength()}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must include: uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                {confirmPassword && confirmPassword === password && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Free account includes:</p>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2 text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Real-time ATS scoring</span>
              </li>
              <li className="flex items-center space-x-2 text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>3 resume saves per day</span>
              </li>
              <li className="flex items-center space-x-2 text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Basic keyword analysis</span>
              </li>
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
