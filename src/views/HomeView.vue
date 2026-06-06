<template>
  <div class="relative w-full min-h-screen overflow-hidden bg-background flex flex-col items-center justify-center p-6">
    <div class="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-slate-500/10 rounded-full blur-3xl"></div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
      class="z-10 text-center max-w-3xl flex flex-col items-center"
    >
      <div
        v-motion
        :initial="{ scale: 0.9 }"
        :enter="{ scale: 1, transition: { duration: 1000, type: 'spring' } }"
        class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium"
      >
        <Sparkles class="w-4 h-4 text-primary" />
        <span>Trải nghiệm ẩm thực được hỗ trợ bởi AI</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
        Hôm Nay Ăn Gì?
      </h1>

      <p class="text-lg md:text-xl text-foreground/60 mb-12 max-w-xl">
        Biến việc chọn quán ăn thành một trải nghiệm thông minh. Dựa trên lịch sử, tâm trạng và sở thích cá nhân của bạn.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <router-link to="/roulette" class="w-full sm:w-auto">
          <button class="w-full px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-premium flex items-center justify-center gap-2">
            <Dices class="w-5 h-5" />
            Quay Ngay
          </button>
        </router-link>

        <router-link to="/ai-advisor" class="w-full sm:w-auto">
          <button class="w-full px-8 py-4 glass-panel rounded-full font-semibold text-lg hover:bg-card/80 transition-all flex items-center justify-center gap-2">
            <Bot class="w-5 h-5" />
            Hỏi AI
          </button>
        </router-link>

        <router-link to="/explore" class="w-full sm:w-auto">
          <button class="w-full px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg hover:opacity-80 transition-all flex items-center justify-center gap-2">
            <Map class="w-5 h-5" />
            Khám Phá
          </button>
        </router-link>
      </div>
    </div>

    <div
      v-motion
      :initial="{ y: 0 }"
      :enter="{ y: -15, transition: { repeat: Infinity, repeatType: 'mirror', duration: 4000, ease: 'easeInOut' } }"
      class="hidden lg:flex absolute top-[20%] left-[15%] glass-panel p-4 rounded-2xl items-center gap-4 shadow-premium"
    >
      <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
        <Heart class="w-6 h-6 text-primary fill-primary" />
      </div>
      <div class="text-left">
        <div class="text-sm font-bold text-foreground">Làng Bún Đậu CN2</div>
        <div class="text-xs text-foreground/60">Đã thêm vào mục yêu thích</div>
      </div>
    </div>

    <div
      v-motion
      :initial="{ y: 0 }"
      :enter="{ y: 15, transition: { repeat: Infinity, repeatType: 'mirror', duration: 5000, ease: 'easeInOut' } }"
      class="hidden lg:flex absolute bottom-[25%] right-[15%] glass-panel p-4 rounded-2xl items-center gap-4 shadow-premium"
    >
      <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center">🤖</div>
      <div class="text-left">
        <div class="text-sm font-bold text-foreground">AI Gợi Ý</div>
        <div class="text-xs text-foreground/60">Tối nay đi ăn đồ nướng nhé?</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Dices, Bot, Map, Heart } from 'lucide-vue-next'
</script>