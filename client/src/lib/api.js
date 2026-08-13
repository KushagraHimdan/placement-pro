import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// injected by AuthProvider once it's mounted, so requests can attach the current token
let getAccessToken = () => null
let onTokenRefreshed = () => {}

export const registerAuthHandlers = (getTokenFn, onRefreshFn) => {
  getAccessToken = getTokenFn
  onTokenRefreshed = onRefreshFn
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// if a request fails with 401 (expired access token), try refreshing once and retrying
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // Never retry the refresh endpoint itself — prevents an infinite loop when there's no valid session
    const isRefreshCall = original?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true
      try {
        const res = await api.post('/auth/refresh')
        onTokenRefreshed(res.data.accessToken)
        original.headers.Authorization = `Bearer ${res.data.accessToken}`
        return api(original)
      } catch {
        onTokenRefreshed(null)
      }
    }
    return Promise.reject(error)
  }
)

export default api