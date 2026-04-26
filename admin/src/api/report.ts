import request from '@/utils/request'

export interface ReportDetail {
  module: string
  operation: string
  unit: string
  quantity: number
}

export interface Report {
  id: number
  teamId: number
  year: number
  week: number
  reportDate: string
  totalHeadcount: number
  formalWorkers: number
  contractWorkers: number
  totalOutput: string
  stdOutput: string
  efficiency: string
  status: string
  team: {
    id: number
    name: string
    warehouse: { id: number; name: string }
  }
  details: ReportDetail[]
}

export const reportApi = {
  getAll(params?: {
    warehouseId?: number
    teamId?: number
    year?: number
    month?: number
    page?: number
    pageSize?: number
  }) {
    return request.get('/reports/all', { params }) as any
  },
  getMine(params?: { year?: number; week?: number }) {
    return request.get('/reports/mine', { params }) as any
  },
  getMonthly(params?: { year?: number; month?: number }) {
    return request.get('/reports/monthly', { params }) as any
  },
  update(id: number, data: any) {
    return request.put(`/reports/${id}`, data) as any
  },
  exportExcel(params?: { year?: number; month?: number; warehouseId?: number }) {
    return request.get('/reports/export', { params, responseType: 'blob' }) as any
  }
}
