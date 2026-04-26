import request from '@/utils/request'

export const dashboardApi = {
  getSummary(params?: { year?: number; month?: number }) {
    return request.get('/dashboard/summary', { params }) as any
  },
  getRanking(params?: { year?: number; week?: number; limit?: number }) {
    return request.get('/dashboard/ranking', { params }) as any
  },
  getTrend(params?: { teamId?: number; months?: number }) {
    return request.get('/dashboard/trend', { params }) as any
  }
}
