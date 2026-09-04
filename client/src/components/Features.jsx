import { motion } from 'framer-motion'
import { Target, FileSearch, GitBranch, Bell } from 'lucide-react'

const FEATURES = [
  {
    icon: Target,
    title: 'Eligibility, checked automatically',
    body: 'Every drive is matched against your CGPA, branch, and backlogs — no guessing whether you qualify.',
  },
  {
    icon: FileSearch,
    title: 'AI resume matching',
    body: 'Upload once. Get a match score and reasoning against every drive a TPO runs it for.',
  },
  {
    icon: GitBranch,
    title: 'A pipeline you can see',
    body: 'Applied, shortlisted, interview, selected — every move is tracked and timestamped.',
  },
  {
    icon: Bell,
    title: 'Notified, not left wondering',
    body: 'Status changes reach your inbox and your dashboard the moment they happen.',
  },
]

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-8 lg:px-12 py-24 border-t border-line">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">Features</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink max-w-lg">
          Built for how placements actually work.
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <f.icon size={22} className="text-signal mb-4" strokeWidth={1.75} />
            <h3 className="font-display text-lg text-ink mb-2">{f.title}</h3>
            <p className="text-slate text-sm leading-relaxed">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}