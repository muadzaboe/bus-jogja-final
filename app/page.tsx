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
      backgroundColor: '#ffffff' 
    }}>
      
      {/* Bagian Logo & Judul */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', width: '100%', maxWidth: '350px' }}>
        
        <img 
          src="/logo.png" 
          alt="Logo MK Tour" 
          style={{ width: '100%', maxHeight: '80px', objectFit: 'contain', marginBottom: '16px' }} 
        />
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0, textAlign: 'center' }}>
          MK Tour & Wisata
        </h1>
      </div>
      
      {/* Bagian Sub-Judul (Rute & Tanggal) - Jarak dirapatkan */}
      <p style={{ fontSize: '16px', color: '#4b5563', marginTop: '4px', marginBottom: '0', textAlign: 'center' }}>
        Ambal - Jogja · 05 November 2026
      </p>

      {/* Instruksi - Jarak dirapatkan (hanya 1 enter dari atas) */}
      <p style={{ fontSize: '16px', fontWeight: '500', marginTop: '8px', marginBottom: '24px', textAlign: 'center' }}>
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