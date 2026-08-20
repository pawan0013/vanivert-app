import { NextRequest, NextResponse } from 'next/server'

const TEAM_EMAIL = 'team@vanivert.eu'
const W3_KEY     = '35166257-a70e-45c4-895c-0f32d06200f8'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      job_id, job_title, prenom, nom, email,
      phone, linkedin, portfolio, message, cv_filename
      // cv_base64 intentionally excluded — causes Web3Forms payload rejection
    } = body

    if (!prenom || !nom || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const bodyText = [
      `CANDIDATURE VANIVERT`,
      `Poste     : ${job_title} (${job_id})`,
      `Candidat  : ${prenom} ${nom}`,
      `Email     : ${email}`,
      `Tel       : ${phone || 'non renseigne'}`,
      `LinkedIn  : ${linkedin || '-'}`,
      `Portfolio : ${portfolio || '-'}`,
      `CV        : ${cv_filename || 'aucun joint'}`,
      ``,
      `MOTIVATION`,
      message,
      ``,
      `Recu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`,
    ].join('\n')

    // Send to Web3Forms — no CV attachment, plain text only
    const w3res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: W3_KEY,
        subject:    `Candidature : ${job_title} - ${prenom} ${nom}`,
        from_name:  `${prenom} ${nom} via Vanivert Carrieres`,
        name:       `${prenom} ${nom}`,
        email:      email,
        replyto:    email,
        message:    bodyText,
        botcheck:   false,
      }),
    })

    const w3json = await w3res.json().catch(() => ({}))
    console.log('Web3Forms:', w3res.status, JSON.stringify(w3json))

    // Auto-reply to candidate (separate call, also no attachment)
    fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: W3_KEY,
        subject:    'Votre candidature chez Vanivert - recue',
        from_name:  'Vanivert',
        name:       `${prenom} ${nom}`,
        email:      email,
        replyto:    TEAM_EMAIL,
        message:    `Bonjour ${prenom},\n\nVotre candidature (${job_title}) a bien ete recue. On vous repond sous 48h ouvrees.\n\nTestez Sophie au 02 21 82 60 74.\n\nL'equipe Vanivert`,
        botcheck:   false,
      }),
    }).catch(e => console.error('Auto-reply error:', e))

    // Supabase storage
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (SB_URL && SB_KEY) {
      fetch(`${SB_URL}/rest/v1/candidatures`, {
        method:  'POST',
        headers: {
          apikey:         SB_KEY,
          Authorization:  `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          Prefer:         'return=minimal',
        },
        body: JSON.stringify({
          job_id, job_title, prenom, nom, email,
          phone:     phone     || null,
          linkedin:  linkedin  || null,
          portfolio: portfolio || null,
          message,
          cv_filename: cv_filename || null,
          status: 'nouvelle',
          ts:     new Date().toISOString(),
        }),
      }).catch(e => console.error('Supabase error:', e))
    }

    // Return success regardless of Web3Forms result
    // (form data is stored in Supabase + admin panel)
    return NextResponse.json({ ok: true, w3: w3json?.success })

  } catch (err) {
    console.error('Apply API fatal error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
