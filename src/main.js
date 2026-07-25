import App from './App.vue'
import './assets/main.css'
import { createApp } from 'vue'

import router from './router'
import { initialiseAuth } from './stores/auth'
import { initialiseRatings } from './stores/ratings'

async function startApp() {
  await initialiseAuth()
  initialiseRatings()

  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

startApp()
