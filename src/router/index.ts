import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/roulette', name: 'roulette', component: () => import('../views/RouletteView.vue') },
    { path: '/ai-cupid', name: 'ai-cupid', component: () => import('../views/AiCupidView.vue') },
    { path: '/memories', name: 'memories', component: () => import('../views/MemoriesView.vue') },
    { path: '/map', name: 'map', component: () => import('../views/MapView.vue') }
  ]
})

export default router;