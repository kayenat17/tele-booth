import { createClient } from '@supabase/supabase-js';
import RoomClient from './RoomClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the room details
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !room) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-slate-800">
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-[2rem] shadow-sm border border-white/80 text-center">
          <h1 className="text-2xl font-bold mb-2">Room not found</h1>
          <p className="text-slate-500">This room might have expired or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <RoomClient
      roomId={room.id}
      dailyRoomUrl={room.daily_room_url}
    />
  );
}
