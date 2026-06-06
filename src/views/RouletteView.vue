<template>
  <main class="p-6 flex flex-col items-center justify-center min-h-[70vh]">
    <h2 class="font-serif text-2xl text-warm-purple mb-8 text-center">Vòng Quay Tình Yêu</h2>
    
    <!-- Roulette Wheel Wrapper -->
    <div class="relative w-72 h-72 mb-10">
      <!-- Mũi tên chỉ định -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-warm-purple z-20"></div>
      
      <!-- Bánh xe -->
      <div 
        class="w-full h-full rounded-full border-4 border-pastel-rose overflow-hidden relative shadow-lg transition-transform duration-[4000ms] ease-out"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <!-- Vẽ các lát cắt CSS -->
        <div v-for="(place, index) in options" :key="place.id" 
             class="absolute w-full h-full origin-center"
             :style="{ transform: `rotate(${(360 / options.length) * index}deg)` }">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-1/2 origin-bottom bg-opacity-20 flex items-start pt-6 justify-center text-xs font-medium text-warm-purple"
               :class="index % 2 === 0 ? 'bg-soft-pink' : 'bg-white'">
            <span class="rotate-90 origin-left whitespace-nowrap overflow-hidden text-ellipsis w-24 text-center">{{ place.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <button 
      @click="spin" 
      :disabled="isSpinning"
      class="bg-gradient-to-r from-pastel-rose to-warm-purple text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-pastel-rose/50 active:scale-95 transition-all disabled:opacity-50"
    >
      {{ isSpinning ? 'Đang quay...' : 'Quay Ngay Cưng!' }}
    </button>

    <!-- Modal Kết quả -->
    <div v-if="selected" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="selected = null">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center" v-motion-pop>
        <img :src="selected.photoUrl" class="w-full h-48 object-cover rounded-2xl mb-4" />
        <h3 class="text-2xl font-serif text-warm-purple">{{ selected.name }}</h3>
        <p class="text-gray-500 text-sm mt-2 mb-4">{{ selected.address }}</p>
        <div class="flex justify-center gap-2 mb-6">
          <span class="bg-soft-pink/50 text-warm-purple px-3 py-1 rounded-full text-xs">{{ selected.price }}</span>
          <span v-if="selected.rating" class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">⭐ {{ selected.rating }}/5</span>
        </div>
        <button @click="selected = null" class="w-full bg-pastel-rose text-white py-3 rounded-xl font-medium">Đồng ý đi đây!</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRestaurantStore } from '../stores/restaurant';
import confetti from 'canvas-confetti';

const store = useRestaurantStore();
// Lấy ngẫu nhiên 8 quán để làm vòng quay cho đỡ rối
const options = computed(() => store.restaurants.slice(0, 8));

const rotation = ref(0);
const isSpinning = ref(false);
const selected = ref<any>(null);

const spin = () => {
  if (isSpinning.value) return;
  isSpinning.value = true;
  selected.value = null;

  // Tính toán góc quay
  const extraSpins = 5 * 360; // Quay 5 vòng
  const randomSliceIndex = Math.floor(Math.random() * options.value.length);
  const sliceAngle = 360 / options.value.length;
  // Bù trừ để mũi tên chỉ vào giữa lát cắt
  const targetAngle = extraSpins + (360 - (randomSliceIndex * sliceAngle)) - (sliceAngle / 2);

  rotation.value += targetAngle;

  setTimeout(() => {
    isSpinning.value = false;
    selected.value = options.value[randomSliceIndex];
    // Bắn pháo hoa
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD1DA', '#F4A6B8', '#8B6283']
    });
  }, 4000); // 4s animation
};
</script>