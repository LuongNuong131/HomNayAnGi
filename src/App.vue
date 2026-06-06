<template>
  <div class="app-shell min-h-screen font-body pb-28 max-w-[430px] mx-auto relative overflow-x-hidden">

    <!-- Ambient background blobs -->
    <div class="fixed inset-0 pointer-events-none z-0 max-w-[430px] mx-auto" aria-hidden="true">
      <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40"
           style="background: radial-gradient(circle, #F5C4CF 0%, transparent 70%); filter: blur(40px);"></div>
      <div class="absolute top-1/2 -left-20 w-56 h-56 rounded-full opacity-30"
           style="background: radial-gradient(circle, #C9A96E 0%, transparent 70%); filter: blur(48px);"></div>
      <div class="absolute bottom-40 right-0 w-64 h-64 rounded-full opacity-25"
           style="background: radial-gradient(circle, #E8899A 0%, transparent 70%); filter: blur(44px);"></div>
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-40 px-6 pt-12 pb-5 relative" 
            style="background: linear-gradient(180deg, rgba(250,247,242,0.92) 0%, rgba(250,247,242,0.75) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
      
      <!-- Tiny decorative line -->
      <div class="flex items-center justify-center gap-3 mb-3">
        <div class="gold-divider w-12"></div>
        <span class="text-[9px] font-body font-semibold tracking-[0.35em] text-gold uppercase opacity-70">Nhật ký ẩm thực</span>
        <div class="gold-divider w-12"></div>
      </div>
      
      <!-- Brand title -->
      <div class="text-center relative">
        <h1 class="font-display text-4xl font-light shimmer-text tracking-tight leading-tight">
          LuNu
        </h1>
        <p class="font-accent text-lg italic text-rose opacity-80 -mt-1 tracking-wide">
          &amp; Bé Yêu
          <span class="inline-block animate-float-slow">🌸</span>
        </p>
      </div>

      <!-- Bottom border gradient -->
      <div class="absolute bottom-0 left-0 right-0 h-px"
           style="background: linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.4) 30%, rgba(232,137,154,0.4) 50%, rgba(201,169,110,0.4) 70%, transparent 100%);"></div>
    </header>

    <!-- Main content -->
    <div class="relative z-10">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>

<style scoped>
.app-shell {
  background-color: #FAF7F2;
  box-shadow: 0 0 80px rgba(90,31,48,0.12);
}
</style>