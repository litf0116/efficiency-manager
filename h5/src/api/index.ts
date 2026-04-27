import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export const login = (data: { username: string; password: string }) =>
  api.post('/api/h5/auth/login', data)

export const getTeams = () => api.get('/api/h5/teams')

export const getTeamById = (id: number) => api.get(`/api/h5/teams/${id}`)

export const getWeekReports = (teamId: number) =>
  api.get('/api/h5/reports/week', { params: { teamId } })

export const submitWeekReport = (data: {
  teamId: number
  year: number
  weekNumber: number
  headcount: number
  entryQuantity: number
  exitQuantity: number
  qualityCheckQuantity: number
  shelvingQuantity: number
}) => api.post('/api/h5/reports', data)

export const getCurrentWeekPeriod = () => api.get('/api/config/current-week')

export const getEfficiencyConfig = () => api.get('/api/config/thresholds')

export const getDashboardSummary = () => api.get('/api/dashboard/summary')
