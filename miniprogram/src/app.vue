<template>
  <view id="app"></view>
</template>

<script>
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'

const App = createApp({
  onShow() {
    console.log('App onShow')
  },
})

App.use(createPinia())

export default App
</script>
