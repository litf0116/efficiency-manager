import request from '@/utils/request'

export interface StdEfficiency {
  id: number
  module: string
  operation: string
  unit: string
  stdRate: string
  description: string
  status: number
}

export const configApi = {
  getStdEfficiency(params?: { module?: string; status?: number }) {
    return request.get('/config/std-efficiency', { params }) as any
  },
  updateStdEfficiency(id: number, data: any) {
    return request.put(`/config/std-efficiency/${id}`, data) as any
  },
  createStdEfficiency(data: any) {
    return request.post('/config/std-efficiency', data) as any
  },
  deleteStdEfficiency(id: number) {
    return request.delete(`/config/std-efficiency/${id}`) as any
  }
}
