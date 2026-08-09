import { motion } from 'framer-motion'
import PipelineVisual from './PipelineVisual'

const ROLE_CONTENT = {
  student: {
    accent: '#4E65FF',
    eyebrow: 'For students',
    headline: 'Land your next role, without the guesswork.',
    body: 'See every drive you qualify for, track each application, and know exactly where you stand.',
    cta: 'Explore drives',
  },
  tpo: {
    accent: '#1F8A6F',
    eyebrow: 'For placement officers',
    headline: 'Run placements with clarity, not chaos.',
    body: 'Post drives, see eligible students instantly, and move applications through a clear pipeline.',
    cta: 'Post a drive',
  },
  recruiter: {
    accent: '#7A2F52',
    eyebrow: 'For recruiters',
    headline: 'Find the right candidates, faster.',
    body: 'Review applications, track status, and connect with qualified students in one place.',
    cta: 'View candidates',
  },
}

export default function Hero({ role = 'student' }) {
  const content = ROLE_CONTENT[role]

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <p className="font-mono text-xs uppercase tracking-wide mb-4" style={{ color: content.accent }}>
          {content.eyebrow}
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">
          {content.headline}
        </h1>
        <p className="text-slate text-lg mb-8 max-w-md">
          {content.body}
        </p>
        <a href="/register" className="inline-block px-6 py-3 rounded-md text-paper font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: content.accent }}>
          {content.cta}
        </a>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <PipelineVisual accentColor={content.accent} />
      </motion.div>
    </section>
  )
}