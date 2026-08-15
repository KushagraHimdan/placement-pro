import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

const BRANCHES = ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Other']

export default function PostDrive() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company: '', role: '', description: '', package: '',
    driveDate: '', applicationDeadline: '',
    minCgpa: '', maxBacklogs: '', allowedBranches: [],
    minTenthPercentage: '', minTwelfthPercentage: '', graduationYears: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  // Prevents accidental value changes from mouse-wheel scrolling over a focused number input
  const preventWheelChange = (e) => e.target.blur()
    
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const toggleBranch = (branch) => {
    setForm((f) => ({
      ...f,
      allowedBranches: f.allowedBranches.includes(branch)
        ? f.allowedBranches.filter((b) => b !== branch)
        : [...f.allowedBranches, branch],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/drives', {
        company: form.company,
        role: form.role,
        description: form.description,
        package: form.package,
        driveDate: form.driveDate || undefined,
        applicationDeadline: form.applicationDeadline,
        eligibility: {
          minCgpa: Number(form.minCgpa) || 0,
          maxBacklogs: Number(form.maxBacklogs) || 0,
          allowedBranches: form.allowedBranches,
          minTenthPercentage: Number(form.minTenthPercentage) || 0,
          minTwelfthPercentage: Number(form.minTwelfthPercentage) || 0,
          graduationYears: form.graduationYears
            ? form.graduationYears.split(',').map((y) => Number(y.trim())).filter(Boolean)
            : [],
        },
      })
      navigate('/tpo/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ink mb-6">Post a drive</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-md bg-professional/10 text-professional text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate mb-1.5">Company</label>
            <input required value={form.company} onChange={update('company')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Role</label>
            <input required value={form.role} onChange={update('role')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Package</label>
            <input value={form.package} onChange={update('package')} placeholder="12 LPA"
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Drive date</label>
            <input type="date" value={form.driveDate} onChange={update('driveDate')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Application deadline</label>
            <input required type="date" value={form.applicationDeadline} onChange={update('applicationDeadline')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={update('description')}
            className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
        </div>

        <div className="border-t border-line pt-6">
          <h2 className="font-display text-lg text-ink mb-4">Eligibility criteria</h2>
          <p className="text-xs text-slate mb-4">Leave blank / unselected for no restriction on that field.</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate mb-1.5">Min CGPA</label>
              <input type="number" step="0.1" min="0" value={form.minCgpa} onChange={update('minCgpa')} onWheel={preventWheelChange}
  className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
            </div>
            <div>
              <label className="block text-xs text-slate mb-1.5">Max backlogs</label>
              <input type="number" min="0" value={form.maxBacklogs} onChange={update('maxBacklogs')} onWheel={preventWheelChange}
  className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
            </div>
            <div>
              <label className="block text-xs text-slate mb-1.5">Min 10th %</label>
              <input type="number" step="0.1" min="0" max="100" value={form.minTenthPercentage} onChange={update('minTenthPercentage')} onWheel={preventWheelChange}
  className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
            </div>
            <div>
              <label className="block text-xs text-slate mb-1.5">Min 12th %</label>
              <input type="number" step="0.1" min="0" max="100" value={form.minTwelfthPercentage} onChange={update('minTwelfthPercentage')} onWheel={preventWheelChange}
  className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-slate mb-2">Allowed branches</label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map((b) => (
                <button
                  key={b} type="button" onClick={() => toggleBranch(b)}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                    form.allowedBranches.includes(b)
                      ? 'bg-authority text-paper border-authority'
                      : 'border-line text-slate hover:border-slate'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate mb-1.5">Graduation years (comma separated)</label>
            <input value={form.graduationYears} onChange={update('graduationYears')} placeholder="2026, 2027"
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-authority/40" />
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="px-6 py-2.5 rounded-md bg-authority text-paper text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          {submitting ? 'Posting...' : 'Post drive'}
        </button>
      </form>
    </div>
  )
}