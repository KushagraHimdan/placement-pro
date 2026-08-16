import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export default function DrivesList() {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await api.get('/drives')
        setDrives(res.data.drives)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDrives()
  }, [])

  if (loading) return <p className="text-slate text-sm font-mono">Loading drives...</p>

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-6">Drives</h1>

      {drives.length === 0 ? (
        <p className="text-slate text-sm">No drives posted yet.</p>
      ) : (
        <div className="space-y-3">
          {drives.map((drive) => (
            <Link
              key={drive._id}
              to={`/recruiter/drives/${drive._id}`}
              className="block border border-line rounded-lg p-5 hover:border-slate transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-xl text-ink">{drive.company}</h2>
                  <p className="text-slate text-sm">{drive.role} {drive.package && `· ${drive.package}`}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  drive.status === 'open' ? 'bg-professional/10 text-professional' : 'bg-slate/10 text-slate'
                }`}>
                  {drive.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}