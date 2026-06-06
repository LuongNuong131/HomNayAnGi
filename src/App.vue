<template>
  <div class="min-h-screen bg-ios-bg text-gray-800 font-sans pb-28 max-w-md mx-auto shadow-2xl relative overflow-x-hidden selection:bg-soft-pink">
    
    <!-- Glassmorphism Header -->
    <header class="sticky top-0 z-40 bg-ios-bg/70 backdrop-blur-xl pt-12 pb-4 px-6 border-b border-gray-200/50">
      <h1 class="text-3xl font-serif font-bold text-center bg-gradient-to-r from-warm-purple to-pastel-rose bg-clip-text text-transparent">LuNu ❤️ Bé Yêu</h1>
      <p class="text-[10px] text-center mt-1 font-bold text-warm-purple/60 uppercase tracking-widest">Nhật ký ẩm thực</p>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>