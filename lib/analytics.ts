// ── VANIVERT ANALYTICS — RGPD + EU AI Act compliant ──────────────────────────
// - No fingerprinting, no cross-site tracking
// - Explicit opt-in consent required before ANY tracking starts
// - All data stored in your own EU Supabase instance
// - Session ID: random UUID per session, not tied to identity
// - No personal data collected without form submission

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || ''
const SB_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const CONSENT_KEY = 'vanivert_gdpr_v4'
const SESSION_KEY = 'vanivert_session_id'
const ANALYTICS_ENABLED = 'vanivert_analytics_on'

// ── SECTION LABELS (what we track) ───────────────────────────────────────────
export const SECTIONS: Record<string, string> = {
  'hero':        'Page d\'accueil — Hero',
  'features':    'Fonctionnalités',
  'tester-ia':   'Tester l\'IA',
  'roi':         'Calculateur ROI',
  'team':        'Équipe',
  'investors':   'Investisseurs',
  'contact':     'Formulaire contact',
}

// ── SESSION ───────────────────────────────────────────────────────────────────
export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch { return 'unknown' }
}

export function isConsentGiven(): boolean {
  try { return localStorage.getItem(CONSENT_KEY) === 'accepted' } catch { return false }
}

export function isAnalyticsOn(): boolean {
  try { return localStorage.getItem(ANALYTICS_ENABLED) === '1' } catch { return false }
}

export function enableAnalytics() {
  try { localStorage.setItem(ANALYTICS_ENABLED, '1') } catch {}
}

// ── SUPABASE INSERT ───────────────────────────────────────────────────────────
async function insert(table: string, payload: Record<string, unknown>) {
  if (!SB_URL || !SB_KEY) return
  try {
    await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    })
  } catch {}
}

// ── TRACK PAGE VIEW ───────────────────────────────────────────────────────────
export async function trackPageView(path: string) {
  if (!isConsentGiven() || !isAnalyticsOn()) return
  await insert('analytics_pageviews', {
    session_id:  getSessionId(),
    path,
    referrer:    typeof document !== 'undefined' ? document.referrer || null : null,
    device:      getDevice(),
    country:     null, // Supabase Edge Functions can enrich this if desired
    ts:          new Date().toISOString(),
  })
}

// ── TRACK SECTION VIEW ────────────────────────────────────────────────────────
export async function trackSectionView(sectionId: string, durationMs: number) {
  if (!isConsentGiven() || !isAnalyticsOn()) return
  await insert('analytics_sections', {
    session_id:   getSessionId(),
    section_id:   sectionId,
    section_label: SECTIONS[sectionId] || sectionId,
    duration_ms:  Math.round(durationMs),
    ts:           new Date().toISOString(),
  })
}

// ── TRACK CTA CLICK ───────────────────────────────────────────────────────────
export async function trackCTA(label: string, destination: string) {
  if (!isConsentGiven() || !isAnalyticsOn()) return
  await insert('analytics_cta', {
    session_id:  getSessionId(),
    label,
    destination,
    ts:          new Date().toISOString(),
  })
}

// ── TRACK SCROLL DEPTH ────────────────────────────────────────────────────────
export async function trackScrollDepth(pct: number) {
  if (!isConsentGiven() || !isAnalyticsOn()) return
  await insert('analytics_scroll', {
    session_id: getSessionId(),
    depth_pct:  pct,
    ts:         new Date().toISOString(),
  })
}

// ── DEVICE DETECTION ─────────────────────────────────────────────────────────
function getDevice(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'mobile'
  if (/Tablet|iPad/i.test(ua)) return 'tablet'
  return 'desktop'
}

// ── FETCH ANALYTICS (for admin) ───────────────────────────────────────────────
export async function fetchAnalytics(days = 30) {
  if (!SB_URL || !SB_KEY) return null
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const headers = {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
  }

  try {
    const [pv, sec, cta, scroll] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/analytics_pageviews?ts=gte.${since}&order=ts.desc&limit=500`, { headers }).then(r => r.json()),
      fetch(`${SB_URL}/rest/v1/analytics_sections?ts=gte.${since}&order=ts.desc&limit=1000`, { headers }).then(r => r.json()),
      fetch(`${SB_URL}/rest/v1/analytics_cta?ts=gte.${since}&order=ts.desc&limit=500`, { headers }).then(r => r.json()),
      fetch(`${SB_URL}/rest/v1/analytics_scroll?ts=gte.${since}&order=ts.desc&limit=500`, { headers }).then(r => r.json()),
    ])
    return { pageviews: pv, sections: sec, cta, scroll }
  } catch { return null }
}
