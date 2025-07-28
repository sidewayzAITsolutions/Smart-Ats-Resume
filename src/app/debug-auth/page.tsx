'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const supabase = createClient();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG AUTH] ${message}`);
  };

  useEffect(() => {
    addLog('Debug auth page mounted');

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        addLog(`Initial session check - Session: ${session?.user?.email || 'none'}, Error: ${error?.message || 'none'}`);
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        addLog(`Error getting initial session: ${error}`);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state change: ${event}, User: ${session?.user?.email || 'none'}`);
      setAuthState(event);
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      addLog('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const testSignUp = async () => {
    addLog('Testing sign up...');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        options: {
          data: {
            full_name: 'Test User',
          }
        }
      });
      addLog(`Sign up result - User: ${data.user?.email || 'none'}, Error: ${error?.message || 'none'}`);
    } catch (error) {
      addLog(`Sign up error: ${error}`);
    }
  };

  const testSignIn = async () => {
    addLog('Testing sign in...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'TestPassword123!',
      });
      addLog(`Sign in result - User: ${data.user?.email || 'none'}, Error: ${error?.message || 'none'}`);
    } catch (error) {
      addLog(`Sign in error: ${error}`);
    }
  };

  const testSignOut = async () => {
    addLog('Testing sign out...');
    try {
      const { error } = await supabase.auth.signOut();
      addLog(`Sign out result - Error: ${error?.message || 'none'}`);
    } catch (error) {
      addLog(`Sign out error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current State */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Auth Event:</strong> {authState || 'None'}</p>
              <p><strong>User Email:</strong> {user?.email || 'None'}</p>
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
              <p><strong>Email Confirmed:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
              <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testSignUp}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Sign Up
              </button>
              <button
                onClick={testSignIn}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Test Sign In
              </button>
              <button
                onClick={testSignOut}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Test Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black p-4 rounded text-green-400 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>

        {/* Environment Check */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
            <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
