<template>
  <div class="login-page">
    <div class="login-box">
      <div class="logo">
        <h1>仓储人效管理</h1>
        <p>移动端演示登录</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
          />
        </div>

        <div class="tips">
          <p>演示账号：zhangsan / 888888</p>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { login } from '@/api'

const router = useRouter()
const store = useAppStore()
const loading = ref(false)

const form = ref({
  username: '',
  password: '',
})

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    const result = await login({
      username: form.value.username,
      password: form.value.password,
    })

    localStorage.setItem('token', result.token)
    localStorage.setItem('user', JSON.stringify(result.user))

    store.setUser(result.user)

    router.push('/home')
  } catch (e: any) {
    alert(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  padding: var(--spacing-md);
}

.login-box {
  width: 100%;
  max-width: 360px;
  background-color: var(--color-surface);
  border-radius: 16px;
  padding: var(--spacing-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo {
  text-align: center;
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  p {
    font-size: 14px;
    color: var(--color-text-secondary);
  }
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--color-bg);
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.tips {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--color-bg);
  border-radius: 8px;
  text-align: center;

  p {
    font-size: 13px;
    color: var(--color-text-secondary);
  }
}

.btn-login {
  width: 100%;
  padding: 14px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: var(--color-text-muted);
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    background-color: var(--color-primary-dark);
  }
}
</style>
