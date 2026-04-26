<template>
  <div class="page">
    <div class="header">
      <router-link to="/home" class="back-btn">‹ 返回</router-link>
      <h1 class="title">数据看板</h1>
    </div>

    <div v-if="!store.hasSelectedTeam" class="no-team">
      <p>请先选择小组</p>
      <router-link to="/team-select" class="btn-primary">选择小组</router-link>
    </div>

    <div v-else class="content">
      <div class="team-card card">
        <h2 class="team-name">{{ store.currentTeam?.name }}</h2>
        <p class="warehouse">{{ store.currentTeam?.warehouseName }}</p>
      </div>

      <div class="week-card card">
        <h3 class="section-title">本周数据</h3>
        <div class="week-info">
          <span>{{ weekPeriod.year }}年第{{ weekPeriod.weekNumber }}周</span>
          <span class="date-range">{{ weekPeriod.startDate }} ~ {{ weekPeriod.endDate }}</span>
        </div>

        <div v-if="currentReport" class="report-summary">
          <div class="stat-row">
            <span class="stat-label">出勤人数</span>
            <span class="stat-value">{{ currentReport.headcount }}人</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">入库</span>
            <span class="stat-value">{{ currentReport.entryQuantity }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">出库</span>
            <span class="stat-value">{{ currentReport.exitQuantity }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">质检</span>
            <span class="stat-value">{{ currentReport.qualityCheckQuantity }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">人效</span>
            <span :class="['stat-value', getStatusClass()]">
              {{ currentReport.laborEfficiency?.toFixed(3) || '-' }}
            </span>
          </div>
        </div>

        <div v-else class="no-report">
          <p>本周暂无上报数据</p>
          <router-link to="/report" class="btn-primary">去上报</router-link>
        </div>
      </div>

      <div class="config-card card">
        <h3 class="section-title">人效达标线</h3>
        <div class="threshold-row">
          <span class="threshold-label">达标阈值</span>
          <span class="threshold-value pass">{{ config?.threshold || '-' }}</span>
        </div>
        <div class="threshold-row">
          <span class="threshold-label">预警阈值</span>
          <span class="threshold-value warning">{{ config?.warningThreshold || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getCurrentWeekPeriod, getEfficiencyConfig, getWeekReports } from '@/api'

const store = useAppStore()
const weekPeriod = ref({ year: 0, weekNumber: 0, startDate: '', endDate: '' })
const config = ref<{ threshold: number; warningThreshold: number } | null>(null)
const currentReport = ref<any>(null)

onMounted(async () => {
  if (!store.hasSelectedTeam) return

  store.loadStoredTeam()

  try {
    const [period, cfg, reports] = await Promise.all([
      getCurrentWeekPeriod(),
      getEfficiencyConfig(),
      getWeekReports(store.currentTeam!.id),
    ])

    weekPeriod.value = period
    config.value = cfg
    store.setEfficiencyConfig(cfg)

    currentReport.value = reports.find(
      (r: any) => r.year === period.year && r.weekNumber === period.weekNumber
    ) || null
  } catch (e) {
    console.error('Failed to load dashboard data:', e)
  }
})

function getStatusClass() {
  if (!currentReport.value?.laborEfficiency) return ''
  const status = store.getPassStatus(currentReport.value.laborEfficiency)
  return `status-${status}`
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: var(--color-bg);
}

.header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.back-btn {
  font-size: 16px;
  color: var(--color-primary);
  margin-right: var(--spacing-md);
}

.title {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  text-align: center;
  margin-right: 40px;
}

.no-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);

  p {
    color: var(--color-text-secondary);
  }
}

.content {
  padding: var(--spacing-md);
}

.team-card {
  text-align: center;
}

.team-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.warehouse {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.week-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.date-range {
  font-size: 12px;
  color: var(--color-text-muted);
}

.report-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) 0;
}

.stat-label {
  color: var(--color-text-secondary);
}

.stat-value {
  font-weight: 600;
}

.no-report {
  text-align: center;
  padding: var(--spacing-md);

  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }
}

.threshold-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.threshold-label {
  color: var(--color-text-secondary);
}

.threshold-value {
  font-weight: 600;
}
</style>
