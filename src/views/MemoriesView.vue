<template>
  <main class="p-6">
    <h2 class="font-serif text-2xl text-warm-purple mb-6 text-center">Nhật Ký Hẹn Hò 📸</h2>
    
    <div class="relative border-l-2 border-soft-pink pl-6 ml-3 space-y-8">
      <div v-for="memory in store.visitedRestaurants" :key="memory.id" class="relative" v-motion-fade-visible>
        <!-- Dấu chấm timeline -->
        <div class="absolute -left-[31px] top-2 w-4 h-4 bg-pastel-rose rounded-full border-4 border-cream-white shadow-sm"></div>
        
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-soft-pink/20">
          <img :src="memory.photoUrl" class="w-full h-40 object-cover" />
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-gray-800">{{ memory.name }}</h3>
              <span class="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{{ memory.dateVisited || 'Đã từng đi' }}</span>
            </div>
            <p class="text-xs text-gray-500 mb-3 flex items-center gap-1">📍 {{ memory.address }}</p>
            <div class="bg-soft-pink/20 p-3 rounded-xl border border-soft-pink/30 relative">
              <span class="absolute -top-3 left-3 text-2xl">❝</span>
              <p class="text-sm text-warm-purple italic pt-1">{{ memory.notes || 'Kỷ niệm tuyệt vời cùng nhau.' }}</p>
            </div>
            <div class="mt-3 flex">
              <span v-for="i in memory.rating" :key="i" class="text-yellow-400 text-sm">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurant';
const store = useRestaurantStore();
</script>