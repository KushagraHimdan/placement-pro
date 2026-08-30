import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import ThemeToggle from './ThemeToggle'

export default function RecruiterLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-mono text-lg text-ink">PlacementPro</span>
            <NavLink
              to="/recruiter/dashboard"
              className={({ isActive }) =>
                `hidden md:inline text-sm transition-colors ${isActive ? 'text-professional font-medium' : 'text-slate hover:text-ink'}`
              }
            >
              Drives
            </NavLink>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate hidden sm:inline">{user?.name}</span>
            <ThemeToggle />
            <button onClick={handleLogout} className="text-sm text-slate hover:text-professional transition-colors hidden md:inline">
              Log out
            </button>
            <button
              className="md:hidden text-ink"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-line pt-4">
            <NavLink
              to="/recruiter/dashboard"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-professional font-medium' : 'text-slate'}`
              }
            >
              Drives
            </NavLink>
            <button onClick={handleLogout} className="text-sm text-slate text-left">
              Log out
            </button>
          </div>
        )}
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}