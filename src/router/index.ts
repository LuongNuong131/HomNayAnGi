import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/roulette', name: 'roulette', component: () => import('@/views/RouletteView.vue') },
    { path: '/ai-advisor', name: 'ai-advisor', component: () => import('@/views/AiAdvisorView.vue') },
    { path: '/explore', name: 'explore', component: () => import('@/views/ExploreView.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router