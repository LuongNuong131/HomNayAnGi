<template>
  <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" style="width: calc(min(430px,100vw) - 48px); max-width: 360px;">
    
    <!-- Floating dock container -->
    <div class="relative rounded-[28px] p-1.5"
         style="background: rgba(250,247,242,0.75); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(201,169,110,0.25); box-shadow: 0 16px 48px rgba(90,31,48,0.18), 0 4px 12px rgba(90,31,48,0.1), inset 0 1px 0 rgba(255,255,255,0.8);">
      
      <!-- Glow effect on active side -->
      <div class="absolute inset-0 rounded-[28px] pointer-events-none transition-all duration-500"
           :style="activeGlow"></div>

      <div class="flex gap-1.5 relative z-10">
        
        <!-- Home tab -->
        <router-link to="/" class="nav-tab flex-1 flex flex-col items-center gap-1.5 py-3 px-4 rounded-[20px] transition-all duration-350 relative overflow-hidden group"
                     :class="isHome ? 'active-tab' : 'inactive-tab'"
                     active-class="">
          <!-- Active background pill -->
          <div class="absolute inset-0 rounded-[20px] transition-all duration-350"
               :style="isHome ? 'background: linear-gradient(135deg, rgba(245,196,207,0.6) 0%, rgba(232,137,154,0.3) 100%); opacity: 1;' : 'opacity: 0;'"></div>
          
          <!-- Icon container -->
          <div class="relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-350"
               :class="isHome ? 'scale-110' : 'scale-100 group-hover:scale-105'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                 :style="isHome ? 'color: #7A2D45;' : 'color: #A8977E;'">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          
          <span class="relative z-10 text-[10.5px] font-semibold tracking-wide transition-all duration-350"
                :style="isHome ? 'color: #7A2D45; font-weight: 700;' : 'color: #B0A090;'">
            Danh sách
          </span>
        </router-link>

        <!-- Divider -->
        <div class="self-center w-px h-8" style="background: linear-gradient(180deg, transparent, rgba(201,169,110,0.3), transparent);"></div>

        <!-- Roulette tab -->
        <router-link to="/roulette" class="nav-tab flex-1 flex flex-col items-center gap-1.5 py-3 px-4 rounded-[20px] transition-all duration-350 relative overflow-hidden group"
                     :class="isRoulette ? 'active-tab' : 'inactive-tab'"
                     active-class="">
          <div class="absolute inset-0 rounded-[20px] transition-all duration-350"
               :style="isRoulette ? 'background: linear-gradient(135deg, rgba(201,169,110,0.35) 0%, rgba(245,196,207,0.4) 100%); opacity: 1;' : 'opacity: 0;'"></div>
          
          <div class="relative z-10 w-7 h-7 flex items-center justify-center transition-all duration-350"
               :class="isRoulette ? 'scale-110' : 'scale-100 group-hover:scale-105'">
            <!-- Dice icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                 :class="isRoulette ? 'animate-float-slow' : ''"
                 :style="isRoulette ? 'color: #7A2D45;' : 'color: #A8977E;'">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 8h.01M8 16h.01M12 12h.01M8 8h.01M16 16h.01"/>
            </svg>
          </div>
          
          <span class="relative z-10 text-[10.5px] font-semibold tracking-wide transition-all duration-350"
                :style="isRoulette ? 'color: #7A2D45; font-weight: 700;' : 'color: #B0A090;'">
            Quay số
          </span>
        </router-link>

      </div>
    </div>

  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome     = computed(() => route.path === '/')
const isRoulette = computed(() => route.path === '/roulette')

const activeGlow = computed(() => {
  if (isHome.value) {
    return 'background: radial-gradient(ellipse 70% 70% at 25% 50%, rgba(232,137,154,0.12) 0%, transparent 60%);'
  }
  if (isRoulette.value) {
    return 'background: radial-gradient(ellipse 70% 70% at 75% 50%, rgba(201,169,110,0.12) 0%, transparent 60%);'
  }
  return ''
})
</script>

<style scoped>
.nav-tab {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none !important;
}
.nav-tab:active {
  transform: scale(0.95);
}
</style>