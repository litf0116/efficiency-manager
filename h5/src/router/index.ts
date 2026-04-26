import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/team-select',
      name: 'team-select',
      component: () => import('@/views/team-select/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/report/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/history/index.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router
