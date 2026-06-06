<template>
  <main class="px-5 pt-6 pb-8">

    <!-- Header -->
    <div class="text-center mb-8">
      <p class="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase mb-1.5 opacity-80">Bữa hôm nay</p>
      <h2 class="font-display text-[28px] font-light text-berry-dark leading-tight">
        Hôm nay<br><em class="font-medium">ăn gì nhỉ?</em> 🍀
      </h2>
      <p class="font-body text-[12.5px] text-stone-400 mt-2 leading-relaxed">
        Chọn các quán đang phân vân → quay để quyết định
      </p>
    </div>

    <!-- Wheel Area -->
    <div class="relative mb-8">

      <!-- Wheel container -->
      <div class="relative w-[280px] h-[280px] mx-auto">

        <!-- Outer glow ring -->
        <div class="absolute -inset-3 rounded-full opacity-0 transition-opacity duration-700"
             :class="{ 'opacity-100': isSpinning }"
             style="background: conic-gradient(from 0deg, rgba(245,196,207,0.4), rgba(201,169,110,0.4), rgba(232,137,154,0.4), rgba(245,196,207,0.4)); filter: blur(12px);"></div>

        <!-- Empty state ring -->
        <div v-if="candidates.length < 2"
             class="absolute inset-0 rounded-full flex items-center justify-center"
             style="border: 2.5px dashed rgba(201,169,110,0.4); background: rgba(250,247,242,0.5);">
          <div class="text-center px-8">
            <div class="text-4xl mb-3 opacity-50">🌀</div>
            <p class="font-accent text-[15px] italic text-stone-400 leading-relaxed">
              Hãy chọn ít nhất<br>2 quán bên dưới...
            </p>
          </div>
        </div>

        <!-- Actual wheel -->
        <div v-else
             class="absolute inset-0 rounded-full overflow-hidden"
             :class="isSpinning ? 'spin-transition' : ''"
             :style="{ transform: `rotate(${rotation}deg)`, boxShadow: '0 8px 40px rgba(90,31,48,0.25), inset 0 0 0 4px rgba(255,255,255,0.5)' }">
          
          <!-- SVG Segments -->
          <svg width="280" height="280" viewBox="0 0 280 280" class="absolute inset-0">
            <g transform="translate(140,140)">
              <path
                v-for="(place, i) in candidates"
                :key="place.id"
                :d="getSegmentPath(i, candidates.length, 136)"
                :fill="segmentFill(i)"
                stroke="rgba(255,255,255,0.6)"
                stroke-width="1.5"
              />
              <!-- Text labels -->
              <text
                v-for="(place, i) in candidates"
                :key="'t'+place.id"
                :transform="getTextTransform(i, candidates.length)"
                text-anchor="middle"
                dominant-baseline="middle"
                :font-size="candidates.length > 8 ? 9 : 11"
                font-family="Cormorant Garamond, serif"
                font-weight="600"
                :fill="segmentTextColor(i)"
                class="select-none pointer-events-none"
              >
                {{ truncate(place.name, candidates.length > 8 ? 10 : 14) }}
              </text>
            </g>
          </svg>
          <!-- Center circle -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
               style="background: white; box-shadow: 0 4px 16px rgba(90,31,48,0.2), inset 0 1px 0 rgba(255,255,255,0.9);">
            <div class="w-4 h-4 rounded-full"
                 style="background: linear-gradient(135deg, #7A2D45, #C45B6E);"></div>
          </div>
        </div>

        <!-- Pointer arrow -->
        <div v-if="candidates.length >= 2"
             class="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div class="w-5 h-6 relative">
            <svg viewBox="0 0 20 26" fill="none" class="w-5 h-6 drop-shadow-md">
              <path d="M10 26 L2 8 C1 5, 4 2, 10 2 C16 2, 19 5, 18 8 Z"
                    fill="url(#arrowGrad)" stroke="white" stroke-width="1"/>
              <defs>
                <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#7A2D45"/>
                  <stop offset="100%" stop-color="#C45B6E"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

      </div>
    </div>

    <!-- Spin button -->
    <div class="mb-8 flex justify-center">
      <button
        v-if="candidates.length >= 2"
        @click="spin"
        :disabled="isSpinning"
        class="relative px-10 py-4 rounded-[20px] text-white text-[15px] font-bold tracking-wide overflow-hidden transition-all active:scale-95 disabled:opacity-60 disabled:scale-100"
        style="background: linear-gradient(135deg, #7A2D45 0%, #C45B6E 60%, #E8899A 100%); box-shadow: 0 12px 32px rgba(122,45,69,0.4);">
        
        <!-- Shimmer overlay -->
        <div class="absolute inset-0 pointer-events-none"
             style="background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%); background-size: 200% auto;"
             :class="isSpinning ? 'animate-shimmer' : ''"></div>
        
        <div class="relative flex items-center gap-2.5">
          <span class="text-lg" :class="isSpinning ? 'animate-spin' : ''">{{ isSpinning ? '✨' : '🎲' }}</span>
          <span>{{ isSpinning ? 'Đang quay...' : 'Quay Ngay Cưng!' }}</span>
        </div>
      </button>
    </div>

    <!-- Candidate count -->
    <div v-if="candidates.length > 0" class="flex items-center gap-2 mb-4 px-1">
      <div class="gold-divider flex-1"></div>
      <span class="text-[11px] font-semibold tracking-wide text-gold/70 uppercase">{{ candidates.length }} quán đang chọn</span>
      <div class="gold-divider flex-1"></div>
    </div>

    <!-- Section label -->
    <div class="flex items-center gap-2 mb-4 px-1">
      <div v-if="candidates.length === 0" class="gold-divider flex-1"></div>
      <p class="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400">Chọn quán ăn</p>
      <div class="gold-divider flex-1"></div>
    </div>

    <!-- Checklist -->
    <div class="space-y-2.5">
      <label
        v-for="(place, index) in store.restaurants"
        :key="place.id"
        class="relative flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-250 select-none"
        :style="selectedIds.includes(place.id) ? selectedCardStyle : unselectedCardStyle"
        :class="selectedIds.includes(place.id) ? 'scale-[1.01]' : 'hover:scale-[1.005]'"
      >
        <input type="checkbox" :value="place.id" v-model="selectedIds" class="hidden" />
        
        <!-- Checkbox -->
        <div class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-250"
             :style="selectedIds.includes(place.id)
               ? 'background: linear-gradient(135deg, #7A2D45, #C45B6E); box-shadow: 0 3px 10px rgba(122,45,69,0.4);'
               : 'background: rgba(0,0,0,0.05); border: 1.5px solid rgba(122,45,69,0.2);'">
          <svg v-if="selectedIds.includes(place.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <!-- Icon -->
        <div class="shrink-0 w-9 h-9 rounded-[12px] flex items-center justify-center text-base"
             :style="cardIconStyle(index)">
          {{ cardEmoji(place.name) }}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-display text-[15px] font-semibold leading-snug truncate"
             :style="selectedIds.includes(place.id) ? 'color: #5A1F30;' : 'color: #7A6060;'">
            {{ place.name }}
          </p>
          <p v-if="place.price" class="text-[11px] font-body mt-0.5"
             :style="selectedIds.includes(place.id) ? 'color: #C45B6E; opacity: 0.8;' : 'color: #B0A090;'">
            {{ place.price }}
          </p>
        </div>
      </label>
    </div>

    <!-- ─── Winner Modal ─────────────────────────────────────── -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="winner"
             class="fixed inset-0 z-50 flex items-end justify-center pb-6 px-5"
             style="background: rgba(61,26,38,0.6); backdrop-filter: blur(10px);"
             @click.self="winner = null">

          <transition name="modal-card">
            <div v-if="winner"
                 class="w-full max-w-[400px] rounded-[32px] overflow-hidden relative"
                 style="background: #FAF7F2; box-shadow: 0 32px 80px rgba(61,26,38,0.3);">

              <!-- Top decorative band -->
              <div class="h-2 w-full"
                   style="background: linear-gradient(90deg, #7A2D45, #C45B6E, #E8899A, #C9A96E);"></div>

              <div class="px-7 pt-7 pb-8 relative">
                <!-- Decorative blobs -->
                <div class="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-40 pointer-events-none"
                     style="background: radial-gradient(circle, rgba(245,196,207,0.8), transparent); filter: blur(24px);"></div>
                <div class="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-30 pointer-events-none"
                     style="background: radial-gradient(circle, rgba(201,169,110,0.6), transparent); filter: blur(20px);"></div>

                <div class="relative">
                  <!-- Celebration icon -->
                  <div class="text-center mb-5">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mx-auto"
                         style="background: linear-gradient(135deg, rgba(245,196,207,0.6), rgba(201,169,110,0.3)); box-shadow: 0 8px 32px rgba(122,45,69,0.2);">
                      🎉
                    </div>
                  </div>

                  <!-- Label -->
                  <p class="font-body text-[10px] font-bold tracking-[0.3em] uppercase text-center text-gold mb-2 opacity-80">Quyết định rồi!</p>

                  <!-- Winner name -->
                  <h3 class="font-display text-[28px] font-semibold text-center text-berry-dark leading-tight mb-1.5">
                    {{ winner.name }}
                  </h3>
                  
                  <p class="font-body text-[12px] text-center text-stone-400 mb-5">
                    📍 {{ winner.address }}
                  </p>

                  <div class="gold-divider mb-5"></div>

                  <!-- Price -->
                  <div v-if="winner.price" class="flex justify-center mb-6">
                    <div class="px-4 py-2 rounded-full text-[13px] font-semibold text-berry"
                         style="background: linear-gradient(135deg, rgba(201,169,110,0.2), rgba(245,196,207,0.3)); border: 1px solid rgba(201,169,110,0.3);">
                      💰 {{ winner.price }}
                    </div>
                  </div>

                  <!-- Buttons -->
                  <div class="flex gap-3">
                    <button @click="winner = null"
                            class="flex-1 py-3.5 rounded-[16px] text-[13.5px] font-semibold text-stone-500 transition-all active:scale-95"
                            style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.07);">
                      Quay lại
                    </button>
                    <a v-if="winner.linkmap"
                       :href="winner.linkmap"
                       target="_blank"
                       class="flex-[2] py-3.5 rounded-[16px] text-[13.5px] font-bold text-white text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                       style="background: linear-gradient(135deg, #7A2D45, #C45B6E); box-shadow: 0 8px 24px rgba(122,45,69,0.35);">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      Đi ngay thôi!
                    </a>
                  </div>
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
import confetti from 'canvas-confetti'
import type { Restaurant } from '../types'

const store = useRestaurantStore()
const selectedIds = ref<number[]>([])
const rotation    = ref(0)
const isSpinning  = ref(false)
const winner      = ref<Restaurant | null>(null)

const candidates = computed(() =>
  store.restaurants.filter(r => selectedIds.value.includes(r.id))
)

// ─── Wheel geometry ──────────────────────────────────────
const getSegmentPath = (index: number, total: number, r: number) => {
  const angle   = (2 * Math.PI) / total
  const start   = index * angle - Math.PI / 2
  const end     = start + angle
  const x1 = r * Math.cos(start), y1 = r * Math.sin(start)
  const x2 = r * Math.cos(end),   y2 = r * Math.sin(end)
  const large = angle > Math.PI ? 1 : 0
  return `M0,0 L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`
}

const getTextTransform = (index: number, total: number) => {
  const angle     = (2 * Math.PI) / total
  const midAngle  = index * angle + angle / 2 - Math.PI / 2
  const tr        = total > 6 ? 78 : 88
  const x = tr * Math.cos(midAngle)
  const y = tr * Math.sin(midAngle)
  const deg = (midAngle * 180) / Math.PI + 90
  return `translate(${x},${y}) rotate(${deg})`
}

const SEGMENT_FILLS = [
  'rgba(245,196,207,0.9)',
  'rgba(240,222,184,0.9)',
  'rgba(234,230,240,0.9)',
  'rgba(232,137,154,0.65)',
  'rgba(201,169,110,0.5)',
  'rgba(253,232,237,0.9)',
  'rgba(210,200,230,0.75)',
  'rgba(248,218,190,0.85)',
]
const SEGMENT_TEXT = [
  '#5A1F30', '#6B4A20', '#4A3860', '#7A2030',
  '#6B4A20', '#7A2D45', '#5A3870', '#7A4A20',
]

const segmentFill      = (i: number) => SEGMENT_FILLS[i % SEGMENT_FILLS.length]
const segmentTextColor = (i: number) => SEGMENT_TEXT[i % SEGMENT_TEXT.length]
const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n) + '…' : s

// ─── Spin logic ───────────────────────────────────────────
const spin = () => {
  if (isSpinning.value || candidates.value.length < 2) return
  isSpinning.value = true
  winner.value = null

  const count     = candidates.value.length
  const winnerIdx = Math.floor(Math.random() * count)
  const slice     = 360 / count
  const extra     = 7 * 360
  const target    = extra + 360 - winnerIdx * slice - slice / 2 + (Math.random() - 0.5) * (slice * 0.6)

  rotation.value += target

  setTimeout(() => {
    isSpinning.value = false
    winner.value = candidates.value[winnerIdx]
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F5C4CF', '#E8899A', '#C9A96E', '#7A2D45', '#ffffff'],
      disableForReducedMotion: true,
    })
  }, 5200)
}

// ─── Card styles ──────────────────────────────────────────
const selectedCardStyle   = 'background: rgba(245,196,207,0.35); border: 1.5px solid rgba(122,45,69,0.2); box-shadow: 0 4px 20px rgba(122,45,69,0.1);'
const unselectedCardStyle = 'background: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 2px 8px rgba(90,31,48,0.04);'

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
  const l = name.toLowerCase()
  if (l.includes('bánh') || l.includes('bột')) return '🥐'
  if (l.includes('bún') || l.includes('phở') || l.includes('cơm')) return '🍜'
  if (l.includes('lẩu')) return '🫕'
  if (l.includes('hàu') || l.includes('ốc')) return '🦪'
  if (l.includes('trà') || l.includes('tea')) return '🧋'
  if (l.includes('buffet')) return '🍽️'
  if (l.includes('nướng')) return '🔥'
  if (l.includes('gà') || l.includes('chân')) return '🍗'
  if (l.includes('burger') || l.includes('hamburger')) return '🍔'
  return '🌸'
}
</script>