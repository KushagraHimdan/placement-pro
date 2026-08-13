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
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="font-mono text-lg text-ink block mb-8">PlacementPro</Link>

        <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
        <p className="text-slate text-sm mb-8">Log in to continue to your dashboard.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-professional/10 text-professional text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-slate mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-signal hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}