export type Software = 'excel' | 'papier' | 'sage' | 'cegid' | 'pennylane' | 'tiime' | 'autre'

const RISK: Record<Software, number> = {
  excel: 1.0, papier: 1.0, autre: 0.7,
  cegid: 0.3, sage: 0.3,
  pennylane: 0.1, tiime: 0.1,
}

export function score(invoices: number, software: Software, hasPDP: boolean) {
  const cap = Math.min(invoices * 12 * 50, 15000)
  const exposure = Math.round(cap * RISK[software] * (hasPDP ? 0 : 1))
  const grade = exposure >= 12000 ? 'F' : exposure >= 8000 ? 'D' : exposure >= 4000 ? 'C' : exposure >= 1000 ? 'B' : 'A'
  return { exposure, grade }
}
