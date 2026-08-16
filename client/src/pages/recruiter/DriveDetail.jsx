import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/api'

const STATUS_FLOW = {
  applied: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['selected', 'rejected'],
  selected: [],
  rejected: [],
}

const STATUS_STYLES = {
  applied: 'bg-slate/10 text-slate',
  shortlisted: 'bg-signal/10 text-signal',
  interview: 'bg-authority/10 text-authority',
  selected: 'bg-milestone/30 text-ink',
  rejected: 'bg-professional/10 text-professional',
}

export default function DriveDetail() {
  const { driveId } = useParams()
  const [drive, setDrive] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchAll = async () => {
    try {
      const [driveRes, appsRes] = await Promise.all([
        api.get(`/drives/${driveId}`),
        api.get(`/applications/drive/${driveId}`),
      ])
      setDrive(driveRes.data.drive)
      setApplications(appsRes.data.applications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [driveId])

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus })
      await fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="text-slate text-sm font-mono">Loading...</p>
  if (!drive) return <p className="text-professional text-sm">Drive not found</p>

  return (
    <div>
      <Link to="/recruiter/dashboard" className="text-sm text-slate hover:text-ink transition-colors mb-4 inline-block">
        ← Back to drives
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">{drive.company}</h1>
        <p className="text-slate text-sm mt-1">{drive.role} {drive.package && `· ${drive.package}`}</p>
        {drive.description && <p className="text-slate text-sm mt-3 max-w-lg">{drive.description}</p>}
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Applicants ({applications.length})</h2>

      {applications.length === 0 ? (
        <p className="text-slate text-sm">No applications yet.</p>
      ) : (
        <div className="border border-line rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate/5 text-slate text-xs uppercase font-mono">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Move to</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{app.student?.name}</td>
                  <td className="px-4 py-3 text-slate">{app.student?.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono capitalize ${STATUS_STYLES[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {STATUS_FLOW[app.status].length > 0 ? (
                      <div className="flex gap-2">
                        {STATUS_FLOW[app.status].map((nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusChange(app._id, nextStatus)}
                            disabled={updatingId === app._id}
                            className="text-xs px-2.5 py-1 rounded-md border border-line text-slate hover:border-professional hover:text-professional transition-colors disabled:opacity-40 capitalize"
                          >
                            {nextStatus}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate">Final</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}