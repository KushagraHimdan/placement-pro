import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Drives' },
  { to: '/student/applications', label: 'My applications' },
  { to: '/student/profile', label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm transition-colors ${isActive ? 'text-signal font-medium' : 'text-slate hover:text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate hidden sm:inline">{user?.name}</span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm text-slate hover:text-professional transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}