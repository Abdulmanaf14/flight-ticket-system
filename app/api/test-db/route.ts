import { supabase } from '../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the Supabase URL being used
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    console.log('Server-side Supabase URL:', supabaseUrl);
    
    // Test connection to the airports table
    const { data, error } = await supabase.from('airports').select('count');
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data, serverUrl: supabaseUrl });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
} 