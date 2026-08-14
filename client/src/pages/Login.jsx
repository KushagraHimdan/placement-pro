import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      if (user.role === 'student') navigate('/student/dashboard')
      else if (user.role === 'tpo') navigate('/tpo/dashboard')
      else navigate('/recruiter/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background editorial accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Blue accent */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-signal/10 blur-3xl" />

        {/* Burgundy accent */}
        <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-professional/10 blur-3xl" />

        {/* Warm cream panel */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-[28rem] h-[28rem] rounded-full bg-cream/70 blur-3xl dark:opacity-20" />

        {/* Subtle technical grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >

        {/* Brand */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink hover:opacity-80 transition-opacity"
          >
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full border border-signal">
              <span className="w-2 h-2 rounded-full bg-signal" />
            </span>

            PlacementPro
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal mb-3">
            Your workspace
          </p>

          <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-tight text-ink mb-4">
            Welcome back.
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate max-w-sm">
            Log in to continue managing your placement journey.
          </p>
        </div>

        {/* Form */}
        <div className="relative border border-line bg-paper/90 dark:bg-paper/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(47,42,96,0.08)]">

          {/* Decorative top line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-lg border border-professional/20 bg-professional/10 px-4 py-3 text-sm text-professional"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-slate mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper text-ink text-sm placeholder:text-slate/50 outline-none transition-all duration-200 focus:border-signal focus:ring-4 focus:ring-signal/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-slate mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-line bg-paper text-ink text-sm placeholder:text-slate/50 outline-none transition-all duration-200 focus:border-signal focus:ring-4 focus:ring-signal/10"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full overflow-hidden py-3 rounded-lg bg-ink text-paper text-sm font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <span className="relative z-10">
                {submitting ? 'Logging in...' : 'Log in'}
              </span>

              {/* Accent hover sweep */}
              <span className="absolute inset-0 translate-y-full bg-signal transition-transform duration-300 group-hover:translate-y-0" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-line" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/60">
              PlacementPro
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <p className="text-sm text-slate text-center">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-signal font-medium hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Bottom detail */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-authority" />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate/60">
            Built for campus placements
          </p>
        </div>

      </motion.div>
    </div>
  )
}