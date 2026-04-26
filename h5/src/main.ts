import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const storedUser = localStorage.getItem('user')
if (storedUser) {
  try {
    const user = JSON.parse(storedUser)
    pinia.state.value.app.user = user
  } catch (e) {
    console.error('Failed to parse stored user:', e)
  }
}

app.mount('#app')
