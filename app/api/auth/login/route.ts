import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Fallback to test credentials if Supabase isn't configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-url.supabase.co' &&
      email === 'test@example.com' && 
      password === 'password'
    ) {
      // For test users, set a simple cookie
      const response = NextResponse.json({ message: 'Login successful', user: { email } });
      response.cookies.set('auth', 'authenticated', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    // Create a response with the auth data
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: data.user 
    });
    
    // Set auth cookie in the response
    if (data.session) {
      response.cookies.set('auth', 'authenticated', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 