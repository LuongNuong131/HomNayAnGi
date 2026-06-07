<template>
  <nav class="bottom-nav-wrap">
    <div class="bottom-nav glass-nav">
      <!-- Active glow -->
      <div class="nav-glow" :style="glowStyle"></div>

      <!-- Home -->
      <router-link to="/" class="nav-item" :class="{ active: isHome }" active-class="">
        <div class="nav-icon-ring" :class="{ active: isHome }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               :stroke="isHome ? '#7A2D45' : '#A8977E'"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span class="nav-label" :class="{ active: isHome }">Danh sách</span>
        <div v-if="isHome" class="nav-dot"></div>
      </router-link>

      <!-- Divider -->
      <div class="nav-divider"></div>

      <!-- Roulette -->
      <router-link to="/roulette" class="nav-item" :class="{ active: isRoulette }" active-class="">
        <div class="nav-icon-ring" :class="{ active: isRoulette }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               :stroke="isRoulette ? '#7A2D45' : '#A8977E'"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
               :style="isRoulette ? 'animation: floatSlow 5s ease-in-out infinite;' : ''">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 8h.01M8 16h.01M12 12h.01M8 8h.01M16 16h.01"/>
          </svg>
        </div>
        <span class="nav-label" :class="{ active: isRoulette }">Quay số</span>
        <div v-if="isRoulette" class="nav-dot"></div>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome     = computed(() => route.path === '/')
const isRoulette = computed(() => route.path === '/roulette')

const glowStyle = computed(() => {
  if (isHome.value)
    return 'background: radial-gradient(ellipse 80% 100% at 25% 50%, rgba(232,137,154,0.15) 0%, transparent 70%);'
  if (isRoulette.value)
    return 'background: radial-gradient(ellipse 80% 100% at 75% 50%, rgba(201,169,110,0.15) 0%, transparent 70%);'
  return ''
})
</script>

<style scoped>
.bottom-nav-wrap {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: calc(min(430px, 100vw) - 48px);
  max-width: 340px;
}

.bottom-nav {
  position: relative;
  border-radius: 30px;
  padding: 6px;
  display: flex;
  gap: 6px;
  border: 1px solid rgba(201,169,110,0.28);
  box-shadow:
    0 20px 60px rgba(90,31,48,0.22),
    0 6px 16px rgba(90,31,48,0.12),
    inset 0 1px 0 rgba(255,255,255,0.9),
    inset 0 -1px 0 rgba(201,169,110,0.1);
  overflow: hidden;
}

.nav-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 30px;
  transition: all 0.5s ease;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px 10px;
  border-radius: 22px;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item.active::before {
  background: linear-gradient(145deg, rgba(245,196,207,0.65), rgba(232,137,154,0.32));
  opacity: 1;
}

.nav-item:active { transform: scale(0.93); }

.nav-icon-ring {
  position: relative;
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.nav-icon-ring.active {
  transform: scale(1.12) translateY(-1px);
}

.nav-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #B0A090;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}
.nav-label.active {
  color: #7A2D45;
  font-weight: 700;
}

.nav-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--rose);
  position: absolute;
  bottom: 6px;
  animation: pulseGlow 2s ease-in-out infinite;
}

.nav-divider {
  width: 1px;
  align-self: stretch;
  margin: 6px 0;
  background: linear-gradient(180deg, transparent, rgba(201,169,110,0.35), transparent);
}
</style>