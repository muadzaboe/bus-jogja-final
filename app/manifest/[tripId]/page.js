import { supabase } from '@/lib/supabase'
import ClientManifest from './ClientManifest'

export default async function ManifestPage({ params }) {
  const { tripId } = await params
  
  const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single()
  const { data: bookings } = await supabase.from('bookings').select('*').eq('trip_id', tripId).order('nomor_kursi')

  if (!trip) return <p className="p-6">Trip tidak ditemukan</p>

  return <ClientManifest trip={trip} initialBookings={bookings || []} />
}