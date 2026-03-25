import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/path',
    name: 'Path',
    component: () => import('@/views/Path.vue')
  },
  {
    path: '/os',
    name: 'OS',
    component: () => import('@/views/OS.vue')
  },
  {
    path: '/process',
    name: 'Process',
    component: () => import('@/views/Process.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
