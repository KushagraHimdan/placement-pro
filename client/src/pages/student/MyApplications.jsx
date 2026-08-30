import { useEffect, useState } from 'react'
import api from '../../lib/api'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'

const STATUS_STYLES = {
  applied: 'bg-slate/10 text-slate',
  shortlisted: 'bg-signal/10 text-signal',
  interview: 'bg-authority/10 text-authority',
  selected: 'bg-milestone/30 text-ink',
  rejected: 'bg-professional/10 text-professional',
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/mine')
        setApplications(res.data.applications)
      } catch (err) {
        setError('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  if (loading) return <LoadingState label="Loading applications..." />
  if (error) return <p className="text-professional text-sm">{error}</p>

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-6">My applications</h1>

      {applications.length === 0 ? (
        <EmptyState message="You haven't applied to any drives yet." />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="border border-line rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-display text-xl text-ink">{app.drive?.company}</h2>
                  <p className="text-slate text-sm">{app.drive?.role}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-mono capitalize ${STATUS_STYLES[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <details className="text-sm">
                <summary className="text-slate cursor-pointer hover:text-ink transition-colors">
                  View timeline
                </summary>
                <ul className="mt-3 space-y-2 pl-4 border-l border-line">
                  {app.statusHistory?.map((entry, i) => (
                    <li key={i} className="text-xs">
                      <span className="font-mono text-slate">
                        {new Date(entry.changedAt).toLocaleDateString()}
                      </span>
                      {' — '}
                      <span className="capitalize text-ink">{entry.status}</span>
                      {entry.note && <span className="text-slate"> · {entry.note}</span>}
                    </li>
                  ))}
                </ul>
              </details>

              {app.aiMatch?.matchScore !== undefined && (
                <div className="mt-3 pt-3 border-t border-line text-sm">
                  <span className="text-slate">AI match score: </span>
                  <span className="font-mono text-ink">{app.aiMatch.matchScore}/100</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}