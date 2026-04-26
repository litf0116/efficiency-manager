import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Team, WeekReport, EfficiencyConfig } from '../api'

export const useAppStore = defineStore('app', () => {
  const currentTeam = ref(null)
  const teams = ref([])
  const recentReports = ref([])
  const efficiencyConfig = ref(null)

  const hasSelectedTeam = computed(() => currentTeam.value !== null)

  function setTeam(team) {
    currentTeam.value = team
    wx.setStorageSync('selectedTeam', team)
  }

  function loadStoredTeam() {
    const stored = wx.getStorageSync('selectedTeam')
    if (stored) {
      currentTeam.value = stored
    }
  }

  function setTeams(list) {
    teams.value = list
  }

  function addReport(report) {
    recentReports.value.unshift(report)
  }

  function setReports(reports) {
    recentReports.value = reports
  }

  function setEfficiencyConfig(config) {
    efficiencyConfig.value = config
  }

  function getPassStatus(laborEfficiency) {
    if (!efficiencyConfig.value) return 'warning'
    const { threshold, warningThreshold } = efficiencyConfig.value
    if (laborEfficiency >= threshold) return 'pass'
    if (laborEfficiency >= warningThreshold) return 'warning'
    return 'fail'
  }

  return {
    currentTeam,
    teams,
    recentReports,
    efficiencyConfig,
    hasSelectedTeam,
    setTeam,
    loadStoredTeam,
    setTeams,
    addReport,
    setReports,
    setEfficiencyConfig,
    getPassStatus,
  }
})
