import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据概览' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/index.vue'),
        meta: { title: '周报列表' }
      },
      {
        path: 'teams',
        name: 'Teams',
        component: () => import('@/views/teams/index.vue'),
        meta: { title: '小组管理' }
      },
      {
        path: 'warehouses',
        name: 'Warehouses',
        component: () => import('@/views/warehouses/index.vue'),
        meta: { title: '仓库管理' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'config/efficiency',
        name: 'EfficiencyConfig',
        component: () => import('@/views/config/efficiency.vue'),
        meta: { title: '标准人效配置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 人效管理系统`
  }
  next()
})

export default router
