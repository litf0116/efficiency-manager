import request from '@/utils/request'

export interface Warehouse {
  id: number
  name: string
  location: string
  status: number
}

export const warehouseApi = {
  getAll(params?: { status?: number }) {
    return request.get('/warehouses', { params }) as any
  },
  getById(id: number) {
    return request.get(`/warehouses/${id}`) as any
  },
  create(data: Partial<Warehouse>) {
    return request.post('/warehouses', data) as any
  },
  update(id: number, data: Partial<Warehouse>) {
    return request.put(`/warehouses/${id}`, data) as any
  },
  delete(id: number) {
    return request.delete(`/warehouses/${id}`) as any
  }
}
