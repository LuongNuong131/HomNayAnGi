<template>
  <main class="px-5 pt-6 pb-6">

    <!-- Section header -->
    <div class="flex items-end justify-between mb-5 px-1">
      <div>
        <p class="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase mb-1 opacity-80">Bộ sưu tập</p>
        <h2 class="font-display text-[28px] font-light text-berry leading-tight">Những nơi<br><em class="font-medium">tụi mình yêu</em></h2>
      </div>
      <div class="text-right">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold text-berry-dark"
             style="background: linear-gradient(135deg, rgba(245,196,207,0.5), rgba(201,169,110,0.2)); border: 1px solid rgba(201,169,110,0.3);">
          <span class="w-1.5 h-1.5 rounded-full bg-rose animate-pulse"></span>
          {{ store.restaurants.length }} địa điểm
        </div>
      </div>
    </div>

    <!-- Search bar -->
    <div class="relative mb-6">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Tìm quán..."
        class="w-full pl-11 pr-4 py-3.5 rounded-[18px] text-[14px] font-body text-berry-dark placeholder:text-stone-400 outline-none"
        style="background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(201,169,110,0.25); box-shadow: 0 2px 12px rgba(90,31,48,0.05);"
      />
    </div>

    <!-- Empty search state -->
    <div v-if="filteredRestaurants.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">🌸</div>
      <p class="font-display text-xl text-berry/60 italic">Không tìm thấy quán nào...</p>
    </div>

    <!-- Restaurant Cards -->
    <TransitionGroup name="list" tag="div" class="space-y-3.5">
      <div
        v-for="(place, index) in filteredRestaurants"
        :key="place.id"
        class="card-lift cursor-pointer"
        :style="`animation: fadeIn 0.5s ease ${index * 35}ms both;`"
        @click="openDetails(place)"
      >
        <!-- Card -->
        <div class="relative overflow-hidden rounded-[24px] p-5"
             style="background: rgba(255,255,255,0.82); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 24px rgba(90,31,48,0.07), 0 1px 4px rgba(90,31,48,0.04);">
          
          <!-- Decorative corner accent -->
          <div class="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-40"
               style="background: radial-gradient(ellipse at 100% 0%, rgba(245,196,207,0.6) 0%, transparent 60%);"></div>

          <!-- Number badge -->
          <div class="absolute top-4 right-4">
            <span class="font-display text-[11px] font-semibold text-gold/60 tracking-wide">
              {{ String(place.id).padStart(2,'0') }}
            </span>
          </div>

          <div class="flex items-start gap-4 pr-8">
            <!-- Icon circle -->
            <div class="shrink-0 w-11 h-11 rounded-[14px] flex items-center justify-center text-lg mt-0.5"
                 :style="cardIconStyle(index)">
              {{ cardEmoji(place.name) }}
            </div>

            <div class="flex-1 min-w-0">
              <!-- Name -->
              <h4 class="font-display text-[17px] font-semibold text-berry-dark leading-snug mb-1.5 pr-4">
                {{ place.name }}
              </h4>
              
              <!-- Address -->
              <p class="text-[12px] font-body text-stone-400 truncate mb-2.5 leading-relaxed">
                <span class="text-rose/70">📍</span> {{ place.address }}
              </p>

              <!-- Bottom row -->
              <div class="flex items-center gap-2">
                <span v-if="place.price" class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style="background: linear-gradient(135deg, rgba(201,169,110,0.18), rgba(245,196,207,0.25)); color: #7A2D45; border: 1px solid rgba(201,169,110,0.2);">
                  💰 {{ place.price }}
                </span>
                <span v-if="place.advantage" class="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium text-sage"
                      style="background: rgba(141,170,140,0.12); border: 1px solid rgba(141,170,140,0.2);">
                  ✓ Có ưu điểm
                </span>
              </div>
            </div>
          </div>

          <!-- Tap indicator -->
          <div class="absolute bottom-4 right-4 opacity-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A2D45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- ─── Detail Bottom Sheet ─────────────────────────────── -->
    <Teleport to="body">
      <transition name="sheet">
        <div v-if="selectedPlace"
             class="fixed inset-0 z-50 flex flex-col justify-end"
             style="background: rgba(61,26,38,0.45); backdrop-filter: blur(8px);"
             @click.self="selectedPlace = null">

          <transition name="sheet-content">
            <div v-if="selectedPlace"
                 class="relative w-full max-w-[430px] mx-auto rounded-t-[32px] overflow-hidden"
                 style="background: #FAF7F2; box-shadow: 0 -8px 48px rgba(90,31,48,0.2);">

              <!-- Drag handle -->
              <div class="flex justify-center pt-4 pb-2">
                <div class="w-10 h-1 rounded-full" style="background: rgba(122,45,69,0.2);"></div>
              </div>

              <!-- Content scroll area -->
              <div class="px-6 pb-10 overflow-y-auto" style="max-height: 80vh;">

                <!-- Header section -->
                <div class="relative pt-2 pb-6">
                  <!-- BG decoration -->
                  <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-50"
                       style="background: radial-gradient(circle, rgba(245,196,207,0.6) 0%, transparent 70%);"></div>

                  <div class="flex items-start gap-4 relative">
                    <div class="w-14 h-14 rounded-[18px] flex items-center justify-center text-2xl shrink-0"
                         :style="cardIconStyle(selectedPlace.id - 1)">
                      {{ cardEmoji(selectedPlace.name) }}
                    </div>
                    <div class="flex-1">
                      <h3 class="font-display text-[23px] font-semibold text-berry-dark leading-tight mb-1">
                        {{ selectedPlace.name }}
                      </h3>
                      <p class="text-[12px] text-stone-400 leading-relaxed">
                        <span class="text-rose/60">📍</span> {{ selectedPlace.address }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Gold divider -->
                <div class="gold-divider mb-5"></div>

                <!-- Price chip -->
                <div v-if="selectedPlace.price" class="flex items-center gap-2 mb-5">
                  <div class="px-4 py-2.5 rounded-[14px] inline-flex items-center gap-2"
                       style="background: linear-gradient(135deg, rgba(201,169,110,0.2), rgba(245,196,207,0.3)); border: 1px solid rgba(201,169,110,0.3);">
                    <span class="text-base">💰</span>
                    <span class="font-body text-[14px] font-semibold text-berry">{{ selectedPlace.price }}</span>
                  </div>
                </div>

                <!-- Pro/Con cards -->
                <div class="space-y-3 mb-7">
                  <div v-if="selectedPlace.advantage"
                       class="p-4 rounded-[18px] relative overflow-hidden"
                       style="background: rgba(255,255,255,0.7); border: 1px solid rgba(141,170,140,0.3);">
                    <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px]" style="background: linear-gradient(180deg, #8DAA8C, #C5D5C4);"></div>
                    <div class="pl-3">
                      <p class="text-[10px] font-bold tracking-[0.25em] uppercase text-sage mb-1.5">✨ Ưu điểm</p>
                      <p class="font-body text-[13.5px] text-stone-600 leading-relaxed">{{ selectedPlace.advantage }}</p>
                    </div>
                  </div>

                  <div v-if="selectedPlace.disadvantages"
                       class="p-4 rounded-[18px] relative overflow-hidden"
                       style="background: rgba(255,255,255,0.7); border: 1px solid rgba(232,137,154,0.3);">
                    <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px]" style="background: linear-gradient(180deg, #E8899A, #F5C4CF);"></div>
                    <div class="pl-3">
                      <p class="text-[10px] font-bold tracking-[0.25em] uppercase text-rose mb-1.5">⚠️ Nhược điểm</p>
                      <p class="font-body text-[13.5px] text-stone-600 leading-relaxed">{{ selectedPlace.disadvantages }}</p>
                    </div>
                  </div>

                  <div v-if="!selectedPlace.advantage && !selectedPlace.disadvantages"
                       class="text-center py-4 text-stone-400 text-sm italic font-accent">
                    Chưa có ghi chú nào... 🌸
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex gap-3">
                  <button @click="selectedPlace = null"
                          class="flex-1 py-4 rounded-[18px] text-[13.5px] font-semibold text-stone-500 transition-all active:scale-95"
                          style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.07);">
                    Đóng lại
                  </button>
                  <a v-if="selectedPlace.linkmap"
                     :href="selectedPlace.linkmap"
                     target="_blank"
                     class="flex-[2] py-4 rounded-[18px] text-[13.5px] font-bold text-white text-center transition-all active:scale-95 flex items-center justify-center gap-2"
                     style="background: linear-gradient(135deg, #7A2D45 0%, #C45B6E 60%, #E8899A 100%); box-shadow: 0 8px 24px rgba(122,45,69,0.35);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Mở bản đồ
                  </a>
                </div>

              </div>
            </div>
          </transition>
        </div>
      </transition>
    </Teleport>

  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRestaurantStore } from '../stores/restaurant'
import type { Restaurant } from '../types'

const store  = useRestaurantStore()
const selectedPlace = ref<Restaurant | null>(null)
const searchQuery   = ref('')

const filteredRestaurants = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return store.restaurants
  return store.restaurants.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.address.toLowerCase().includes(q)
  )
})

const openDetails = (place: Restaurant) => {
  selectedPlace.value = place
}

const ICONS = [
  'bg-gradient-to-br from-blush-light to-blush',
  'bg-gradient-to-br from-gold-light to-blush-light',
  'bg-gradient-to-br from-mist to-blush-light',
  'bg-gradient-to-br from-blush to-rose/20',
  'bg-gradient-to-br from-gold-light to-gold/20',
]

const cardIconStyle = (index: number) => {
  const styles = [
    'background: linear-gradient(135deg, #FDE8ED, #F5C4CF);',
    'background: linear-gradient(135deg, #F0DEB8, #FDE8ED);',
    'background: linear-gradient(135deg, #EAE6F0, #FDE8ED);',
    'background: linear-gradient(135deg, #F5C4CF, rgba(232,137,154,0.3));',
    'background: linear-gradient(135deg, #F0DEB8, rgba(201,169,110,0.3));',
  ]
  return styles[index % styles.length]
}

const cardEmoji = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('bánh') || lower.includes('bột')) return '🥐'
  if (lower.includes('bún') || lower.includes('phở') || lower.includes('cơm')) return '🍜'
  if (lower.includes('lẩu')) return '🫕'
  if (lower.includes('hàu') || lower.includes('ốc') || lower.includes('hải sản')) return '🦪'
  if (lower.includes('trà') || lower.includes('tea')) return '🧋'
  if (lower.includes('buffet')) return '🍽️'
  if (lower.includes('nướng')) return '🔥'
  if (lower.includes('gà') || lower.includes('chân')) return '🍗'
  if (lower.includes('thai') || lower.includes('nhật') || lower.includes('hàn') || lower.includes('korea')) return '🍱'
  if (lower.includes('burger') || lower.includes('hamburger')) return '🍔'
  return '🌸'
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>