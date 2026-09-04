import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function Landing() {
  const [role, setRole] = useState('student')

  return (
     <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero role={role} />
        <Features />
        <HowItWorks />
      </main>
      <Footer />

      <div className="fixed bottom-8 right-6 bg-ink text-paper text-xs rounded-full p-2 flex gap-2 z-50 shadow-lg shadow-ink/20">
        {['student', 'tpo', 'recruiter'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-3 py-1 rounded ${role === r ? 'bg-paper text-ink' : ''}`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}