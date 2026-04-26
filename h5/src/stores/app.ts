import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  role: string
  realName?: string
  teamId?: number
}

export interface Team {
  id: number
  name: string
  warehouseId: number
  warehouseName?: string
}

export interface EfficiencyConfig {
  threshold: number
  warningThreshold: number
}

export const useAppStore = defineStore('app', () => {
  const user = ref<User | null>(null)
  const currentTeam = ref<Team | null>(null)
  const teams = ref<Team[]>([])
  const recentReports = ref<any[]>([])
  const efficiencyConfig = ref<EfficiencyConfig | null>(null)

  const isLoggedIn = computed(() => user.value !== null)
  const hasSelectedTeam = computed(() => currentTeam.value !== null)

  function setUser(u: User) {
    user.value = u
    if (u.teamId) {
      currentTeam.value = { id: u.teamId, name: '', warehouseId: 0 }
    }
  }

  function setTeam(team: Team) {
    currentTeam.value = team
    localStorage.setItem('selectedTeam', JSON.stringify(team))
  }

  function loadStoredTeam() {
    const stored = localStorage.getItem('selectedTeam')
    if (stored) {
      try {
        currentTeam.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored team:', e)
      }
    }
  }

  function loadUser() {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }
  }

  function setTeams(list: Team[]) {
    teams.value = list
  }

  function addReport(report: any) {
    recentReports.value.unshift(report)
  }

  function setReports(reports: any[]) {
    recentReports.value = reports
  }

  function setEfficiencyConfig(config: EfficiencyConfig) {
    efficiencyConfig.value = config
  }

  function getPassStatus(laborEfficiency: number): 'pass' | 'warning' | 'fail' {
    if (!efficiencyConfig.value) return 'warning'
    const { threshold, warningThreshold } = efficiencyConfig.value
    if (laborEfficiency >= threshold) return 'pass'
    if (laborEfficiency >= warningThreshold) return 'warning'
    return 'fail'
  }

  function logout() {
    user.value = null
    currentTeam.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedTeam')
  }

  return {
    user,
    currentTeam,
    teams,
    recentReports,
    efficiencyConfig,
    isLoggedIn,
    hasSelectedTeam,
    setUser,
    setTeam,
    loadStoredTeam,
    loadUser,
    setTeams,
    addReport,
    setReports,
    setEfficiencyConfig,
    getPassStatus,
    logout,
  }
})
