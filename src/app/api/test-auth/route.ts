import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { createClientFromRequest } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing auth configuration...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envCheck = {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasSupabaseServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_SET'
    };
    
    console.log('📋 Environment check:', envCheck);
    
    // Test Supabase connection
    let connectionTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      const { supabase } = createClientFromRequest(req);
      const { data, error } = await supabase.auth.getSession();
      
      connectionTest = {
        success: !error,
        error: error?.message || null
      };
      
      console.log('🔌 Connection test:', connectionTest);
    } catch (err: any) {
      connectionTest = {
        success: false,
        error: err.message
      };
      console.error('❌ Connection test failed:', err);
    }
    
    // Test basic auth functionality
    let authTest: { success: boolean; error: string | null } = { success: false, error: null };
    try {
      const { supabase } = createClientFromRequest(req);
      
      // Try to get user (should work even if no user is logged in)
      const { data: { user }, error } = await supabase.auth.getUser();
      
      authTest = {
        success: !error,
        error: error?.message || null
      };
      
      console.log('👤 Auth test:', authTest);
    } catch (err: any) {
      authTest = {
        success: false,
        error: err.message
      };
      console.error('❌ Auth test failed:', err);
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      connection: connectionTest,
      auth: authTest,
      status: envCheck.hasSupabaseUrl && envCheck.hasSupabaseAnonKey && connectionTest.success && authTest.success ? 'HEALTHY' : 'ISSUES_DETECTED'
    };
    
    console.log('📊 Final result:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('💥 Test auth endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        message: error.message,
        timestamp: new Date().toISOString(),
        status: 'ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    
    console.log('🧪 Testing signup with:', { email });
    
    const { supabase } = createClientFromRequest(req);
    
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test User',
        }
      }
    });
    
    const result = {
      success: !error,
      error: error?.message || null,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        confirmed: !!data.user.email_confirmed_at
      } : null,
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 Signup test result:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('💥 Signup test error:', error);
    return NextResponse.json(
      { 
        error: 'Signup test failed', 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
