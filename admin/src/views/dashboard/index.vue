<template>
  <div class="dashboard">
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-label">本周上报</div>
          <div class="stat-value">
            <span class="font-num">{{ summary.reportedTeamsThisWeek }}</span>
            <span class="stat-unit">/ {{ summary.totalTeams }} 组</span>
          </div>
          <div class="stat-trend">
            <span class="text-muted">未上报 {{ summary.unreportedTeams }} 组</span>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-label">本周人效</div>
          <div class="stat-value">
            <span class="font-num" :class="efficiencyClass">
              {{ summary.avgEfficiency || '0' }}
            </span>
          </div>
          <div class="stat-trend">
            <span :class="compareClass">
              {{ compareText }}
            </span>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-label">达标率</div>
          <div class="stat-value">
            <span class="font-num" :class="passRateClass">
              {{ summary.passRate || '0' }}%
            </span>
          </div>
          <div class="stat-trend">
            <span class="text-muted">目标: {{ summary.target || 1 }} 人效</span>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-label">对比上月</div>
          <div class="stat-value">
            <span class="font-num" :class="compareMonthClass">
              {{ summary.compareLastMonth > 0 ? '+' : '' }}{{ summary.compareLastMonth || 0 }}%
            </span>
          </div>
          <div class="stat-trend">
            <span class="text-muted">人效变化</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <el-col :span="16">
        <div class="card">
          <div class="card-header">
            <span class="card-title">近4周趋势</span>
          </div>
          <div class="card-body chart-container">
            <div v-if="trendData.length === 0" class="empty-tip">
              暂无趋势数据
            </div>
            <div v-else class="trend-chart">
              <div
                v-for="(item, index) in trendData"
                :key="index"
                class="trend-item"
              >
                <div class="trend-label">{{ item.week }}周</div>
                <div class="trend-bar-container">
                  <div
                    class="trend-bar"
                    :style="{ height: `${Math.min(item.efficiency * 100, 100)}%` }"
                    :class="getEfficiencyClass(item.efficiency)"
                  ></div>
                </div>
                <div class="trend-value font-num">{{ item.efficiency }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="card">
          <div class="card-header">
            <span class="card-title">本周排名 TOP 5</span>
          </div>
          <div class="card-body">
            <div v-if="rankingData.length === 0" class="empty-tip">
              暂无排名数据
            </div>
            <div v-else class="ranking-list">
              <div
                v-for="(item, index) in rankingData"
                :key="item.id"
                class="ranking-item"
              >
                <div class="ranking-index" :class="getRankClass(index)">
                  {{ index + 1 }}
                </div>
                <div class="ranking-info">
                  <div class="ranking-name">{{ item.teamName }}</div>
                  <div class="ranking-warehouse text-muted">{{ item.warehouseName }}</div>
                </div>
                <div class="ranking-efficiency font-num" :class="getEfficiencyClass(item.efficiency)">
                  {{ item.efficiency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="card">
          <div class="card-header">
            <span class="card-title">未达标预警</span>
          </div>
          <div class="card-body">
            <el-table :data="warningData" stripe>
              <el-table-column prop="teamName" label="小组" />
              <el-table-column prop="warehouseName" label="仓库" />
              <el-table-column prop="efficiency" label="人效" align="center">
                <template #default="{ row }">
                  <span class="font-num text-danger">{{ row.efficiency }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template #default>
                  <el-tag type="danger" size="small">不达标</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="warningData.length === 0" class="empty-tip">
              暂无预警信息，所有小组均达标
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dashboardApi } from '@/api/dashboard'

const summary = ref<any>({
  totalTeams: 0,
  reportedTeamsThisWeek: 0,
  unreportedTeams: 0,
  avgEfficiency: 0,
  passRate: 0,
  compareLastMonth: 0,
  target: 1
})

const trendData = ref<any[]>([])
const rankingData = ref<any[]>([])
const warningData = ref<any[]>([])

const efficiencyClass = computed(() => {
  const eff = Number(summary.value.avgEfficiency) || 0
  return getEfficiencyClass(eff)
})

const compareClass = computed(() => {
  return summary.value.compareLastMonth >= 0 ? 'text-success' : 'text-danger'
})

const passRateClass = computed(() => {
  const rate = Number(summary.value.passRate) || 0
  return rate >= 80 ? 'text-success' : rate >= 60 ? 'text-warning' : 'text-danger'
})

const compareMonthClass = computed(() => {
  return summary.value.compareLastMonth >= 0 ? 'text-success' : 'text-danger'
})

const compareText = computed(() => {
  const target = summary.value.target || 1
  const eff = Number(summary.value.avgEfficiency) || 0
  return eff >= target ? '✓ 达标' : '⚠ 未达标'
})

const getEfficiencyClass = (efficiency: number) => {
  if (efficiency >= 1.2) return 'text-success'
  if (efficiency >= 1.0) return 'text-success'
  if (efficiency >= 0.8) return 'text-warning'
  return 'text-danger'
}

const getRankClass = (index: number) => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return ''
}

const fetchData = async () => {
  try {
    const [summaryRes, rankingRes, trendRes] = await Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getRanking({ limit: 5 }),
      dashboardApi.getTrend({ months: 4 })
    ])

    summary.value = summaryRes

    if (rankingRes && rankingRes.length > 0) {
      rankingData.value = rankingRes.slice(0, 5)
    }

    if (trendRes && trendRes.length > 0) {
      trendData.value = trendRes
    }

    warningData.value = rankingData.value.filter((item: any) => item.efficiency < 1)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 1400px;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-unit {
  font-size: 14px;
  color: var(--color-text-muted);
}

.stat-trend {
  font-size: 12px;
}

.charts-row {
  margin-bottom: 16px;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.chart-container {
  min-height: 250px;
}

.empty-tip {
  text-align: center;
  color: var(--color-text-muted);
  padding: 40px 0;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding-top: 20px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.trend-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.trend-bar-container {
  width: 40px;
  height: 150px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-end;
}

.trend-bar {
  width: 100%;
  border-radius: var(--radius-sm);
  transition: height 0.3s ease;
}

.trend-bar.text-success {
  background: var(--color-success);
}

.trend-bar.text-warning {
  background: var(--color-warning);
}

.trend-bar.text-danger {
  background: var(--color-danger);
}

.trend-value {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

.ranking-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: var(--color-text-muted);
  color: white;
}

.rank-gold {
  background: #FFD700 !important;
}

.rank-silver {
  background: #C0C0C0 !important;
}

.rank-bronze {
  background: #CD7F32 !important;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-weight: 500;
}

.ranking-warehouse {
  font-size: 12px;
}

.ranking-efficiency {
  font-size: 18px;
  font-weight: 600;
}
</style>
