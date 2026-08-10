import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

function App() {
  const [role, setRole] = useState('student')

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero role={role} />
      </main>
      <Footer />

      <div className="fixed bottom-6 right-6 bg-ink text-paper text-xs rounded-md p-2 flex gap-2 z-50">
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

export default App