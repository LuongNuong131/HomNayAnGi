<template>
  <!-- Floating Dock style iOS -->
  <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[340px] bg-white/70 backdrop-blur-2xl border border-white flex justify-around py-4 z-50 rounded-[32px] shadow-ios-float">
    <router-link to="/" class="nav-item flex-1 relative" active-class="active">
      <ListIcon class="w-6 h-6 mb-1 z-10 relative" />
      <span class="z-10 relative">Danh sách</span>
      <div class="active-bg"></div>
    </router-link>
    
    <div class="w-px h-8 bg-gray-200 my-auto"></div>
    
    <router-link to="/roulette" class="nav-item flex-1 relative" active-class="active">
      <DicesIcon class="w-6 h-6 mb-1 z-10 relative" />
      <span class="z-10 relative">Quay số</span>
      <div class="active-bg"></div>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ListIcon, DicesIcon } from 'lucide-vue-next'
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center text-gray-400 text-[11px] font-semibold transition-all duration-300;
}
.nav-item.active {
  @apply text-warm-purple scale-105;
}
.active-bg {
  @apply absolute inset-0 bg-soft-pink/0 rounded-2xl transition-all duration-300 scale-50 opacity-0;
}
.nav-item.active .active-bg {
  @apply bg-soft-pink/20 scale-100 opacity-100;
}
</style>