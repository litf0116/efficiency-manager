import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.vue'
import './styles/global.scss'

const app = createApp(App)
app.use(createPinia())
export default app
