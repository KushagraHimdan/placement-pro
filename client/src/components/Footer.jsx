import { smoothScrollTo } from '../lib/scrollTo'

export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-12 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="font-mono text-xl font-medium text-ink mb-3">PlacementPro</p>
          <p className="text-sm text-slate max-w-xs">
            AI-assisted campus placement management for students, placement officers, and recruiters.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate mb-4">Product</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" onClick={(e) => smoothScrollTo(e, 'features')} className="text-slate hover:text-ink transition-colors">Features</a></li>
            <li><a href="#how-it-works" onClick={(e) => smoothScrollTo(e, 'how-it-works')} className="text-slate hover:text-ink transition-colors">How it works</a></li>
            <li><a href="/login" className="text-slate hover:text-ink transition-colors">Log in</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate mb-4">Roles</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/register" className="text-slate hover:text-ink transition-colors">For students</a></li>
            <li><a href="/register" className="text-slate hover:text-ink transition-colors">For placement officers</a></li>
            <li><a href="/register" className="text-slate hover:text-ink transition-colors">For recruiters</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate font-mono">© {new Date().getFullYear()} PlacementPro</p>
          <p className="text-xs text-slate">Built for campus placements</p>
        </div>
      </div>
    </footer>
  )
}