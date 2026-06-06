<template>
  <div class="min-h-screen bg-cream-white text-gray-800 font-sans pb-20 max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
    <!-- Header -->
    <header class="bg-soft-pink text-warm-purple py-4 px-6 rounded-b-3xl shadow-sm z-10 relative">
      <h1 class="text-2xl font-serif font-bold text-center">LuNu ❤️ Bé Yêu</h1>
      <p class="text-xs text-center mt-1 font-medium opacity-80">Hôm Nay Ăn Gì?</p>
    </header>

    <!-- Page Content with Transition -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

body {
  background-color: #f5f5f5; /* Màu nền ngoài app khi xem trên desktop */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>