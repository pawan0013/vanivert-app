'use client'
import { useEffect } from 'react'

export default function Demo() {
  useEffect(() => {
    window.location.href = 'https://realestate-eu-demo.vercel.app/login'
  }, [])
  return (
    <div style={{ minHeight: '100dvh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: '#2563EB', marginBottom: 8 }}>Redirection vers la demo...</div>
        <div style={{ fontSize: 13, color: 'rgba(12,14,26,0.5)' }}>
          Si la page ne se charge pas, <a href="https://realestate-eu-demo.vercel.app/login" style={{ color: '#2563EB' }}>cliquez ici</a>.
        </div>
      </div>
    </div>
  )
}
