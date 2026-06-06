<template>
  <nav class="fixed bottom-0 w-full max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-soft-pink flex justify-around py-3 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
    <router-link to="/" class="nav-item flex-1" active-class="active">
      <ListIcon class="w-6 h-6 mb-1" />
      <span>Danh sách</span>
    </router-link>
    <div class="w-px h-8 bg-soft-pink/30 my-auto"></div>
    <router-link to="/roulette" class="nav-item flex-1" active-class="active">
      <DicesIcon class="w-6 h-6 mb-1" />
      <span>Quay số</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ListIcon, DicesIcon } from 'lucide-vue-next'
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center text-gray-400 text-[11px] font-medium transition-colors duration-300;
}
.nav-item.active {
  @apply text-warm-purple;
}
</style>