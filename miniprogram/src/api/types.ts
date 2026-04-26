export const Team = {
  id: 0,
  name: '',
  warehouseId: 0,
  warehouseName: ''
}

export const WeekReport = {
  id: 0,
  teamId: 0,
  teamName: '',
  weekNumber: 0,
  year: 0,
  headcount: 0,
  entryQuantity: 0,
  exitQuantity: 0,
  qualityCheckQuantity: 0,
  shelvingQuantity: 0,
  laborEfficiency: 0,
  status: 'pending',
  createTime: ''
}

export const WeekPeriod = {
  year: 0,
  weekNumber: 0,
  startDate: '',
  endDate: ''
}

export const DashboardData = {
  currentWeek: null,
  teamStats: [],
  weekStats: {}
}

export const TeamStats = {
  teamId: 0,
  teamName: '',
  headcount: 0,
  laborEfficiency: 0,
  passStatus: 'warning'
}

export const WeekStats = {
  totalEntry: 0,
  totalExit: 0,
  avgLaborEfficiency: 0,
  teamCount: 0
}

export const EfficiencyConfig = {
  id: 0,
  threshold: 0,
  warningThreshold: 0,
  unit: '',
  updateTime: ''
}
