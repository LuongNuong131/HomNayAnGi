<template>
  <main class="p-6">
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-soft-pink/30 mb-6" v-motion-fade-visible>
      <h2 class="text-xl font-serif text-warm-purple mb-2">Xin chào hai cưng! 👋</h2>
      <p class="text-gray-600 text-sm leading-relaxed">
        Hôm nay hai đứa muốn ăn gì? Chọn ngẫu nhiên, nhờ AI tư vấn, hoặc xem lại kỷ niệm của mình nhé.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-soft-pink/20 rounded-2xl p-4 text-center border border-soft-pink/50" v-motion-slide-bottom>
        <p class="text-3xl font-bold text-pastel-rose">{{ store.visitedRestaurants.length }}</p>
        <p class="text-xs text-warm-purple font-medium mt-1">Quán đã đi</p>
      </div>
      <div class="bg-warm-purple/10 rounded-2xl p-4 text-center border border-warm-purple/20" v-motion-slide-bottom :delay="100">
        <p class="text-3xl font-bold text-warm-purple">{{ store.bucketList.length }}</p>
        <p class="text-xs text-warm-purple font-medium mt-1">Muốn thử</p>
      </div>
    </div>

    <!-- Bucket List Preview -->
    <h3 class="font-serif text-lg text-warm-purple mb-4">Món ngon chờ đón</h3>
    <div class="space-y-4">
      <div v-for="place in store.bucketList.slice(0, 3)" :key="place.id" class="flex items-center bg-white p-3 rounded-2xl shadow-sm" v-motion-slide-visible>
        <img :src="place.photoUrl" class="w-16 h-16 rounded-xl object-cover" alt="Food" />
        <div class="ml-4 flex-1">
          <h4 class="font-medium text-gray-800">{{ place.name }}</h4>
          <p class="text-xs text-gray-500 line-clamp-1">{{ place.address }}</p>
          <span class="inline-block mt-1 text-[10px] bg-soft-pink text-warm-purple px-2 py-0.5 rounded-full">{{ place.price }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurant';
const store = useRestaurantStore();
</script>