import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

export default function Landing() {
  const [role, setRole] = useState('student')

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col relative overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-72 -right-72 w-[40rem] h-[40rem] rounded-full bg-signal/5 blur-3xl" />

        <div className="absolute top-[45%] -left-72 w-[36rem] h-[36rem] rounded-full bg-authority/5 blur-3xl" />

        <div className="absolute bottom-0 right-[20%] w-72 h-72 rounded-full bg-professional/5 blur-3xl" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-ink) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Hero role={role} />
        </main>

        <Footer />
      </div>

      {/* Role switcher */}
        <div className="fixed bottom-5 right-5 z-50">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-paper/90 backdrop-blur-md p-1 shadow-lg shadow-ink/5">
            {['student', 'tpo', 'recruiter'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wide transition-all duration-200 ${
                  role === r
                    ? 'bg-ink text-paper'
                    : 'text-slate hover:text-ink hover:bg-line/30'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
    </div>
  )
}