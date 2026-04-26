<template>
  <view class="page">
    <view v-if="!store.hasSelectedTeam" class="no-team">
      <text class="no-team-text">请先选择小组</text>
      <button class="btn-primary" @tap="goToSelect">选择小组</button>
    </view>

    <view v-else class="history">
      <view class="history-header card">
        <text class="team-name">{{ store.currentTeam?.name }}</text>
      </view>

      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="reports.length === 0" class="empty">
        <text class="empty-text">暂无上报记录</text>
      </view>

      <view v-else class="report-list">
        <view
          v-for="report in reports"
          :key="report.id"
          class="report-item card"
        >
          <view class="report-header">
            <text class="week-label">{{ report.year }}年第{{ report.weekNumber }}周</text>
            <text :class="['status-badge', getStatusClass(report)]">
              {{ getStatusText(report) }}
            </text>
          </view>

          <view class="report-stats">
            <view class="stat-item">
              <text class="stat-value">{{ report.headcount }}</text>
              <text class="stat-label">出勤</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ report.entryQuantity }}</text>
              <text class="stat-label">入库</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ report.exitQuantity }}</text>
              <text class="stat-label">出库</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ report.qualityCheckQuantity }}</text>
              <text class="stat-label">质检</text>
            </view>
            <view class="stat-item">
              <text class="stat-value">{{ report.laborEfficiency?.toFixed(3) || '-' }}</text>
              <text class="stat-label">人效</text>
            </view>
          </view>

          <text class="create-time">{{ report.createTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../../stores/app'
import { getWeekReports, WeekReport } from '../../api'

const store = useAppStore()
const loading = ref(false)
const reports = ref([])

onMounted(async () => {
  if (!store.hasSelectedTeam) return
  store.loadStoredTeam()

  loading.value = true
  try {
    reports.value = await getWeekReports(store.currentTeam.id)
    store.setReports(reports.value)
  } catch (e) {
    console.error('Failed to load reports:', e)
  } finally {
    loading.value = false
  }
})

function getStatusClass(report) {
  if (!report.laborEfficiency) return ''
  const status = store.getPassStatus(report.laborEfficiency)
  return `status-${status}`
}

function getStatusText(report) {
  if (!report.laborEfficiency) return '未知'
  const status = store.getPassStatus(report.laborEfficiency)
  if (status === 'pass') return '达标'
  if (status === 'warning') return '偏低'
  return '不达标'
}

function goToSelect() {
  wx.redirectTo({ url: '/pages/team-select/index' })
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

.history-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.team-name {
  font-size: 18px;
  font-weight: 600;
}

.loading, .empty {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.report-item {
  display: flex;
  flex-direction: column;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.week-label {
  font-size: 16px;
  font-weight: 600;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--color-bg);
}

.report-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.create-time {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: right;
}
</style>
