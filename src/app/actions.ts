'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// For server-side inserts, we can use the service role key if available, otherwise anon key is fine since we allowed public inserts.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DAILY_API_KEY = process.env.DAILY_API_KEY!;

import { redirect } from 'next/navigation';

export async function createRoomAction(formData?: FormData) {
  let roomId = null;
  
  try {
    // We are no longer using Daily.co, so we just create a room record in Supabase
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const expiresAt = new Date(exp * 1000).toISOString();

    const { data, error } = await supabase
      .from('rooms')
      .insert({
        daily_room_url: 'webrtc-local', // placeholder
        daily_room_name: 'webrtc-local', // placeholder
        expires_at: expiresAt,
        status: 'waiting',
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('Supabase Insert Error:', error);
      throw new Error('Failed to save room to database');
    }

    roomId = data.id;
  } catch (error) {
    console.error('Error creating room:', error);
    // Cannot return a value here because React form actions expect void
    // Instead we can just let it fail silently or throw, but we'll just log it.
  }
  
  if (roomId) {
    redirect(`/room/${roomId}`);
  }
}
