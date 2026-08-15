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
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-ink">Drives</h1>
        <Link to="/tpo/post-drive" className="px-4 py-2 rounded-md bg-authority text-paper text-sm font-medium hover:opacity-90 transition-opacity">
          Post a drive
        </Link>
      </div>

      {drives.length === 0 ? (
        <p className="text-slate text-sm">No drives posted yet.</p>
      ) : (
        <div className="space-y-3">
          {drives.map((drive) => (
            <Link
              key={drive._id}
              to={`/tpo/drives/${drive._id}`}
              className="block border border-line rounded-lg p-5 hover:border-slate transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-xl text-ink">{drive.company}</h2>
                  <p className="text-slate text-sm">{drive.role} {drive.package && `· ${drive.package}`}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  drive.status === 'open' ? 'bg-authority/10 text-authority' : 'bg-slate/10 text-slate'
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