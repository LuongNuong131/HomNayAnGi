<template>
  <main class="p-6">
    <div class="flex items-end justify-between mb-6 px-1">
      <h2 class="text-2xl font-serif text-gray-900">Tất cả món ngon</h2>
      <span class="text-xs bg-gray-200/50 text-gray-600 px-3 py-1.5 rounded-full font-bold shadow-inner">{{ store.restaurants.length }} địa điểm</span>
    </div>

    <!-- Danh sách quán ăn (Staggered Animation) -->
    <div class="space-y-4">
      <div 
        v-for="(place, index) in store.restaurants" 
        :key="place.id" 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 40, type: 'spring', stiffness: 250, damping: 25 } }"
        @click="openDetails(place)"
        class="bg-white/90 backdrop-blur-sm p-5 rounded-[24px] shadow-ios border border-white active:scale-[0.98] transition-transform cursor-pointer flex justify-between items-center group"
      >
        <div class="flex-1 pr-4">
          <h4 class="font-bold text-gray-800 text-[15px] mb-1.5 group-hover:text-warm-purple transition-colors">{{ place.name }}</h4>
          <p class="text-[13px] text-gray-500 line-clamp-1 font-medium">📍 {{ place.address }}</p>
        </div>
        <div class="shrink-0 text-[11px] font-bold bg-ios-bg text-gray-600 px-3 py-1.5 rounded-xl shadow-inner">{{ place.price }}</div>
      </div>
    </div>

    <!-- Modal Chi tiết (Bottom Sheet) -->
    <transition name="slide-up">
      <div v-if="selectedPlace" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end" @click.self="selectedPlace = null">
        <div class="bg-ios-bg w-full max-w-md mx-auto rounded-t-[32px] p-6 pb-12 shadow-2xl relative" v-motion-slide-bottom>
          <!-- Grip Bar -->
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
          
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6">
            <h3 class="text-2xl font-serif text-warm-purple mb-3">{{ selectedPlace.name }}</h3>
            <p class="text-sm text-gray-600 mb-5 font-medium leading-relaxed">📍 {{ selectedPlace.address }}</p>
            <div class="inline-block bg-soft-pink/30 text-warm-purple px-4 py-2 rounded-xl text-xs font-bold tracking-wide">
              💰 {{ selectedPlace.price }}
            </div>
          </div>

          <div class="space-y-3 mb-8">
            <div v-if="selectedPlace.advantage" class="bg-white p-5 rounded-[24px] border border-green-100 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-green-400"></div>
              <h4 class="text-[11px] font-bold text-green-600 uppercase mb-2 tracking-wider flex items-center gap-1">✨ Ưu điểm</h4>
              <p class="text-[14px] text-gray-700 leading-relaxed">{{ selectedPlace.advantage }}</p>
            </div>
            
            <div v-if="selectedPlace.disadvantages" class="bg-white p-5 rounded-[24px] border border-red-100 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
              <h4 class="text-[11px] font-bold text-red-600 uppercase mb-2 tracking-wider flex items-center gap-1">⚠️ Nhược điểm</h4>
              <p class="text-[14px] text-gray-700 leading-relaxed">{{ selectedPlace.disadvantages }}</p>
            </div>
          </div>

          <div class="flex gap-3 px-1">
            <button @click="selectedPlace = null" class="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-[16px] font-bold text-sm shadow-sm active:bg-gray-50 transition-colors">Đóng</button>
            <a 
              v-if="selectedPlace.linkmap" 
              :href="selectedPlace.linkmap" 
              target="_blank"
              class="flex-[2] bg-gradient-to-br from-warm-purple to-[#6B4C65] text-white py-4 rounded-[16px] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-warm-purple/30 active:scale-95 transition-transform"
            >
              Mở Bản Đồ
            </a>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRestaurantStore } from '../stores/restaurant';
import type { Restaurant } from '../types';

const store = useRestaurantStore();
const selectedPlace = ref<Restaurant | null>(null);

const openDetails = (place: Restaurant) => {
  selectedPlace.value = place;
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
}
</style>