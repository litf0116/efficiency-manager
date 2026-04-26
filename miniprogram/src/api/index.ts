import { request } from '../utils/request'
import { Team, WeekPeriod, EfficiencyConfig, WeekReport } from './types'

export { Team, WeekPeriod, EfficiencyConfig, WeekReport }

export function getTeams() {
  return request('/api/v1/teams')
}

export function getTeamById(id) {
  return request('/api/v1/teams/' + id)
}

export function getWeekReports(teamId) {
  return request('/api/v1/reports/week', {
    method: 'GET',
    data: { teamId },
  })
}

export function submitWeekReport(data) {
  return request('/api/v1/reports/week', {
    method: 'POST',
    data,
  })
}

export function getCurrentWeekPeriod() {
  return request('/api/v1/config/current-week')
}

export function getEfficiencyConfig() {
  return request('/api/v1/config/efficiency')
}

export function calculateLaborEfficiency(entryQty, exitQty, qualityQty, shelQty, headcount) {
  if (headcount <= 0) return 0
  return (entryQty + exitQty + qualityQty + shelQty) / headcount
}
