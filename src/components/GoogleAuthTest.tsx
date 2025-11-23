'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

export default function GoogleAuthTest() {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const supabase = createClient();

  const testGoogleAuth = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log('🔍 Testing Google OAuth...');

      // Get current URL info
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/auth/callback`;

      console.log('📍 Current URL:', currentUrl);
      console.log('📍 Redirect URL:', redirectUrl);

      // Test OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      const info = {
        currentUrl,
        redirectUrl,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        oauthData: data,
        oauthError: error,
        timestamp: new Date().toISOString()
      };

      setDebugInfo(info);
      console.log('🔍 Debug Info:', info);

      if (error) {
        console.error('❌ OAuth Error:', error);
        toast.error(`OAuth Error: ${error.message}`);
      } else {
        console.log('✅ OAuth initiated successfully');
        toast.success('OAuth initiated - check console for details');
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      toast.error(`Unexpected error: ${err}`);
      setDebugInfo({ error: err, timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Google OAuth Debug Test</h3>
      
      <button
        onClick={testGoogleAuth}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Google OAuth'}
      </button>

      {debugInfo && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Expected Setup:</strong></p>
        <ul className="list-disc list-inside mt-2">
          <li>Google OAuth configured in Supabase Dashboard</li>
          <li>Redirect URI: <code>https://uxzpopwpbqfhfsbtlvim.supabase.co/auth/v1/callback</code></li>
          <li>Local redirect: <code>http://localhost:3000/auth/callback</code></li>
        </ul>
      </div>
    </div>
  );
}
