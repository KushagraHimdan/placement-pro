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

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="font-mono text-lg text-ink block mb-8">PlacementPro</Link>

        <h1 className="font-display text-3xl text-ink mb-2">Create your account</h1>
        <p className="text-slate text-sm mb-8">Choose your role to get started.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-professional/10 text-professional text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setForm({ ...form, role: r.value })}
                className={`px-2 py-2 rounded-md text-xs border transition-colors ${
                  form.role === r.value
                    ? 'bg-ink text-paper border-ink'
                    : 'border-line text-slate hover:border-slate'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs text-slate mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update('password')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-slate mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-signal hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  )
}