import { NextRequest, NextResponse } from 'next/server'

const TEAM_EMAIL = 'team@vanivert.eu'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      job_id, job_title, prenom, nom, email,
      phone, linkedin, portfolio, message,
      cv_filename, cv_base64
    } = body

    if (!prenom || !nom || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const bodyText = `
NOUVELLE CANDIDATURE VANIVERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poste         : ${job_title} (${job_id})
Candidat      : ${prenom} ${nom}
Email         : ${email}
Telephone     : ${phone || 'non renseigne'}
LinkedIn      : ${linkedin || 'non renseigne'}
Portfolio     : ${portfolio || 'non renseigne'}
CV joint      : ${cv_filename || 'aucun'}

MOTIVATION
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
    `.trim()

    // ── Web3Forms notification to team ───────────────────────────────────────
    const w3payload: Record<string, string> = {
      access_key:   '35166257-a70e-45c4-895c-0f32d06200f8',
      subject:      `Candidature Vanivert : ${job_title} - ${prenom} ${nom}`,
      from_name:    'Vanivert Recrutement',
      name:         `${prenom} ${nom}`,
      email:        TEAM_EMAIL,        // ← explicit recipient = team inbox
      replyto:      email,             // ← reply goes to candidate
      message:      bodyText,
    }
    if (cv_filename && cv_base64) {
      w3payload['attachment']          = cv_base64
      w3payload['attachment_filename'] = cv_filename
    }

    const w3res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(w3payload),
    })
    const w3data = await w3res.json()
    console.log('Web3Forms team notify:', w3data)

    // ── Auto-reply to candidate ───────────────────────────────────────────────
    await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '35166257-a70e-45c4-895c-0f32d06200f8',
        subject:    'Votre candidature chez Vanivert - recue',
        from_name:  'Vanivert',
        name:       `${prenom} ${nom}`,
        email:      email,             // ← send to candidate
        replyto:    TEAM_EMAIL,
        message: `Bonjour ${prenom},

Votre candidature au poste de ${job_title} a bien ete recue.

On vous repond sous 48h ouvrees. En attendant, testez Sophie au 02 21 82 60 74.

L'equipe Vanivert
team@vanivert.eu`.trim(),
      }),
    })

    // ── Store in Supabase if configured ──────────────────────────────────────
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (SB_URL && SB_KEY) {
      const sbres = await fetch(`${SB_URL}/rest/v1/candidatures`, {
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
      })
      console.log('Supabase insert status:', sbres.status)
    }

    return NextResponse.json({ ok: true, w3: w3data })
  } catch (err) {
    console.error('Apply API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
