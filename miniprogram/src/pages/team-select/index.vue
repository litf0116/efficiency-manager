<template>
  <view class="page">
    <view class="header">
      <text class="title">选择小组</text>
      <text class="subtitle">请选择您所在的小组</text>
    </view>

    <view class="team-list">
      <view
        v-for="team in store.teams"
        :key="team.id"
        class="team-item"
        @tap="selectTeam(team)"
      >
        <view class="team-info">
          <text class="team-name">{{ team.name }}</text>
          <text class="warehouse-name">{{ team.warehouseName }}</text>
        </view>
        <view class="arrow">›</view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../../stores/app'
import { getTeams, Team } from '../../api'

const store = useAppStore()
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

function selectTeam(team) {
  store.setTeam(team)
  wx.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
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
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  display: block;
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
}

.team-item:last-child {
  border-bottom: none;
}

.team-item:active {
  background-color: var(--color-bg);
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
