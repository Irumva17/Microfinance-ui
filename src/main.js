import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './Router/router'
import mixins from "./mixins"
import store from './store'
import axios from '@/axios'
window.axios = axios

createApp(App)
.use(router)
.use(store)
.mixin(mixins)
.mount('#app')
