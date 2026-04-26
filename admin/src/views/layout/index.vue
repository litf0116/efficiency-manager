<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Box /></el-icon>
        <span>人效管理</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :router="true"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>

        <el-menu-item index="/reports">
          <el-icon><Document /></el-icon>
          <span>周报列表</span>
        </el-menu-item>

        <el-menu-item index="/teams">
          <el-icon><User /></el-icon>
          <span>小组管理</span>
        </el-menu-item>

        <el-menu-item index="/warehouses">
          <el-icon><OfficeBuilding /></el-icon>
          <span>仓库管理</span>
        </el-menu-item>

        <el-menu-item index="/users">
          <el-icon><Setting /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/config/efficiency">
          <el-icon><Tools /></el-icon>
          <span>标准人效</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><Avatar /></el-icon>
              <span>{{ authStore.userInfo?.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Box,
  DataAnalysis,
  Document,
  User,
  OfficeBuilding,
  Setting,
  Tools,
  Avatar,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => {
  return (route.meta.title as string) || ''
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
}

.sidebar {
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-menu {
  border-right: none;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  transition: background var(--spacing-xs);

  &:hover {
    background: var(--color-bg);
  }
}

.main-content {
  background: var(--color-bg);
  padding: 24px;
}
</style>
