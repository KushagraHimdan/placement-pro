import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/useAuth'

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'tpo', label: 'Placement Officer' },
  { value: 'recruiter', label: 'Recruiter' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const roleColors = {
    student: {
      active: 'bg-signal text-paper border-signal shadow-lg shadow-signal/10',
      hover: 'hover:border-signal/50 hover:text-signal',
    },
    tpo: {
      active: 'bg-authority text-paper border-authority shadow-lg shadow-authority/10',
      hover: 'hover:border-authority/50 hover:text-authority',
    },
    recruiter: {
      active: 'bg-professional text-paper border-professional shadow-lg shadow-professional/10',
      hover: 'hover:border-professional/50 hover:text-professional',
    },
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6 py-8 relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-signal/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-authority/10 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cream/60 blur-3xl dark:opacity-20" />

        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-ink) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >

        {/* Brand */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 font-display text-xl font-semibold tracking-tight text-ink hover:opacity-80 transition-opacity"
          >
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full border border-signal">
              <span className="w-2 h-2 rounded-full bg-signal" />
            </span>

            PlacementPro
          </Link>
        </div>

        {/* Compact heading */}
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mb-2">
            Get started
          </p>

          <h1 className="font-display text-3xl sm:text-4xl leading-none tracking-tight text-ink mb-2">
            Create your account.
          </h1>

          <p className="text-sm leading-relaxed text-slate">
            Choose your role and get started with PlacementPro.
          </p>
        </div>

        {/* Form */}
        <div className="relative border border-line bg-paper/90 dark:bg-paper/80 backdrop-blur-md rounded-xl p-5 sm:p-6 shadow-[0_16px_50px_rgba(47,42,96,0.07)]">

          {/* Decorative line */}
          <div className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-professional/20 bg-professional/10 px-4 py-3 text-sm text-professional"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate">
                  I am a
                </label>

                <span className="font-mono text-[9px] uppercase tracking-widest text-slate/50">
                  Select one
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const colors = roleColors[r.value]
                  const isActive = form.role === r.value

                  return (
                    <motion.button
                      type="button"
                      key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      whileTap={{ scale: 0.97 }}
                      className={`h-11 px-2 rounded-lg text-[11px] font-medium border transition-all duration-200 ${
                        isActive
                          ? colors.active
                          : `border-line text-slate bg-paper/50 ${colors.hover}`
                      }`}
                    >
                      {r.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-slate mb-1.5">
                Full name
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm placeholder:text-slate/50 outline-none transition-all duration-200 focus:border-signal focus:ring-4 focus:ring-signal/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-slate mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm placeholder:text-slate/50 outline-none transition-all duration-200 focus:border-signal focus:ring-4 focus:ring-signal/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-slate mb-1.5">
                Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-lg border border-line bg-paper text-ink text-sm placeholder:text-slate/50 outline-none transition-all duration-200 focus:border-signal focus:ring-4 focus:ring-signal/10"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full overflow-hidden py-2.5 rounded-lg bg-ink text-paper text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <span className="relative z-10">
                {submitting ? 'Creating account...' : 'Create account'}
              </span>

              <span className="absolute inset-0 translate-y-full bg-signal transition-transform duration-300 group-hover:translate-y-0" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-line" />

            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/60">
              PlacementPro
            </span>

            <div className="h-px flex-1 bg-line" />
          </div>

          <p className="text-sm text-slate text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-signal font-medium hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-authority" />

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate/60">
            Built for campus placements
          </p>
        </div>

      </motion.div>
    </div>
  )
}