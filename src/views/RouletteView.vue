<template>
  <main class="p-6 pb-24">
    <h2 class="font-serif text-2xl text-warm-purple mb-2 text-center">Hôm nay ăn gì?</h2>
    <p class="text-xs text-center text-gray-500 mb-6">Chọn các món đang phân vân để tạo vòng quay nhé!</p>
    
    <!-- Roulette Wheel Wrapper -->
    <div v-if="candidates.length >= 2" class="relative w-64 h-64 mx-auto mb-10 mt-4">
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-warm-purple z-20 drop-shadow-md"></div>
      
      <div 
        class="w-full h-full rounded-full border-4 border-pastel-rose overflow-hidden relative shadow-lg transition-transform duration-[4000ms] cubic-bezier(0.25, 1, 0.5, 1)"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <div v-for="(place, index) in candidates" :key="place.id" 
             class="absolute w-full h-full origin-center"
             :style="{ transform: `rotate(${(360 / candidates.length) * index}deg)` }">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-1/2 origin-bottom bg-opacity-20 flex items-start pt-6 justify-center text-[10px] font-bold text-warm-purple"
               :class="index % 2 === 0 ? 'bg-soft-pink' : 'bg-white'">
            <span class="rotate-90 origin-left whitespace-nowrap overflow-hidden text-ellipsis w-24 text-center">{{ place.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="w-64 h-64 mx-auto border-2 border-dashed border-soft-pink rounded-full flex items-center justify-center text-center p-6 mb-10 text-sm text-gray-400">
      Hãy chọn ít nhất 2 quán ở bên dưới để tạo vòng quay nha!
    </div>

    <button 
      v-if="candidates.length >= 2"
      @click="spin" 
      :disabled="isSpinning"
      class="w-full bg-gradient-to-r from-pastel-rose to-warm-purple text-white font-bold py-4 rounded-2xl shadow-lg shadow-pastel-rose/50 active:scale-95 transition-all disabled:opacity-50 mb-8"
    >
      {{ isSpinning ? 'Đang quay...' : 'Quay Ngay Cưng!' }}
    </button>

    <!-- Danh sách chọn quán -->
    <h3 class="font-bold text-gray-700 text-sm mb-3">Danh sách cân nhắc:</h3>
    <div class="space-y-2">
      <label v-for="place in store.restaurants" :key="place.id" 
             class="flex items-center p-3 bg-white rounded-xl border border-soft-pink/30 cursor-pointer transition-colors"
             :class="{'bg-soft-pink/10 border-pastel-rose': selectedIds.includes(place.id)}">
        <input type="checkbox" :value="place.id" v-model="selectedIds" class="w-5 h-5 accent-warm-purple rounded-md border-gray-300" />
        <span class="ml-3 text-sm font-medium text-gray-800 line-clamp-1">{{ place.name }}</span>
      </label>
    </div>

    <!-- Modal Kết quả -->
    <div v-if="winner" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm" @click.self="winner = null">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center" v-motion-pop>
        <div class="w-20 h-20 bg-soft-pink/40 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🎉</div>
        <h3 class="text-xl font-serif text-warm-purple font-bold">{{ winner.name }}</h3>
        <p class="text-gray-500 text-sm mt-2 mb-6">📍 {{ winner.address }}</p>
        
        <div class="flex flex-col gap-3">
          <a v-if="winner.linkmap" :href="winner.linkmap" target="_blank" class="w-full bg-warm-purple text-white py-3 rounded-xl font-medium text-sm">Xem Bản Đồ</a>
          <button @click="winner = null" class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm">Quay Lại</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRestaurantStore } from '../stores/restaurant';
import confetti from 'canvas-confetti';
import type { Restaurant } from '../types';

const store = useRestaurantStore();
const selectedIds = ref<number[]>([]);

const candidates = computed(() => {
  return store.restaurants.filter(r => selectedIds.value.includes(r.id));
});

const rotation = ref(0);
const isSpinning = ref(false);
const winner = ref<Restaurant | null>(null);

const spin = () => {
  if (isSpinning.value || candidates.value.length < 2) return;
  isSpinning.value = true;
  winner.value = null;

  const extraSpins = 5 * 360; 
  const randomSliceIndex = Math.floor(Math.random() * candidates.value.length);
  const sliceAngle = 360 / candidates.value.length;
  const targetAngle = extraSpins + (360 - (randomSliceIndex * sliceAngle)) - (sliceAngle / 2);

  rotation.value += targetAngle;

  setTimeout(() => {
    isSpinning.value = false;
    winner.value = candidates.value[randomSliceIndex];
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FFD1DA', '#F4A6B8', '#8B6283'] });
  }, 4000);
};
</script>