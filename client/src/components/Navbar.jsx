import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-mono text-2xl font-medium tracking-tight text-ink">PlacementPro</a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-slate hover:text-ink transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate hover:text-ink transition-colors">How it works</a>
          <a href="/login" className="text-sm text-slate hover:text-ink transition-colors">Log in</a>
          <a href="/register" className="text-sm px-4 py-2 rounded-md bg-ink text-paper hover:opacity-90 transition-opacity">
            Get started
          </a>
          <ThemeToggle />
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 border-t border-line pt-4">
          <a href="#features" className="text-sm text-slate">Features</a>
          <a href="#how-it-works" className="text-sm text-slate">How it works</a>
          <a href="/login" className="text-sm text-slate">Log in</a>
          <a href="/register" className="text-sm px-4 py-2 rounded-md bg-ink text-paper text-center">Get started</a>
        </div>
      )}
    </nav>
  )
}