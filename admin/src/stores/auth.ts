import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type LoginParams, type LoginResult } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<LoginResult['user'] | null>(null)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const login = async (params: LoginParams) => {
    const result = await authApi.login(params)
    setToken(result.token)
    userInfo.value = result.user
    return result
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return null
    try {
      const user = await authApi.getCurrentUser()
      userInfo.value = user
      return user
    } catch {
      logout()
      return null
    }
  }

  return {
    token,
    userInfo,
    setToken,
    login,
    logout,
    fetchCurrentUser
  }
})
