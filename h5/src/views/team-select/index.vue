<template>
  <div class="page">
    <div class="header">
      <h1 class="title">选择小组</h1>
      <p class="subtitle">请选择您所在的小组</p>
    </div>

    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>

    <div v-else class="team-list">
      <div
        v-for="team in store.teams"
        :key="team.id"
        class="team-item"
        @click="selectTeam(team)"
      >
        <div class="team-info">
          <span class="team-name">{{ team.name }}</span>
          <span class="warehouse-name">{{ team.warehouseName }}</span>
        </div>
        <span class="arrow">›</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, type Team } from '@/stores/app'
import { getTeams } from '@/api'

const store = useAppStore()
const router = useRouter()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const teams = await getTeams()
    store.setTeams(teams)
  } catch (e) {
    console.error('Failed to load teams:', e)
  } finally {
    loading.value = false
  }
})

function selectTeam(team: Team) {
  store.setTeam(team)
  router.push('/home')
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: var(--spacing-md);
}

.header {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.team-list {
  background-color: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
}

.team-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: var(--color-bg);
  }

  &:last-child {
    border-bottom: none;
  }
}

.team-info {
  flex: 1;
}

.team-name {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.warehouse-name {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.arrow {
  font-size: 20px;
  color: var(--color-text-muted);
}

.loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}
</style>
