import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import router from './router'


import './assets/main.css'

createApp(App).use(router).use(VueKonva).mount('#app')
