import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { companyName, fullName, email, phone, employees, message } = await req.json();

    // Validate required fields
    if (!companyName || !fullName || !email || !employees) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name) => (await cookieStore).get(name)?.value,
          set: () => {}, // We don't need to set cookies in this API route
          remove: () => {} // We don't need to remove cookies in this API route
        }
      }
    );

    // Store contact request in database
    const { error: insertError } = await supabase
      .from('enterprise_inquiries')
      .insert({
        company_name: companyName,
        full_name: fullName,
        email,
        phone,
        employees,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing inquiry:', insertError);
      // Continue even if database insert fails
    }

     // Log activity if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.rpc('log_activity', {
        user_id: user.id,
        action: 'enterprise_inquiry_submitted',
        metadata: { companyName, employees }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. Our enterprise team will contact you within 24 hours.'
    });
  } catch (error) {
    console.error('Error processing enterprise contact:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
