import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: unknown) => {
    const err = error as { response?: { status: number; data: { message?: string } } }
    if (err.response) {
      const { status, data } = err.response
      if (status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
      } else {
        ElMessage.error(data.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
