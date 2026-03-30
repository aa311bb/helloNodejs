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
  },
  {
    path: '/child-process',
    name: 'ChildProcess',
    component: () => import('@/views/ChildProcess.vue')
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/Events.vue')
  },
  {
    path: '/util',
    name: 'Util',
    component: () => import('@/views/Util.vue')
  },
  {
    path: '/fs',
    name: 'Fs',
    component: () => import('@/views/Fs.vue')
  },
  {
    path: '/crypto-zlib',
    name: 'CryptoZlib',
    component: () => import('@/views/CryptoZlib.vue')
  },
  {
    path: '/http',
    name: 'Http',
    component: () => import('@/views/Http.vue')
  },
  {
    path: '/express',
    name: 'Express',
    component: () => import('@/views/Express.vue')
  },
  {
    path: '/express-mysql',
    name: 'ExpressMysql',
    component: () => import('@/views/ExpressMysql.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
