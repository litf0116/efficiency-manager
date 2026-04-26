<template>
  <view class="page">
    <view v-if="!store.hasSelectedTeam" class="no-team">
      <text class="no-team-text">请先选择小组</text>
      <button class="btn-primary" @tap="goToSelect">选择小组</button>
    </view>

    <view v-else class="dashboard">
      <view class="team-card card">
        <text class="team-name">{{ store.currentTeam?.name }}</text>
        <text class="warehouse">{{ store.currentTeam?.warehouseName }}</text>
      </view>

      <view class="current-week card">
        <text class="section-title">本周数据</text>
        <view class="week-info">
          <text>{{ weekPeriod.year }}年第{{ weekPeriod.weekNumber }}周</text>
          <text class="date-range">{{ weekPeriod.startDate }} ~ {{ weekPeriod.endDate }}</text>
        </view>

        <view v-if="currentReport" class="report-summary">
          <view class="stat-row">
            <text class="stat-label">出勤人数</text>
            <text class="stat-value">{{ currentReport.headcount }}人</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">入库</text>
            <text class="stat-value">{{ currentReport.entryQuantity }}</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">出库</text>
            <text class="stat-value">{{ currentReport.exitQuantity }}</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">质检</text>
            <text class="stat-value">{{ currentReport.qualityCheckQuantity }}</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">人效</text>
            <text :class="['stat-value', getStatusClass()]">
              {{ currentReport.laborEfficiency?.toFixed(3) || '-' }}
            </text>
          </view>
        </view>

        <view v-else class="no-report">
          <text>本周暂无上报数据</text>
          <button class="btn-report" @tap="goToReport">去上报</button>
        </view>
      </view>

      <view class="efficiency-info card">
        <text class="section-title">人效达标线</text>
        <view class="threshold-row">
          <text class="threshold-label">达标阈值</text>
          <text class="threshold-value pass">{{ config?.threshold || '-' }}</text>
        </view>
        <view class="threshold-row">
          <text class="threshold-label">预警阈值</text>
          <text class="threshold-value warning">{{ config?.warningThreshold || '-' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../../stores/app'
import { getCurrentWeekPeriod, getEfficiencyConfig, getWeekReports, WeekPeriod, EfficiencyConfig, WeekReport } from '../../api'

const store = useAppStore()
const weekPeriod = ref({ year: 0, weekNumber: 0, startDate: '', endDate: '' })
const config = ref(null)
const currentReport = ref(null)

onMounted(async () => {
  if (!store.hasSelectedTeam) return

  store.loadStoredTeam()

  try {
    const [period, cfg, reports] = await Promise.all([
      getCurrentWeekPeriod(),
      getEfficiencyConfig(),
      getWeekReports(store.currentTeam.id),
    ])

    weekPeriod.value = period
    config.value = cfg
    store.setEfficiencyConfig(cfg)

    currentReport.value = reports.find(
      r => r.year === period.year && r.weekNumber === period.weekNumber
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

function goToSelect() {
  wx.redirectTo({ url: '/pages/team-select/index' })
}

function goToReport() {
  wx.switchTab({ url: '/pages/report/index' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: var(--spacing-md);
}

.no-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.no-team-text {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.team-card {
  display: flex;
  flex-direction: column;
}

.team-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
}

.no-report text {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.btn-report {
  background-color: var(--color-primary);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
}

.efficiency-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.threshold-row {
  display: flex;
  justify-content: space-between;
}

.threshold-label {
  color: var(--color-text-secondary);
}

.threshold-value {
  font-weight: 600;
}

.threshold-value.pass {
  color: var(--color-success);
}

.threshold-value.warning {
  color: var(--color-warning);
}
</style>
