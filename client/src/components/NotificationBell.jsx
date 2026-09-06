import { useEffect, useRef, useState } from 'react'
import api from '../lib/api'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unreadCount)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch once on mount so the unread badge is accurate as soon as the page loads
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!open) fetchNotifications() // refresh right before opening, so it's never stale
    setOpen(!open)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-md border border-line flex items-center justify-center text-ink hover:bg-line/40 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-professional text-paper text-[10px] font-mono flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-paper border border-line rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-line">
            <p className="text-sm font-medium text-ink">Notifications</p>
          </div>

          {loading ? (
            <p className="px-4 py-6 text-sm text-slate text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate text-center">You're all caught up.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => !n.read && handleMarkAsRead(n._id)}
                  className={`px-4 py-3 border-b border-line last:border-b-0 cursor-pointer transition-colors ${
                    n.read ? 'opacity-60' : 'hover:bg-line/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-signal mt-1.5 shrink-0" />}
                    <div className={n.read ? 'pl-3.5' : ''}>
                      <p className="text-sm text-ink font-medium">{n.title}</p>
                      <p className="text-xs text-slate mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate font-mono mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}