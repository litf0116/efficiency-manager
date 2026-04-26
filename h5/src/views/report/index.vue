<template>
  <div class="page">
    <div class="header">
      <router-link to="/home" class="back-btn">‹ 返回</router-link>
      <h1 class="title">周报上报</h1>
    </div>

    <div v-if="!store.hasSelectedTeam" class="no-team">
      <p>请先选择小组</p>
      <router-link to="/team-select" class="btn-primary">选择小组</router-link>
    </div>

    <div v-else class="form">
      <div class="form-header card">
        <span class="team-name">{{ store.currentTeam?.name }}</span>
        <span class="week-info">{{ weekPeriod.year }}年第{{ weekPeriod.weekNumber }}周</span>
      </div>

      <div class="form-body">
        <div class="form-group card">
          <label class="form-label">出勤人数</label>
          <input
            v-model="form.headcount"
            type="number"
            placeholder="请输入出勤人数"
            class="form-input"
            @input="calculateEfficiency"
          />
        </div>

        <div class="form-group card">
          <label class="form-label">入库数量</label>
          <input
            v-model="form.entryQuantity"
            type="number"
            placeholder="请输入入库数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </div>

        <div class="form-group card">
          <label class="form-label">出库数量</label>
          <input
            v-model="form.exitQuantity"
            type="number"
            placeholder="请输入出库数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </div>

        <div class="form-group card">
          <label class="form-label">质检数量</label>
          <input
            v-model="form.qualityCheckQuantity"
            type="number"
            placeholder="请输入质检数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </div>

        <div class="form-group card">
          <label class="form-label">上架数量</label>
          <input
            v-model="form.shelvingQuantity"
            type="number"
            placeholder="请输入上架数量"
            class="form-input"
            @input="calculateEfficiency"
          />
        </div>

        <div class="efficiency-display card">
          <span class="efficiency-label">实时人效</span>
          <span :class="['efficiency-value', efficiencyClass]">
            {{ laborEfficiency > 0 ? laborEfficiency.toFixed(3) : '-' }}
          </span>
          <span v-if="laborEfficiency > 0" :class="['efficiency-status', efficiencyClass]">
            {{ efficiencyText }}
          </span>
        </div>

        <button
          class="btn-submit"
          :disabled="!isFormValid || submitting"
          @click="submitReport"
        >
          {{ submitting ? '提交中...' : '提交周报' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getCurrentWeekPeriod, submitWeekReport } from '@/api'

const store = useAppStore()
const router = useRouter()
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

  if (headcount <= 0) {
    laborEfficiency.value = 0
    return
  }

  laborEfficiency.value = (entry + exit + quality + shel) / headcount
}

async function submitReport() {
  if (!isFormValid.value || !store.currentTeam) return

  submitting.value = true

  try {
    await submitWeekReport({
      teamId: store.currentTeam.id,
      weekNumber: weekPeriod.value.weekNumber,
      year: weekPeriod.value.year,
      headcount: Number(form.value.headcount),
      entryQuantity: Number(form.value.entryQuantity) || 0,
      exitQuantity: Number(form.value.exitQuantity) || 0,
      qualityCheckQuantity: Number(form.value.qualityCheckQuantity) || 0,
      shelvingQuantity: Number(form.value.shelvingQuantity) || 0,
    })

    alert('提交成功')
    router.push('/home')
  } catch (e: any) {
    alert('提交失败: ' + e.message)
  } finally {
    submitting.value = false
  }
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

.form {
  padding: var(--spacing-md);
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
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
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
  cursor: pointer;
  width: 100%;

  &:disabled {
    background-color: var(--color-text-muted);
    cursor: not-allowed;
  }
}
</style>
