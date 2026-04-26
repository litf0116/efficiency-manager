import request from '@/utils/request'

export interface Team {
  id: number
  warehouseId: number
  name: string
  floor: string
  function: string
  status: number
  warehouse?: { id: number; name: string; location: string }
}

export const teamApi = {
  getAll(params?: { warehouseId?: number; status?: number }) {
    return request.get('/teams', { params }) as any
  },
  getById(id: number) {
    return request.get(`/teams/${id}`) as any
  },
  create(data: Partial<Team>) {
    return request.post('/teams', data) as any
  },
  update(id: number, data: Partial<Team>) {
    return request.put(`/teams/${id}`, data) as any
  },
  delete(id: number) {
    return request.delete(`/teams/${id}`) as any
  }
}
