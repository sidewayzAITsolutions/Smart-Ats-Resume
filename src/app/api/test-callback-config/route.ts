// Test endpoint to verify callback route configuration
import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'NOT SET',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(config, {
    status: config.hasSupabaseUrl && config.hasAnonKey && config.hasServiceRoleKey ? 200 : 500,
  });
}

