<template>
  <main class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-serif text-warm-purple">Tất cả món ngon 🍲</h2>
      <span class="text-xs bg-soft-pink/30 text-warm-purple px-3 py-1 rounded-full font-medium">{{ store.restaurants.length }} địa điểm</span>
    </div>

    <!-- Danh sách quán ăn -->
    <div class="space-y-4 mb-20">
      <div 
        v-for="place in store.restaurants" 
        :key="place.id" 
        @click="openDetails(place)"
        class="bg-white p-4 rounded-2xl shadow-sm border border-soft-pink/20 active:scale-95 transition-transform cursor-pointer flex justify-between items-center"
      >
        <div class="flex-1 pr-4">
          <h4 class="font-bold text-gray-800 text-sm mb-1">{{ place.name }}</h4>
          <p class="text-xs text-gray-500 line-clamp-1">📍 {{ place.address }}</p>
        </div>
        <span class="shrink-0 text-[10px] bg-soft-pink/40 text-warm-purple px-2 py-1 rounded-lg">{{ place.price }}</span>
      </div>
    </div>

    <!-- Modal Chi tiết -->
    <div v-if="selectedPlace" class="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end backdrop-blur-sm" @click.self="selectedPlace = null">
      <div class="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 pb-10" v-motion-slide-bottom>
        <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h3 class="text-2xl font-serif text-warm-purple mb-2">{{ selectedPlace.name }}</h3>
        <p class="text-sm text-gray-600 mb-4">📍 {{ selectedPlace.address }}</p>
        <div class="inline-block bg-soft-pink/30 text-warm-purple px-3 py-1 rounded-full text-xs font-bold mb-6">💰 {{ selectedPlace.price }}</div>

        <div class="space-y-4 mb-8">
          <div v-if="selectedPlace.advantage" class="bg-green-50 p-4 rounded-2xl border border-green-100">
            <h4 class="text-xs font-bold text-green-700 uppercase mb-1">✨ Ưu điểm</h4>
            <p class="text-sm text-gray-700">{{ selectedPlace.advantage }}</p>
          </div>
          
          <div v-if="selectedPlace.disadvantages" class="bg-red-50 p-4 rounded-2xl border border-red-100">
            <h4 class="text-xs font-bold text-red-700 uppercase mb-1">⚠️ Nhược điểm</h4>
            <p class="text-sm text-gray-700">{{ selectedPlace.disadvantages }}</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="selectedPlace = null" class="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-medium text-sm">Đóng</button>
          <a 
            v-if="selectedPlace.linkmap" 
            :href="selectedPlace.linkmap" 
            target="_blank"
            class="flex-[2] bg-warm-purple text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
          >
            Mở Bản Đồ
          </a>
        </div>
      </div>
    </div>
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