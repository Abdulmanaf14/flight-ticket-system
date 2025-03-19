import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Fallback if Supabase isn't configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-url.supabase.co') {
      if (email && password) {
        // For testing without Supabase
        const response = NextResponse.json({ message: 'User created successfully' });
        response.cookies.set('auth', 'authenticated', {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return response;
      } else {
        return NextResponse.json(
          { message: 'Invalid input' },
          { status: 400 }
        );
      }
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    // Create response with the auth data
    const response = NextResponse.json({ 
      message: 'User created successfully. Please check your email for verification.',
      user: data.user 
    });
    
    // Set auth cookie in the response if auto-confirmed
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 