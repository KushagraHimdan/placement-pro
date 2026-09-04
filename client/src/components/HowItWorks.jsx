import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Build your profile',
    body: 'Students upload a resume and set academic details. TPOs post drives with clear eligibility criteria.',
  },
  {
    number: '02',
    title: 'Get matched, automatically',
    body: 'Eligibility is checked against every drive in real time — no manual shortlisting from scratch.',
  },
  {
    number: '03',
    title: 'Track it to the offer',
    body: 'Every application moves through a clear pipeline, visible to students, TPOs, and recruiters alike.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-8 lg:px-12 py-24 border-t border-line">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">How it works</p>
        <h2 className="font-display text-3xl md:text-4xl text-ink max-w-lg">
          Three steps, start to offer.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-10">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative pl-0"
          >
            <span className="font-mono text-sm text-signal block mb-4">{step.number}</span>
            <h3 className="font-display text-xl text-ink mb-2">{step.title}</h3>
            <p className="text-slate text-sm leading-relaxed max-w-xs">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}