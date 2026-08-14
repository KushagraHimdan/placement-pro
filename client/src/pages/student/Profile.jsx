import { useEffect, useState } from 'react'
import api from '../../lib/api'

const BRANCHES = ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Other']

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile')
      setProfile(res.data.profile)
      setSkillsInput((res.data.profile.skills || []).join(', '))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const updateField = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage('')
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      const res = await api.put('/profile', {
        rollNumber: profile.rollNumber,
        branch: profile.branch,
        graduationYear: Number(profile.graduationYear) || undefined,
        cgpa: Number(profile.cgpa) || undefined,
        tenthPercentage: Number(profile.tenthPercentage) || undefined,
        twelfthPercentage: Number(profile.twelfthPercentage) || undefined,
        backlogs: Number(profile.backlogs) || 0,
        skills,
      })
      setProfile(res.data.profile)
      setSaveMessage('Saved successfully')
      setTimeout(() => setSaveMessage(''), 2500)
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) return
    setUploading(true)
    setUploadMessage('')
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile({ ...profile, resume: res.data.resume })
      setUploadMessage('Resume uploaded and parsed successfully')
      setResumeFile(null)
    } catch (err) {
      setUploadMessage(err.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p className="text-slate text-sm font-mono">Loading profile...</p>
  if (!profile) return null

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ink mb-6">Profile</h1>

      <form onSubmit={handleSave} className="space-y-4 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate mb-1.5">Roll number</label>
            <input
              value={profile.rollNumber || ''}
              onChange={updateField('rollNumber')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Branch</label>
            <select
              value={profile.branch || ''}
              onChange={updateField('branch')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            >
              <option value="">Select branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Graduation year</label>
            <input
              type="number"
              value={profile.graduationYear || ''}
              onChange={updateField('graduationYear')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">CGPA</label>
            <input
              type="number"
              step="0.01"
              value={profile.cgpa || ''}
              onChange={updateField('cgpa')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">10th %</label>
            <input
              type="number"
              step="0.01"
              value={profile.tenthPercentage || ''}
              onChange={updateField('tenthPercentage')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">12th %</label>
            <input
              type="number"
              step="0.01"
              value={profile.twelfthPercentage || ''}
              onChange={updateField('twelfthPercentage')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          <div>
            <label className="block text-xs text-slate mb-1.5">Backlogs</label>
            <input
              type="number"
              value={profile.backlogs ?? 0}
              onChange={updateField('backlogs')}
              className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate mb-1.5">Skills (comma separated)</label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="w-full px-3 py-2.5 rounded-md border border-line bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-signal/40"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
          {saveMessage && <span className="text-sm text-slate">{saveMessage}</span>}
        </div>
      </form>

      <div className="border-t border-line pt-8">
        <h2 className="font-display text-xl text-ink mb-4">Resume</h2>

        {profile.resume?.url ? (
          <p className="text-sm text-slate mb-4">
            Current resume:{' '}
            <a href={profile.resume.url} target="_blank" rel="noreferrer" className="text-signal hover:underline">
              View PDF
            </a>
            {profile.resume.uploadedAt && (
              <span className="text-xs text-slate ml-2">
                (uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()})
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm text-slate mb-4">No resume uploaded yet.</p>
        )}

        <form onSubmit={handleResumeUpload} className="flex items-center gap-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="text-sm text-slate"
          />
          <button
            type="submit"
            disabled={!resumeFile || uploading}
            className="px-4 py-2 rounded-md border border-line text-sm text-ink hover:border-slate transition-colors disabled:opacity-40"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {uploadMessage && <p className="text-sm text-slate mt-2">{uploadMessage}</p>}
      </div>
    </div>
  )
}