import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { job_id, job_title, prenom, nom, email, phone, linkedin, portfolio, message, cv_filename, cv_base64 } = body

    if (!prenom || !nom || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // ── 1. Notify team via Web3Forms ─────────────────────────────────────────
    const notifPayload: Record<string, string> = {
      access_key: '35166257-a70e-45c4-895c-0f32d06200f8',
      subject:    `Candidature Vanivert : ${job_title} — ${prenom} ${nom}`,
      from_name:  'Vanivert Recrutement',
      name:       `${prenom} ${nom}`,
      email,
      phone:      phone || '(non renseigné)',
      replyto:    email,
      message: `
NOUVELLE CANDIDATURE VANIVERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poste         : ${job_title} (${job_id})
Candidat      : ${prenom} ${nom}
Email         : ${email}
Téléphone     : ${phone || 'non renseigné'}
LinkedIn      : ${linkedin || 'non renseigné'}
Portfolio     : ${portfolio || 'non renseigné'}
CV joint      : ${cv_filename || 'aucun'}

MOTIVATION
──────────
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reçu le ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
      `.trim(),
    }

    if (cv_filename && cv_base64) {
      // Web3Forms supports attachments as base64
      notifPayload['attachment'] = cv_base64
      notifPayload['attachment_filename'] = cv_filename
    }

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(notifPayload),
    })

    // ── 2. Store in Supabase if configured ───────────────────────────────────
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (SB_URL && SB_KEY) {
      await fetch(`${SB_URL}/rest/v1/candidatures`, {
        method: 'POST',
        headers: {
          apikey:          SB_KEY,
          Authorization:   `Bearer ${SB_KEY}`,
          'Content-Type':  'application/json',
          Prefer:          'return=minimal',
        },
        body: JSON.stringify({
          job_id,
          job_title,
          prenom,
          nom,
          email,
          phone:     phone     || null,
          linkedin:  linkedin  || null,
          portfolio: portfolio || null,
          message,
          cv_filename: cv_filename || null,
          status: 'nouvelle',
          ts: new Date().toISOString(),
        }),
      })
    }

    // ── 3. Auto-reply to candidate ────────────────────────────────────────────
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '35166257-a70e-45c4-895c-0f32d06200f8',
        subject:    'Votre candidature chez Vanivert — reçue ✓',
        from_name:  'Vanivert',
        name:       `${prenom} ${nom}`,
        email,
        replyto:    'team@vanivert.eu',
        message: `
Bonjour ${prenom},

Merci pour votre candidature au poste de ${job_title}.

On a bien reçu votre dossier et on vous répond sous 48h ouvrées.

En attendant, n'hésitez pas à tester Sophie, notre agent vocal IA, au 02 21 82 60 74 — c'est exactement ce sur quoi vous seriez amené à travailler.

À très vite,
L'équipe Vanivert
team@vanivert.eu
        `.trim(),
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Apply API error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
