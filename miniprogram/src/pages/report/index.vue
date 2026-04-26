<template>
  <view class="page">
    <view v-if="!store.hasSelectedTeam" class="no-team">
      <text class="no-team-text">请先选择小组</text>
      <button class="btn-primary" @tap="goToSelect">选择小组</button>
    </view>

    <view v-else class="form">
      <view class="form-header card">
        <text class="team-name">{{ store.currentTeam?.name }}</text>
        <text class="week-info">{{ weekPeriod.year }}年第{{ weekPeriod.weekNumber }}周</text>
      </view>

      <view class="form-body">
        <view class="form-group card">
          <text class="form-label">出勤人数</text>
          <input
            v-model="form.headcount"
            type="number"
            placeholder="请输入出勤人数"
            class="form-input"
            @input="calculateEfficiency"
          />
        </view>

        <view class="form-group card">
          <text class="form-label">入库数量</text>
          <input
            v-model="form.entryQuantity"
            type="number"
            placeholder="请输入入库数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </view>

        <view class="form-group card">
          <text class="form-label">出库数量</text>
          <input
            v-model="form.exitQuantity"
            type="number"
            placeholder="请输入出库数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </view>

        <view class="form-group card">
          <text class="form-label">质检数量</text>
          <input
            v-model="form.qualityCheckQuantity"
            type="number"
            placeholder="请输入质检数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </view>

        <view class="form-group card">
          <text class="form-label">上架数量</text>
          <input
            v-model="form.shelvingQuantity"
            type="number"
            placeholder="请输入上架数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </view>

        <view class="efficiency-display card">
          <text class="efficiency-label">实时人效</text>
          <text :class="['efficiency-value', efficiencyClass]">
            {{ laborEfficiency > 0 ? laborEfficiency.toFixed(3) : '-' }}
          </text>
          <text v-if="laborEfficiency > 0" :class="['efficiency-status', efficiencyClass]">
            {{ efficiencyText }}
          </text>
        </view>

        <button
          class="btn-submit"
          :disabled="!isFormValid || submitting"
          @tap="submitReport"
        >
          {{ submitting ? '提交中...' : '提交周报' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../../stores/app'
import { getCurrentWeekPeriod, submitWeekReport, calculateLaborEfficiency, WeekPeriod, WeekReport } from '../../api'

const store = useAppStore()
const weekPeriod = ref({ year: 0, weekNumber: 0, startDate: '', endDate: '' })
const submitting = ref(false)

const form = ref({
  headcount: '',
  entryQuantity: '',
  exitQuantity: '',
  qualityCheckQuantity: '',
  shelvingQuantity: '',
})

const laborEfficiency = ref(0)

const isFormValid = computed(() => {
  const { headcount, entryQuantity, exitQuantity, qualityCheckQuantity, shelvingQuantity } = form.value
  return (
    Number(headcount) > 0 &&
    (Number(entryQuantity) > 0 || Number(exitQuantity) > 0 ||
     Number(qualityCheckQuantity) > 0 || Number(shelvingQuantity) > 0)
  )
})

const efficiencyClass = computed(() => {
  if (laborEfficiency.value <= 0) return ''
  return `status-${store.getPassStatus(laborEfficiency.value)}`
})

const efficiencyText = computed(() => {
  if (laborEfficiency.value <= 0) return ''
  const status = store.getPassStatus(laborEfficiency.value)
  if (status === 'pass') return '达标'
  if (status === 'warning') return '偏低'
  return '不达标'
})

onMounted(async () => {
  if (!store.hasSelectedTeam) return
  store.loadStoredTeam()

  try {
    weekPeriod.value = await getCurrentWeekPeriod()
  } catch (e) {
    console.error('Failed to load week period:', e)
  }
})

function calculateEfficiency() {
  const entry = Number(form.value.entryQuantity) || 0
  const exit = Number(form.value.exitQuantity) || 0
  const quality = Number(form.value.qualityCheckQuantity) || 0
  const shel = Number(form.value.shelvingQuantity) || 0
  const headcount = Number(form.value.headcount) || 0

  laborEfficiency.value = calculateLaborEfficiency(entry, exit, quality, shel, headcount)
}

async function submitReport() {
  if (!isFormValid.value || !store.currentTeam) return

  submitting.value = true

  try {
    const reportData = {
      teamId: store.currentTeam.id,
      weekNumber: weekPeriod.value.weekNumber,
      year: weekPeriod.value.year,
      headcount: Number(form.value.headcount),
      entryQuantity: Number(form.value.entryQuantity) || 0,
      exitQuantity: Number(form.value.exitQuantity) || 0,
      qualityCheckQuantity: Number(form.value.qualityCheckQuantity) || 0,
      shelvingQuantity: Number(form.value.shelvingQuantity) || 0,
      laborEfficiency: laborEfficiency.value,
    }

    await submitWeekReport(reportData)

    wx.showToast({ title: '提交成功', icon: 'success' })

    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (e) {
    wx.showToast({ title: '提交失败', icon: 'none' })
    console.error('Failed to submit report:', e)
  } finally {
    submitting.value = false
  }
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

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.team-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.week-info {
  display: block;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #FFFFFF;
}

.efficiency-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
}

.efficiency-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.efficiency-value {
  font-size: 36px;
  font-weight: 700;
}

.efficiency-status {
  font-size: 14px;
  margin-top: var(--spacing-xs);
}

.btn-submit {
  background-color: var(--color-primary);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  margin-top: var(--spacing-md);
}

.btn-submit[disabled] {
  background-color: var(--color-text-muted);
}
</style>
