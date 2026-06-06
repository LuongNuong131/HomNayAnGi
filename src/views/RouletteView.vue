<template>
  <main class="p-6 pb-24">
    <div class="text-center mb-8" v-motion-fade>
      <h2 class="font-serif text-2xl text-gray-900 mb-1">Hôm nay ăn gì?</h2>
      <p class="text-[13px] text-gray-500 font-medium">Chọn các món đang phân vân để tạo vòng quay</p>
    </div>
    
    <!-- Vòng quay Premium -->
    <div v-if="candidates.length >= 2" class="relative w-72 h-72 mx-auto mb-12 mt-6">
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-warm-purple z-20 drop-shadow-lg"></div>
      
      <div 
        class="w-full h-full rounded-full border-[6px] border-white overflow-hidden relative shadow-[0_10px_40px_rgba(244,166,184,0.3)] transition-transform duration-[4500ms] cubic-bezier(0.2, 1, 0.3, 1)"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <div v-for="(place, index) in candidates" :key="place.id" 
             class="absolute w-full h-full origin-center"
             :style="{ transform: `rotate(${(360 / candidates.length) * index}deg)` }">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-1/2 origin-bottom flex items-start pt-8 justify-center text-[11px] font-bold text-warm-purple/80 tracking-wide"
               :class="index % 2 === 0 ? 'bg-soft-pink/40 backdrop-blur-sm' : 'bg-white'">
            <span class="rotate-90 origin-left whitespace-nowrap overflow-hidden text-ellipsis w-[100px] text-center drop-shadow-sm">{{ place.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Trạng thái trống -->
    <div v-else class="w-72 h-72 mx-auto border-[3px] border-dashed border-gray-300 rounded-full flex items-center justify-center text-center p-8 mb-12 text-[14px] font-medium text-gray-400" v-motion-pop>
      Hãy tick chọn ít nhất <br> 2 quán bên dưới <br> để tạo vòng quay nha!
    </div>

    <!-- Nút quay -->
    <button 
      v-if="candidates.length >= 2"
      @click="spin" 
      :disabled="isSpinning"
      class="w-full bg-gradient-to-r from-pastel-rose to-warm-purple text-white font-bold text-lg py-4 rounded-[20px] shadow-lg shadow-pastel-rose/40 active:scale-[0.97] transition-all disabled:opacity-50 disabled:scale-100 mb-10"
    >
      {{ isSpinning ? 'Đang quay...' : 'Quay Ngay Cưng!' }}
    </button>

    <!-- Danh sách chọn -->
    <h3 class="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4 ml-2">Danh sách cân nhắc</h3>
    <div class="space-y-3">
      <label v-for="place in store.restaurants" :key="place.id" 
             class="flex items-center p-4 rounded-[20px] cursor-pointer transition-all duration-300"
             :class="selectedIds.includes(place.id) ? 'bg-white ring-2 ring-pastel-rose shadow-lg scale-[1.02]' : 'bg-white/60 border border-white/80 hover:bg-white/80'">
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors"
             :class="selectedIds.includes(place.id) ? 'border-warm-purple bg-warm-purple' : 'border-gray-300 bg-white'">
             <svg v-if="selectedIds.includes(place.id)" class="w-3.5 h-3.5 text-white absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <input type="checkbox" :value="place.id" v-model="selectedIds" class="hidden" />
        <div class="ml-4 flex-1">
          <span class="text-[14px] font-bold transition-colors" :class="selectedIds.includes(place.id) ? 'text-warm-purple' : 'text-gray-700'">{{ place.name }}</span>
        </div>
      </label>
    </div>

    <!-- Modal Kết quả -->
    <transition name="slide-up">
      <div v-if="winner" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6" @click.self="winner = null">
        <div class="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden" v-motion-pop>
          <!-- Background trang trí -->
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-soft-pink/30 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-warm-purple/20 rounded-full blur-3xl"></div>

          <div class="relative z-10">
            <div class="w-24 h-24 bg-gradient-to-br from-soft-pink to-pastel-rose rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg border-4 border-white">🎉</div>
            <h3 class="text-2xl font-serif text-warm-purple font-bold leading-tight">{{ winner.name }}</h3>
            <p class="text-gray-500 text-sm mt-3 mb-8 font-medium">📍 {{ winner.address }}</p>
            
            <div class="flex flex-col gap-3">
              <a v-if="winner.linkmap" :href="winner.linkmap" target="_blank" class="w-full bg-gradient-to-r from-warm-purple to-[#6B4C65] text-white py-4 rounded-[16px] font-bold text-sm shadow-md active:scale-95 transition-transform">Mở Bản Đồ Đi Ngay!</a>
              <button @click="winner = null" class="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 py-4 rounded-[16px] font-bold text-sm transition-colors">Quay Lại</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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

  const extraSpins = 6 * 360; 
  const randomSliceIndex = Math.floor(Math.random() * candidates.value.length);
  const sliceAngle = 360 / candidates.value.length;
  const targetAngle = extraSpins + (360 - (randomSliceIndex * sliceAngle)) - (sliceAngle / 2);

  rotation.value += targetAngle;

  setTimeout(() => {
    isSpinning.value = false;
    winner.value = candidates.value[randomSliceIndex];
    confetti({ 
      particleCount: 150, 
      spread: 90, 
      origin: { y: 0.5 }, 
      colors: ['#FFD1DA', '#F4A6B8', '#8B6283', '#ffffff'],
      disableForReducedMotion: true
    });
  }, 4500);
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