import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'toastify-js/src/toastify.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
