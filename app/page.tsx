export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function DaftarTrip() {
  const { data: trips } = await supabase.from('trips').select('*').order('tanggal')

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'sans-serif',
      backgroundColor: '#f3f4f6' // Warna latar abu-abu muda agar tombol menonjol
    }}>
      
      {/* Bagian Judul */}
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#111827' }}>
        MK Tour & Wisata
      </h1>
      
      {/* Bagian Sub-Judul (Rute & Tanggal) */}
      <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '24px', textAlign: 'center' }}>
        Ambal - Jogja · 05 November 2026
      </p>

      {/* Instruksi */}
      <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', textAlign: 'center' }}>
        Silakan Pilih Bis dan Kursi Anda
      </p>

      {/* Container Tombol */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '350px' }}>
        {trips?.map(t => (
          <Link key={t.id} href={`/pesan/${t.id}`}
            style={{
              display: 'block',
              backgroundColor: '#ffffff',
              border: '2px solid #2563eb',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              textDecoration: 'none',
              color: '#2563eb',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}>
            {t.nama}
          </Link>
        ))}
      </div>

    </main>
  )
}