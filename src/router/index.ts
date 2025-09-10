// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import ScenesOverview from '../views/SceneOverview.vue'
import Scene from '../views/Scene.vue'

const routes = [
  {
    path: '/',
    redirect: '/scenes-overview'
  },
  {
    path: '/scenes-overview',
    name: 'ScenesOverview',
    component: ScenesOverview
  },
  {
    path: '/scene/:sceneId',
    name: 'Scene',
    component: Scene,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router