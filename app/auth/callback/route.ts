import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
    }
  }

  // Redirect to the homepage
  return NextResponse.redirect(new URL('/', request.url));
} 