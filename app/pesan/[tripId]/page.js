'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PesanKursi() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [booked, setBooked] = useState({})
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [pilih, setPilih] = useState(null)
  const [pesan, setPesan] = useState('')

  async function loadData() {
    const { data: t } = await supabase.from('trips').select('*').eq('id', tripId).single()
    setTrip(t)
    const { data: b } = await supabase.from('bookings')
      .select('id, nomor_kursi, nama_penumpang, no_hp').eq('trip_id', tripId)
    const map = {}
    ;(b || []).forEach(x => {
      map[x.nomor_kursi] = { nama: x.nama_penumpang, id: x.id, hp: x.no_hp }
    })
    setBooked(map)
  }

  useEffect(() => {
    if (!tripId) return
    loadData()
    const channel = supabase.channel('kursi-' + tripId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `trip_id=eq.${tripId}` }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [tripId])

  function tampilPesan(msg) {
    setPesan(msg)
    setTimeout(() => setPesan(''), 3000)
  }

  async function pesanKursi() {
    if (!pilih) return tampilPesan('Pilih kursi dulu')
    if (!nama.trim()) return tampilPesan('Isi nama penumpang dulu')
    if (booked[pilih]) return tampilPesan('Kursi itu sudah terisi')

    const { error } = await supabase.from('bookings').insert({
      trip_id: tripId, nomor_kursi: pilih, nama_penumpang: nama.trim(), no_hp: hp.trim(),
    })
    if (error) {
      tampilPesan('Gagal: kursi mungkin baru saja dipesan orang lain')
      loadData()
      return
    }
    tampilPesan('Berhasil! Kursi ' + pilih + ' atas nama ' + nama.trim())
    setNama(''); setHp(''); setPilih(null)
    loadData()
  }

  async function hapusKursi(nomor, namaOrang) {
    if (!confirm(`Hapus kursi ${nomor} (${namaOrang})?`)) return
    const { error } = await supabase.from('bookings').delete().eq('trip_id', tripId).eq('nomor_kursi', nomor)
    if (error) return tampilPesan('Gagal hapus')
    tampilPesan('Kursi ' + nomor + ' dihapus')
    if (pilih === nomor) setPilih(null)
    loadData()
  }

  if (!trip) return <p style={{ padding: '20px' }}>Memuat...</p>

  const terisi = Object.keys(booked).length
  const kosong = trip.total_kursi - terisi

  return (
    <main style={{ maxWidth: '400px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>{trip.nama}</h1>
      <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', marginBottom: '4px' }}>{trip.rute} · {trip.tanggal}</p>
      <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>Terisi: <b>{terisi}</b> / {trip.total_kursi} · Kosong: <b>{kosong}</b></p>

      {/* --- MULAI DENAH KURSI (Tanpa Tailwind) --- */}
      <div style={{ border: '4px solid #333', borderRadius: '30px', padding: '16px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
        
        {/* Bagian Depan */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '20px' }}>
          <div style={{ gridColumn: 'span 1', border: '2px solid #333', borderRadius: '6px', padding: '4px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', backgroundColor: 'white', textAlign: 'center' }}>
            Co. DRIVER
          </div>
          <div style={{ gridColumn: 'span 2', border: '2px solid #333', borderRadius: '6px', padding: '4px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', backgroundColor: 'white', textAlign: 'center' }}>
            TL
          </div>
          <div style={{ gridColumn: 'span 1' }}></div> {/* Lorong */}
          <div style={{ gridColumn: 'span 2', border: '2px solid #333', borderRadius: '6px', padding: '4px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', backgroundColor: 'white', textAlign: 'center' }}>
            DRIVER
          </div>
        </div>

        {/* Bagian Kursi Penumpang */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {Array.from({ length: trip.total_kursi }, (_, i) => i + 1).map(n => {
            const isi = booked[n]
            const dipilih = pilih === n

            const modulo = n % 4
            let gridColumn = ""
            
            if (n > 44) {
              gridColumn = "auto"; 
            } else {
              if (modulo === 1) gridColumn = "1" 
              else if (modulo === 2) gridColumn = "2" 
              else if (modulo === 3) gridColumn = "5" 
              else if (modulo === 0) gridColumn = "6" 
            }

            let bgColor = 'white';
            let textColor = '#333';
            let borderColor = '#333';

            if (isi) {
              bgColor = '#d1d5db'; textColor = '#374151'; borderColor = '#9ca3af';
            } else if (dipilih) {
              bgColor = '#2563eb'; textColor = 'white'; borderColor = '#1d4ed8';
            }

            return (
              <button key={n} type="button" onClick={() => isi ? hapusKursi(n, isi.nama) : setPilih(n)}
                style={{
                  gridColumn: gridColumn,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '6px',
                  padding: '4px',
                  height: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: bgColor,
                  color: textColor,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{n}</span>
                {isi && <span style={{ fontSize: '9px', width: '100%', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isi.nama}</span>}
              </button>
            )
          })}
        </div>
      </div>
      {/* --- AKHIR DENAH KURSI --- */}

      {/* Form Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} placeholder="Nama penumpang" value={nama} onChange={e => setNama(e.target.value)} />
        <input style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }} placeholder="No HP (opsional)" value={hp} onChange={e => setHp(e.target.value)} />
        <button onClick={pesanKursi} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          {pilih ? `Pesan Kursi No. ${pilih}` : 'Pilih kursi di atas'}
        </button>
        {pilih && <button onClick={() => setPilih(null)} style={{ background: 'none', border: 'none', color: '#555', textDecoration: 'underline', cursor: 'pointer' }}>Batal pilih kursi {pilih}</button>}
        {pesan && <p style={{ fontSize: '14px', textAlign: 'center', color: 'green', margin: 0 }}>{pesan}</p>}
      </div>
    </main>
  )
}