<template>
  <div class="page">
    <div class="header">
      <h1 class="app-name">仓储人效管理</h1>
      <p class="team-info" v-if="store.currentTeam">
        {{ store.currentTeam.name }}
      </p>
      <p class="team-info" v-else>
        <router-link to="/team-select" class="link">点击选择小组</router-link>
      </p>
    </div>

    <div class="grid-container">
      <div class="grid">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="grid-item"
        >
          <div class="item-icon" :style="{ backgroundColor: item.bgColor }">
            <span class="icon-text">{{ item.icon }}</span>
          </div>
          <span class="item-label">{{ item.label }}</span>
        </router-link>
      </div>
    </div>

    <div class="footer">
      <p class="version">v1.0.0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const menuItems = [
  { path: '/dashboard', label: '数据看板', icon: '📊', bgColor: '#EBF5FF' },
  { path: '/report', label: '周报上报', icon: '📝', bgColor: '#F0FDF4' },
  { path: '/history', label: '历史记录', icon: '📋', bgColor: '#FEF3C7' },
]

onMounted(() => {
  store.loadStoredTeam()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
}

.app-name {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.team-info {
  font-size: 14px;
  opacity: 0.9;
}

.link {
  color: white;
  text-decoration: underline;
}

.grid-container {
  flex: 1;
  padding: var(--spacing-md);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
}

.item-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.icon-text {
  font-size: 28px;
}

.item-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.footer {
  padding: var(--spacing-md);
  text-align: center;
}

.version {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
