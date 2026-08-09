'use client'
import { useEffect, useRef } from 'react'
import {
  trackPageView, trackSectionView, trackScrollDepth, SECTIONS
} from '@/lib/analytics'

export default function AnalyticsTracker() {
  const sectionTimers = useRef<Record<string, number>>({})
  const scrollMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    // Track page view on mount
    trackPageView(window.location.pathname)

    // ── SECTION OBSERVER ─────────────────────────────────────────────────────
    const observers: IntersectionObserver[] = []

    Object.keys(SECTIONS).forEach(sectionId => {
      const el = document.getElementById(sectionId)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Section entered — start timer
            sectionTimers.current[sectionId] = Date.now()
          } else if (sectionTimers.current[sectionId]) {
            // Section left — record duration
            const duration = Date.now() - sectionTimers.current[sectionId]
            if (duration > 1000) { // only count if stayed > 1 second
              trackSectionView(sectionId, duration)
            }
            delete sectionTimers.current[sectionId]
          }
        },
        { threshold: 0.3 } // 30% of section visible counts as "in view"
      )
      obs.observe(el)
      observers.push(obs)
    })

    // ── SCROLL DEPTH ─────────────────────────────────────────────────────────
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      const pct = Math.round((scrolled / total) * 100)
      const milestones = [25, 50, 75, 90, 100]
      milestones.forEach(m => {
        if (pct >= m && !scrollMilestones.current.has(m)) {
          scrollMilestones.current.add(m)
          trackScrollDepth(m)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── CLEANUP ───────────────────────────────────────────────────────────────
    return () => {
      observers.forEach(o => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
      // Flush any open section timers on unmount
      Object.entries(sectionTimers.current).forEach(([id, startTime]) => {
        const duration = Date.now() - startTime
        if (duration > 1000) trackSectionView(id, duration)
      })
    }
  }, [])

  return null // purely a side-effect component
}
