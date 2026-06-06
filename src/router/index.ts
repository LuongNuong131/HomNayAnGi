import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/roulette', name: 'roulette', component: () => import('../views/RouletteView.vue') }
  ]
})

export default router;