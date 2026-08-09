import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

function App() {
  const [role, setRole] = useState('student')

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <Hero role={role} />

      {/* Temporary role switcher for preview — will be removed once real routing exists */}
      <div className="fixed bottom-6 right-6 bg-ink text-paper text-xs rounded-md p-2 flex gap-2">
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