// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import ScenesOverview from '../views/SceneOverview.vue'
import Scene from '../views/Scene.vue'
import fourOhFour from '../views/404.vue'
import { useCanvas } from '@/composables/useCanvas'


const routes = [
  {
    path: '/',
    name: 'ScenesOverview',
    component: ScenesOverview
  },
  {
    path: '/',
    name: 'ScenesOverview',
    component: ScenesOverview
  },
  {
    path: '/scene/:sceneId',
    name: 'Scene',
    component: Scene,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router