import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const siret = req.nextUrl.searchParams.get('siret')
  if (!siret || siret.length !== 14) return NextResponse.json({ valid: false })
  const key = process.env.SIRENE_API_KEY
  if (!key) return NextResponse.json({ valid: true, name: 'Entreprise', city: '', naf_code: '' })
  try {
    const r = await fetch(`https://api.insee.fr/api-sirene/3.11/siret/${siret}`, {
      headers: { Authorization: `Bearer ${key}` }
    })
    if (!r.ok) return NextResponse.json({ valid: false })
    const d = await r.json()
    const u = d.etablissement
    return NextResponse.json({
      valid: true,
      name: u.uniteLegale.denominationUniteLegale || `${u.uniteLegale.prenomUsuelUniteLegale} ${u.uniteLegale.nomUniteLegale}`,
      city: u.adresseEtablissement.libelleCommuneEtablissement,
      naf_code: u.uniteLegale.activitePrincipaleUniteLegale
    })
  } catch { return NextResponse.json({ valid: false }) }
}
