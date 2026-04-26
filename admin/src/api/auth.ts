import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: {
    id: number
    username: string
    role: string
    teamId?: number
  }
}

export const authApi = {
  login(data: LoginParams): Promise<{ token: string; user: any }> {
    return request.post('/auth/login', data) as any
  },
  register(data: { username: string; password: string; role: string }) {
    return request.post('/auth/register', data) as any
  },
  getCurrentUser() {
    return request.get('/auth/me') as any
  }
}
