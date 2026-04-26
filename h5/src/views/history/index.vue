<template>
  <div class="page">
    <div class="header">
      <router-link to="/home" class="back-btn">‹ 返回</router-link>
      <h1 class="title">历史记录</h1>
    </div>

    <div v-if="!store.hasSelectedTeam" class="no-team">
      <p>请先选择小组</p>
      <router-link to="/team-select" class="btn-primary">选择小组</router-link>
    </div>

    <div v-else class="content">
      <div class="history-header card">
        <span class="team-name">{{ store.currentTeam?.name }}</span>
      </div>

      <div v-if="loading" class="loading">
        <span>加载中...</span>
      </div>

      <div v-else-if="reports.length === 0" class="empty">
        <span class="empty-text">暂无上报记录</span>
      </div>

      <div v-else class="report-list">
        <div
          v-for="report in reports"
          :key="report.id"
          class="report-item card"
        >
          <div class="report-header">
            <span class="week-label">{{ report.year }}年第{{ report.weekNumber }}周</span>
            <span :class="['status-badge', getStatusClass(report)]">
              {{ getStatusText(report) }}
            </span>
          </div>

          <div class="report-stats">
            <div class="stat-item">
              <span class="stat-value">{{ report.headcount }}</span>
              <span class="stat-label">出勤</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ report.entryQuantity }}</span>
              <span class="stat-label">入库</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ report.exitQuantity }}</span>
              <span class="stat-label">出库</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ report.qualityCheckQuantity }}</span>
              <span class="stat-label">质检</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ report.laborEfficiency?.toFixed(3) || '-' }}</span>
              <span class="stat-label">人效</span>
            </div>
          </div>

          <span class="create-time">{{ report.createTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getWeekReports } from '@/api'

const store = useAppStore()
const loading = ref(false)
const reports = ref<any[]>([])

onMounted(async () => {
  if (!store.hasSelectedTeam) return
  store.loadStoredTeam()

  loading.value = true
  try {
    reports.value = await getWeekReports(store.currentTeam!.id)
    store.setReports(reports.value)
  } catch (e) {
    console.error('Failed to load reports:', e)
  } finally {
    loading.value = false
  }
})

function getStatusClass(report: any) {
  if (!report.laborEfficiency) return ''
  const status = store.getPassStatus(report.laborEfficiency)
  return `status-${status}`
}

function getStatusText(report: any) {
  if (!report.laborEfficiency) return '未知'
  const status = store.getPassStatus(report.laborEfficiency)
  if (status === 'pass') return '达标'
  if (status === 'warning') return '偏低'
  return '不达标'
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
