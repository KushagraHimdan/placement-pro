import { useState, useEffect } from 'react'
import api, { registerAuthHandlers } from '../lib/api'
import { AuthContext } from './AuthContextInstance'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user')
    return cached ? JSON.parse(cached) : null
  })
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, try to silently restore a session using the refresh cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post('/auth/refresh')
        setAccessToken(res.data.accessToken)
      } catch {
        // no valid refresh token — user isn't logged in, clear any stale cached user
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  // Wire up api.js's interceptors so every request can access the current token,
  // and so a failed silent-refresh can clear the session from anywhere
  useEffect(() => {
    registerAuthHandlers(
      () => accessToken,
      (newToken) => {
        setAccessToken(newToken)
        if (!newToken) {
          setUser(null)
          localStorage.removeItem('user')
        }
      }
    )
  }, [accessToken])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setAccessToken(res.data.accessToken)
    setUser(res.data.user)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data.user
  }

  const register = async (name, email, password, role) => {
    await api.post('/auth/register', { name, email, password, role })
    // registration doesn't log in automatically (matches our backend design from Task 7)
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
