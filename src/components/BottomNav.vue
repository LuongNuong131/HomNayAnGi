<template>
  <nav class="fixed bottom-0 w-full max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-soft-pink flex justify-around py-3 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
    <router-link to="/" class="nav-item" active-class="active">
      <HomeIcon class="w-6 h-6" />
      <span>Trang chủ</span>
    </router-link>
    <router-link to="/roulette" class="nav-item" active-class="active">
      <DicesIcon class="w-6 h-6" />
      <span>Quay số</span>
    </router-link>
    <router-link to="/ai-cupid" class="nav-item ai-btn" active-class="active">
      <div class="bg-pastel-rose text-white p-3 rounded-full -mt-8 shadow-lg shadow-pastel-rose/40">
        <SparklesIcon class="w-7 h-7" />
      </div>
      <span class="mt-1">Cupid</span>
    </router-link>
    <router-link to="/memories" class="nav-item" active-class="active">
      <HeartIcon class="w-6 h-6" />
      <span>Kỷ niệm</span>
    </router-link>
    <router-link to="/map" class="nav-item" active-class="active">
      <MapPinIcon class="w-6 h-6" />
      <span>Bản đồ</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { HomeIcon, DicesIcon, SparklesIcon, HeartIcon, MapPinIcon } from 'lucide-vue-next'
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center text-gray-400 text-[10px] transition-colors duration-300;
}
.nav-item.active {
  @apply text-warm-purple;
}
.ai-btn.active div {
  @apply bg-warm-purple shadow-warm-purple/40;
}
</style>