import { motion } from 'framer-motion'
import PipelineVisual from './PipelineVisual'

const ROLE_CONTENT = {
  student: {
    accent: '#4E65FF',
    eyebrow: 'For students',
    line1: 'Land your role,',
    line2: 'not the guesswork.',
    body: 'Track every drive, every application, in one place.',
    cta: 'Explore drives',
  },
  tpo: {
    accent: '#1F8A6F',
    eyebrow: 'For placement officers',
    line1: 'Run placements',
    line2: 'with total clarity.',
    body: 'Post drives, see who qualifies, move students forward.',
    cta: 'Post a drive',
  },
  recruiter: {
    accent: '#7A2F52',
    eyebrow: 'For recruiters',
    line1: 'Find the right',
    line2: 'candidates, faster.',
    body: 'Review, shortlist, and connect — all in one view.',
    cta: 'View candidates',
  },
}

export default function Hero({ role = 'student' }) {
  const content = ROLE_CONTENT[role]

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[1.15fr_1fr] gap-10 items-center">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-wide mb-5"
          style={{ color: content.accent }}
        >
          {content.eyebrow}
        </motion.p>

        <h1 className="font-display font-semibold tracking-tight leading-[0.95] text-5xl md:text-6xl lg:text-[4.25rem] text-ink mb-7">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: 'easeOut' }}
            className="block"
          >
            {content.line1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
            className="block"
            style={{ color: content.accent }}
          >
            {content.line2}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-slate text-lg mb-8 max-w-sm"
        >
          {content.body}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          href="/register"
          className="inline-block px-6 py-3 rounded-md text-paper font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: content.accent }}
        >
          {content.cta}
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <PipelineVisual accentColor={content.accent} />
      </motion.div>
    </section>
  )
}