<template>
  <main class="roulette">

    <!-- ── Header ── -->
    <div class="roulette-head">
      <p class="roulette-eyebrow">Bữa hôm nay</p>
      <h2 class="roulette-title">
        Hôm nay <em>ăn gì nhỉ?</em>
        <span class="roulette-clover" style="animation: floatSlow 4s ease-in-out infinite;">🍀</span>
      </h2>
      <p class="roulette-hint">Chọn các quán → quay để quyết định ✨</p>
    </div>

    <!-- ── Wheel Zone ── -->
    <div class="wheel-zone">
      <div class="wheel-outer-ring">
        <div class="wheel-outer-tick" v-for="i in 36" :key="i" :style="`transform: rotate(${i*10}deg)`"></div>
      </div>
      <div class="wheel-glow-ring" :class="{ spinning: isSpinning }"></div>

      <div class="wheel-container">
        <div v-if="candidates.length < 2" class="wheel-empty">
          <div class="wheel-empty-icon">🌀</div>
          <p>Hãy chọn ít nhất 2 quán<br>bên dưới nhé cưng</p>
        </div>

        <div
          v-else
          class="wheel-svg-wrap"
          :style="{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? `transform ${spinDuration}ms cubic-bezier(0.08, 0.82, 0.12, 1.0)` : 'none' }"
        >
          <svg :width="WHEEL_SIZE" :height="WHEEL_SIZE" :viewBox="`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`">
            <defs>
              <filter id="seg-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.12"/>
              </filter>
              <radialGradient id="segLight" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
                <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
              </radialGradient>
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#C9A96E"/>
                <stop offset="50%" stop-color="#E8899A"/>
                <stop offset="100%" stop-color="#C9A96E"/>
              </linearGradient>
            </defs>
            <g :transform="`translate(${WHEEL_SIZE/2},${WHEEL_SIZE/2})`">
              <circle r="143" fill="none" stroke="url(#rimGrad)" stroke-width="3.5" opacity="0.65"/>
              <circle r="139" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
              <path
                v-for="(p, i) in candidates" :key="p.id"
                :d="segPath(i, candidates.length, 135)"
                :fill="segFill(i)"
                stroke="rgba(255,255,255,0.75)"
                stroke-width="1.8"
                filter="url(#seg-shadow)"
              />
              <path
                v-for="(p, i) in candidates" :key="'light'+p.id"
                :d="segPath(i, candidates.length, 135)"
                fill="url(#segLight)"
                stroke="none"
                opacity="0.5"
              />
              <g v-for="(p, i) in candidates" :key="'t'+p.id">
                <text
                  :transform="emojiTransform(i, candidates.length)"
                  text-anchor="middle" dominant-baseline="middle"
                  :font-size="candidates.length > 10 ? 12 : 15"
                >{{ segEmoji(p.name) }}</text>
                <text
                  :transform="labelTransform(i, candidates.length)"
                  text-anchor="middle" dominant-baseline="middle"
                  :font-size="candidates.length > 10 ? 8.5 : candidates.length > 6 ? 9.5 : 10.5"
                  font-family="Cormorant Garamond, serif" font-weight="700"
                  :fill="segText(i)" class="wheel-label"
                >{{ shorten(p.name, candidates.length > 10 ? 8 : candidates.length > 6 ? 11 : 14) }}</text>
              </g>
              <circle r="32" fill="white" filter="url(#seg-shadow)"/>
              <circle r="28" fill="none" stroke="url(#rimGrad)" stroke-width="2" opacity="0.8"/>
            </g>
          </svg>
          <div class="wheel-hub">
            <div class="wheel-hub-ring"></div>
            <div class="wheel-hub-inner"></div>
          </div>
        </div>

        <div v-if="candidates.length >= 2" class="wheel-pointer">
          <svg viewBox="0 0 28 36" fill="none" class="pointer-svg">
            <path d="M14 35 L3 11 C1 6, 5 1.5, 14 1.5 C23 1.5, 27 6, 25 11 Z"
                  fill="url(#pGrad2)" stroke="white" stroke-width="1.5"/>
            <circle cx="14" cy="9" r="4.5" fill="white" opacity="0.5"/>
            <defs>
              <linearGradient id="pGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#5A1F30"/>
                <stop offset="100%" stop-color="#C45B6E"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="pointer-glow" :class="{ active: isSpinning }"></div>
        </div>
      </div>
    </div>

    <!-- ── Spin Button ── -->
    <div class="spin-btn-wrap">
      <button
        v-if="candidates.length >= 2"
        class="spin-btn"
        :class="{ spinning: isSpinning }"
        :disabled="isSpinning"
        @click="spin"
      >
        <div class="spin-btn-shimmer"></div>
        <div v-if="isSpinning" class="spin-ripple"></div>
        <span class="spin-icon" :class="{ 'spin-anim': isSpinning }">
          {{ isSpinning ? '✨' : '🎲' }}
        </span>
        <span class="spin-text">
          {{ isSpinning ? 'Đang quay...' : 'Quay Ngay Cưng!' }}
        </span>
      </button>
      <div v-else class="spin-hint">
        <span>Hãy chọn ít nhất 2 quán để quay nhé 🌸</span>
      </div>
    </div>

    <!-- ── Selected count ── -->
    <div v-if="candidates.length >= 2" class="selected-count">
      <div class="selected-line"></div>
      <div class="selected-badge">
        <span class="sel-dot"></span>
        {{ candidates.length }} quán đang chọn
      </div>
      <div class="selected-line"></div>
    </div>

    <!-- ══════════════════════════════════════
         FILTER + CHECKLIST SECTION
    ══════════════════════════════════════ -->

    <!-- ── Search ── -->
    <div class="search-wrap">
      <div class="search-icon-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="rgba(201,169,110,0.8)" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm quán để thêm vào vòng quay..."
        class="search-input"
      />
      <transition name="fade-scale">
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </transition>
    </div>

    <!-- ── Filter Section ── -->
    <div class="filter-section">
      <div class="filter-switcher">
        <button class="fsw-btn" :class="{ active: filterMode === 'category' }"
                @click="filterMode = 'category'; activeDistrict = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h8M4 18h16"/></svg>
          Loại
        </button>
        <button class="fsw-btn" :class="{ active: filterMode === 'district' }"
                @click="filterMode = 'district'; activeFilter = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Khu vực
        </button>
      </div>

      <transition name="filter-slide">
        <div v-if="filterMode === 'category'" class="filter-row no-scrollbar">
          <button class="filter-chip" :class="{ active: activeFilter === '' }" @click="activeFilter = ''">
            <span class="filter-chip-dot"></span>Tất cả
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'not_tried' }" @click="toggle('not_tried')">
            ○ Chưa đi
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'tried' }" @click="toggle('tried')">
            ✓ Đã đi
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'cheap' }" @click="toggle('cheap')">
            💸 Bình dân
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'has_pros' }" @click="toggle('has_pros')">
            ✨ Có ưu điểm
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'no_cons' }" @click="toggle('no_cons')">
            🌟 Không nhược
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'buffet' }" @click="toggle('buffet')">
            🍽️ Buffet
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'drink' }" @click="toggle('drink')">
            🧋 Đồ uống
          </button>
          <button class="filter-chip" :class="{ active: activeFilter === 'grill' }" @click="toggle('grill')">
            🔥 Đồ nướng
          </button>
        </div>
      </transition>

      <transition name="filter-slide">
        <div v-if="filterMode === 'district'" class="filter-row no-scrollbar">
          <button class="filter-chip district-chip" :class="{ active: activeDistrict === '' }" @click="activeDistrict = ''">
            <span class="filter-chip-dot"></span>Tất cả
          </button>
          <button
            v-for="d in availableDistricts" :key="d.key"
            class="filter-chip district-chip"
            :class="{ active: activeDistrict === d.key }"
            @click="activeDistrict = activeDistrict === d.key ? '' : d.key"
          >
            📍 {{ d.label }}
            <span class="district-count">{{ d.count }}</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- ── Result info + quick-select ── -->
    <div class="result-bar">
      <span class="result-text">
        <span class="result-num">{{ filteredList.length }}</span> quán
        <span v-if="searchQuery || activeFilter || activeDistrict"> được lọc</span>
      </span>
      <div class="quick-select">
        <button class="qs-btn" @click="selectAll">Chọn tất cả</button>
        <button class="qs-btn" @click="clearAll">Bỏ chọn</button>
        <button class="qs-btn qs-random" @click="randomSelect">🎲 Ngẫu nhiên</button>
      </div>
    </div>

    <!-- ── Checklist header ── -->
    <div class="check-header">
      <div class="check-header-line"></div>
      <span class="check-header-text">Chọn quán ăn</span>
      <div class="check-header-line"></div>
    </div>

    <!-- ── Checklist ── -->
    <div class="checklist">
      <label
        v-for="(place, idx) in filteredList"
        :key="place.id"
        class="check-item"
        :class="{ checked: selectedIds.includes(place.id) }"
      >
        <input type="checkbox" :value="place.id" v-model="selectedIds" class="hidden-check"/>

        <div class="check-ring" :class="{ on: selectedIds.includes(place.id) }">
          <svg v-if="selectedIds.includes(place.id)" width="11" height="11" viewBox="0 0 24 24"
               fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div class="check-icon" :style="iconGrad(idx)">
          {{ emoji(place.name) }}
        </div>

        <div class="check-info">
          <div class="check-name-row">
            <p class="check-name" :class="{ active: selectedIds.includes(place.id) }">
              {{ place.name }}
            </p>
            <span v-if="place.experienced" class="exp-badge" title="Đã đi rồi">✓</span>
          </div>
          <div class="check-meta">
            <span v-if="place.price" class="check-price" :class="{ active: selectedIds.includes(place.id) }">
              {{ place.price }}
            </span>
            <span v-if="districtOf(place.address)" class="check-district">
              📍 {{ districtOf(place.address)?.label }}
            </span>
          </div>
        </div>
      </label>

      <div v-if="filteredList.length === 0" class="list-empty">
        <div class="list-empty-icon">🔍</div>
        <p>Không tìm thấy quán nào</p>
        <button class="clear-filter-btn" @click="resetFilters">Xóa bộ lọc</button>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         WINNER MODAL
    ══════════════════════════════════════ -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="winner" class="modal-overlay" @click.self="winner = null">
          <transition name="modal-card">
            <div v-if="winner" class="winner-card">
              <div class="winner-band"></div>
              <div class="winner-body">
                <div class="winner-blob-1"></div>
                <div class="winner-blob-2"></div>
                <div class="winner-blob-3"></div>

                <div class="winner-content">
                  <div class="winner-celebrate">
                    <div class="winner-emoji-ring">
                      <div class="winner-ripple"></div>
                      <div class="winner-ripple winner-ripple-2"></div>
                      <span class="winner-emoji">{{ emoji(winner.name) }}</span>
                    </div>
                    <div class="winner-stars shimmer-text">✦ ✦ ✦</div>
                  </div>

                  <p class="winner-eyebrow">Quyết định rồi cưng ơi!</p>
                  <h3 class="winner-name">{{ winner.name }}</h3>
                  <p class="winner-addr">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                         stroke="rgba(232,137,154,0.6)" stroke-width="2.5" stroke-linecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ winner.address }}
                  </p>
                  <div class="winner-divider"></div>
                  <div v-if="winner.price" class="winner-price">💰 {{ winner.price }}</div>
                  <div v-if="winner.advantage" class="winner-pro">
                    <span class="winner-pro-label">✨ Ưu điểm</span>
                    <span class="winner-pro-text">{{ winner.advantage }}</span>
                  </div>
                  <div class="winner-btns">
                    <button class="btn-spin-again" @click="spinAgain">🎲 Quay lại</button>
                    <button class="btn-close" @click="winner = null">Đóng</button>
                    <a v-if="winner.linkmap" :href="winner.linkmap" target="_blank" class="btn-map">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Đi ngay!
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
import { getDistrict, DISTRICT_DEFS } from '../utils/districtUtils'
import confetti from 'canvas-confetti'
import type { Restaurant } from '../types'

const store = useRestaurantStore()
const selectedIds   = ref<number[]>([])
const isSpinning    = ref(false)
const winner        = ref<Restaurant | null>(null)
const spinDuration  = ref(5500)
const rotation      = ref(0)

// Filter state
const searchQuery   = ref('')
const activeFilter  = ref('')
const activeDistrict = ref('')
const filterMode    = ref<'category' | 'district'>('category')

const WHEEL_SIZE = 310

const candidates = computed(() =>
  store.restaurants.filter(r => selectedIds.value.includes(r.id))
)

// ─── Available districts (with count) ────────────────
const availableDistricts = computed(() =>
  DISTRICT_DEFS
    .map(d => ({
      key: d.key,
      label: d.label,
      count: store.restaurants.filter(r => getDistrict(r.address)?.key === d.key).length,
    }))
    .filter(d => d.count > 0)
)

const districtOf = (address: string) => getDistrict(address)

// ─── Filtered list for checklist ─────────────────────
const filteredList = computed(() => {
  let list = store.restaurants

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    )
  }

  switch (activeFilter.value) {
    case 'not_tried':
      list = list.filter(r => !r.experienced); break
    case 'tried':
      list = list.filter(r => r.experienced); break
    case 'cheap':
      list = list.filter(r => {
        if (!r.price) return false
        const nums = r.price.match(/\d+/g)
        if (!nums) return false
        return Math.min(...nums.map(Number)) <= 30
      }); break
    case 'has_pros':
      list = list.filter(r => r.advantage?.trim()); break
    case 'no_cons':
      list = list.filter(r => !r.disadvantages?.trim()); break
    case 'buffet':
      list = list.filter(r => r.name.toLowerCase().includes('buffet')); break
    case 'drink':
      list = list.filter(r => {
        const n = r.name.toLowerCase()
        return n.includes('trà') || n.includes('tea') || n.includes('nước')
      }); break
    case 'grill':
      list = list.filter(r => {
        const n = r.name.toLowerCase()
        return n.includes('nướng') || n.includes('chân gà') || n.includes('lòng')
      }); break
  }

  if (activeDistrict.value) {
    list = list.filter(r => getDistrict(r.address)?.key === activeDistrict.value)
  }

  return list
})

const toggle = (f: string) => { activeFilter.value = activeFilter.value === f ? '' : f }
const resetFilters = () => { searchQuery.value = ''; activeFilter.value = ''; activeDistrict.value = '' }

// ─── Quick-select (applies to filtered list) ─────────
const selectAll = () => {
  const ids = new Set(selectedIds.value)
  filteredList.value.forEach(r => ids.add(r.id))
  selectedIds.value = [...ids]
}
const clearAll = () => {
  const filtered = new Set(filteredList.value.map(r => r.id))
  selectedIds.value = selectedIds.value.filter(id => !filtered.has(id))
}
const randomSelect = () => {
  const shuffled = [...filteredList.value].sort(() => Math.random() - 0.5)
  const count = Math.min(Math.floor(Math.random() * 6) + 3, shuffled.length)
  const ids = new Set(selectedIds.value)
  shuffled.slice(0, count).forEach(r => ids.add(r.id))
  selectedIds.value = [...ids]
}

// ─── Wheel geometry ──────────────────────────────────
const segPath = (i: number, n: number, r: number) => {
  const a = (2 * Math.PI) / n
  const s = i * a - Math.PI / 2, e = s + a
  const x1 = r * Math.cos(s), y1 = r * Math.sin(s)
  const x2 = r * Math.cos(e), y2 = r * Math.sin(e)
  return `M0,0 L${x1},${y1} A${r},${r} 0 ${a > Math.PI ? 1 : 0},1 ${x2},${y2} Z`
}
const labelTransform = (i: number, n: number) => {
  const a = (2 * Math.PI) / n
  const m = i * a + a / 2 - Math.PI / 2
  const d = n > 10 ? 80 : n > 6 ? 88 : 96
  const rot = (m * 180) / Math.PI + 90
  return `translate(${d * Math.cos(m)},${d * Math.sin(m)}) rotate(${rot})`
}
const emojiTransform = (i: number, n: number) => {
  const a = (2 * Math.PI) / n
  const m = i * a + a / 2 - Math.PI / 2
  const d = n > 10 ? 100 : n > 6 ? 108 : 116
  const rot = (m * 180) / Math.PI + 90
  return `translate(${d * Math.cos(m)},${d * Math.sin(m)}) rotate(${rot})`
}

const FILLS = ['#FDE8ED','#F0DEB8','#EAE6F0','rgba(232,137,154,0.55)','rgba(201,169,110,0.45)','#FBF3E4','rgba(210,200,230,0.7)','rgba(248,218,190,0.8)','#F5E6EE','#E8F0E8']
const TEXTS = ['#5A1F30','#6B4A20','#4A3860','#7A2030','#6B4A20','#7A2D45','#5A3870','#7A4A20','#5A1F30','#2D5030']
const segFill = (i: number) => FILLS[i % FILLS.length]
const segText = (i: number) => TEXTS[i % TEXTS.length]
const shorten = (s: string, n: number) => s.length > n ? s.slice(0, n) + '…' : s

// ─── Spin ─────────────────────────────────────────────
const spin = () => {
  if (isSpinning.value || candidates.value.length < 2) return
  isSpinning.value = true
  winner.value = null

  const n = candidates.value.length
  const wi = Math.floor(Math.random() * n)
  const sliceDeg = 360 / n
  const currentMod = ((rotation.value % 360) + 360) % 360
  const winnerMid = wi * sliceDeg + sliceDeg / 2
  let delta = ((-winnerMid - currentMod) % 360 + 360) % 360
  delta += (Math.random() - 0.5) * sliceDeg * 0.80
  delta += 6 * 360
  spinDuration.value = 5000 + Math.random() * 1000
  rotation.value += delta

  setTimeout(() => {
    isSpinning.value = false
    winner.value = candidates.value[wi]
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.4 }, colors: ['#F5C4CF','#E8899A','#C9A96E','#7A2D45','#FDE8ED','#ffffff','#EAE6F0'], disableForReducedMotion: true })
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.5 }, colors: ['#F5C4CF','#C9A96E','#ffffff'] })
      confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.5 }, colors: ['#E8899A','#7A2D45','#FDE8ED'] })
    }, 300)
  }, spinDuration.value + 100)
}
const spinAgain = () => { winner.value = null; setTimeout(spin, 200) }

// ─── Helpers ─────────────────────────────────────────
const ICON_GRADS = [
  'background: linear-gradient(135deg, #FDE8ED, #F5C4CF);',
  'background: linear-gradient(135deg, #F0DEB8, #FDE8ED);',
  'background: linear-gradient(135deg, #EAE6F0, #FDE8ED);',
  'background: linear-gradient(135deg, #F5C4CF, rgba(232,137,154,0.4));',
  'background: linear-gradient(135deg, #F0DEB8, rgba(201,169,110,0.35));',
]
const iconGrad = (i: number) => ICON_GRADS[i % ICON_GRADS.length]

const segEmoji = emoji
function emoji(name: string): string {
  const l = name.toLowerCase()
  if (l.includes('burger') || l.includes('hamburger')) return '🍔'
  if (l.includes('hàu') || l.includes('ốc')) return '🦪'
  if (l.includes('bánh') || l.includes('bột')) return '🥐'
  if (l.includes('bún') || l.includes('phở')) return '🍜'
  if (l.includes('cơm')) return '🍚'
  if (l.includes('lẩu')) return '🫕'
  if (l.includes('trà') || l.includes('tea')) return '🧋'
  if (l.includes('buffet')) return '🍽️'
  if (l.includes('nướng')) return '🔥'
  if (l.includes('gà') || l.includes('chân')) return '🍗'
  if (l.includes('takoyaki')) return '🐙'
  if (l.includes('trứng')) return '🥚'
  return '🌸'
}
</script>

<style scoped>
.hidden-check { display: none; }
.roulette { padding: 20px 20px 130px; }

/* ── Header ── */
.roulette-head { text-align: center; margin-bottom: 28px; }
.roulette-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 8px; }
.roulette-title { font-family: var(--font-display); font-size: 30px; font-weight: 400; color: var(--berry-dark); line-height: 1.3; margin-bottom: 8px; }
.roulette-title em { font-weight: 600; font-style: italic; color: var(--berry); }
.roulette-clover { display: inline-block; margin-left: 6px; }
.roulette-hint { font-size: 12.5px; color: rgba(160,145,130,0.75); line-height: 1.5; }

/* ── Wheel Zone ── */
.wheel-zone {
  position: relative; width: 340px; height: 340px;
  margin: 0 auto 32px;
  display: flex; align-items: center; justify-content: center;
}
.wheel-outer-ring { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
.wheel-outer-tick {
  position: absolute; top: 0; left: 50%;
  width: 2px; height: 10px; margin-left: -1px;
  transform-origin: 1px 170px;
  background: rgba(201,169,110,0.35); border-radius: 1px;
}
.wheel-glow-ring {
  position: absolute; inset: -18px; border-radius: 50%;
  background: conic-gradient(from 0deg,rgba(245,196,207,0.6),rgba(201,169,110,0.6),rgba(232,137,154,0.6),rgba(240,222,184,0.5),rgba(234,230,240,0.5),rgba(245,196,207,0.6));
  filter: blur(18px); opacity: 0; transition: opacity 0.8s ease;
  animation: rotateSlow 6s linear infinite;
}
.wheel-glow-ring.spinning { opacity: 1; }
.wheel-container { position: absolute; width: 310px; height: 310px; top: 50%; left: 50%; transform: translate(-50%,-50%); }
.wheel-empty {
  position: absolute; inset: 0; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2.5px dashed rgba(201,169,110,0.42); background: rgba(250,247,242,0.55);
  text-align: center; padding: 24px;
}
.wheel-empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.45; }
.wheel-empty p { font-family: var(--font-accent); font-style: italic; font-size: 15px; color: rgba(160,145,130,0.75); line-height: 1.6; }
.wheel-svg-wrap {
  position: absolute; inset: 0; border-radius: 50%; overflow: hidden;
  box-shadow: 0 12px 60px rgba(90,31,48,0.32), 0 4px 16px rgba(90,31,48,0.15), inset 0 0 0 5px rgba(255,255,255,0.6), inset 0 0 0 7px rgba(201,169,110,0.18);
  will-change: transform;
}
.wheel-hub {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: 60px; height: 60px; border-radius: 50%; background: white;
  box-shadow: 0 6px 24px rgba(90,31,48,0.25), inset 0 1px 0 rgba(255,255,255,0.95);
  display: flex; align-items: center; justify-content: center; z-index: 10;
}
.wheel-hub-ring { position: absolute; inset: 5px; border-radius: 50%; border: 1.5px solid rgba(201,169,110,0.4); }
.wheel-hub-inner { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#7A2D45,#C45B6E); box-shadow: 0 3px 10px rgba(122,45,69,0.55); }
.wheel-label { user-select: none; pointer-events: none; }
.wheel-pointer { position: absolute; top: -6px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; flex-direction: column; align-items: center; }
.pointer-svg { width: 28px; height: 36px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.28)); }
.pointer-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 36px; height: 36px; border-radius: 50%; background: radial-gradient(circle,rgba(232,137,154,0.8),transparent); filter: blur(8px); opacity: 0; transition: opacity 0.4s; pointer-events: none; }
.pointer-glow.active { opacity: 1; animation: pulseGlow 0.5s ease-in-out infinite; }

/* ── Spin Button ── */
.spin-btn-wrap { display: flex; justify-content: center; margin-bottom: 24px; }
.spin-btn {
  position: relative; padding: 17px 42px; border-radius: 26px; border: none; color: white;
  font-family: var(--font-body); font-size: 16px; font-weight: 700; letter-spacing: 0.02em;
  cursor: pointer; display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg,#5A1F30 0%,#7A2D45 30%,#C45B6E 70%,#E8899A 100%);
  box-shadow: 0 14px 40px rgba(122,45,69,0.48), 0 4px 12px rgba(122,45,69,0.3);
  overflow: hidden; transition: transform 0.2s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.2s ease;
}
.spin-btn:not(:disabled):hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 52px rgba(122,45,69,0.58); }
.spin-btn:not(:disabled):active { transform: scale(0.96); }
.spin-btn:disabled { opacity: 0.75; cursor: not-allowed; }
.spin-btn-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.2) 50%,transparent 100%); background-size: 200% auto; animation: shimmerText 2s linear infinite; pointer-events: none; }
.spin-ripple { position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,0.4); transform: translate(-50%,-50%); animation: ripple 1.2s ease-out infinite; pointer-events: none; }
.spin-icon { font-size: 20px; }
.spin-anim { animation: rotateSlow 0.6s linear infinite; }
.spin-hint { text-align: center; font-family: var(--font-accent); font-style: italic; font-size: 14.5px; color: rgba(160,145,130,0.7); padding: 12px; }

/* ── Selected count ── */
.selected-count { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding: 0 2px; }
.selected-line { flex: 1; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,169,110,0.4),transparent); }
.selected-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: var(--gold); opacity: 0.85; white-space: nowrap; }
.sel-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rose); animation: pulseGlow 2s ease-in-out infinite; }

/* ── Search ── */
.search-wrap { position: relative; margin-bottom: 14px; }
.search-icon-wrap { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.search-input {
  width: 100%; padding: 13px 44px 13px 44px; border-radius: 18px;
  border: 1px solid rgba(201,169,110,0.28); background: rgba(255,255,255,0.72);
  backdrop-filter: blur(14px); font-family: var(--font-body); font-size: 13.5px; color: var(--plum);
  outline: none; box-shadow: 0 2px 16px rgba(90,31,48,0.06); transition: all 0.25s ease;
}
.search-input::placeholder { color: rgba(160,145,130,0.7); }
.search-input:focus { border-color: rgba(232,137,154,0.55); box-shadow: 0 0 0 4px rgba(232,137,154,0.1), 0 4px 20px rgba(90,31,48,0.08); background: rgba(255,255,255,0.88); }
.search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 50%; border: none; background: rgba(0,0,0,0.07); color: var(--berry); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.search-clear:hover { background: rgba(0,0,0,0.12); }

/* ── Filter Section ── */
.filter-section { margin-bottom: 12px; }
.filter-switcher { display: flex; gap: 6px; margin-bottom: 10px; background: rgba(255,255,255,0.55); border: 1px solid rgba(201,169,110,0.22); border-radius: 12px; padding: 3px; width: fit-content; }
.fsw-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 9px; border: none; background: transparent; font-family: var(--font-body); font-size: 11.5px; font-weight: 600; color: rgba(120,100,100,0.65); cursor: pointer; transition: all 0.22s ease; -webkit-tap-highlight-color: transparent; }
.fsw-btn.active { background: linear-gradient(135deg,rgba(122,45,69,0.9),rgba(196,91,110,0.85)); color: white; box-shadow: 0 4px 14px rgba(122,45,69,0.3); }
.filter-row { display: flex; gap: 7px; overflow-x: auto; padding: 2px 2px 8px; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; }
.filter-slide-enter-active, .filter-slide-leave-active { transition: opacity 0.2s ease, transform 0.22s ease; }
.filter-slide-enter-from { opacity: 0; transform: translateY(-5px); }
.filter-slide-leave-to { opacity: 0; transform: translateY(4px); }
.filter-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 7px 13px; border-radius: 100px;
  border: 1.5px solid rgba(201,169,110,0.28); background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px); font-family: var(--font-body); font-size: 11.5px; font-weight: 600;
  color: rgba(120,100,100,0.75); cursor: pointer; white-space: nowrap; scroll-snap-align: start;
  transition: all 0.22s cubic-bezier(0.34,1.2,0.64,1); -webkit-tap-highlight-color: transparent;
}
.filter-chip:hover { border-color: rgba(232,137,154,0.45); color: var(--berry); background: rgba(253,232,237,0.6); transform: translateY(-1px); }
.filter-chip:active { transform: scale(0.95); }
.filter-chip.active { background: linear-gradient(135deg,rgba(122,45,69,0.9),rgba(196,91,110,0.85)); border-color: transparent; color: white; box-shadow: 0 5px 18px rgba(122,45,69,0.35); transform: translateY(-1px); }
.filter-chip-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.6; }
.filter-chip.active .filter-chip-dot { background: white; opacity: 0.8; animation: pulseGlow 1.8s ease-in-out infinite; }
.district-chip { gap: 3px; }
.district-count { display: inline-flex; align-items: center; justify-content: center; min-width: 16px; height: 16px; border-radius: 100px; background: rgba(0,0,0,0.08); font-size: 9.5px; font-weight: 700; padding: 0 4px; }
.filter-chip.active .district-count { background: rgba(255,255,255,0.25); }

/* ── Result bar + quick-select ── */
.result-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 0 2px; gap: 10px; flex-wrap: wrap; }
.result-text { font-size: 12px; color: rgba(150,130,120,0.8); flex-shrink: 0; }
.result-num { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--berry); }
.quick-select { display: flex; gap: 6px; flex-wrap: wrap; }
.qs-btn { padding: 6px 12px; border-radius: 100px; border: 1.5px solid rgba(201,169,110,0.3); background: rgba(255,255,255,0.55); font-family: var(--font-body); font-size: 11px; font-weight: 600; color: rgba(120,100,100,0.8); cursor: pointer; transition: all 0.2s; white-space: nowrap; -webkit-tap-highlight-color: transparent; }
.qs-btn:hover { border-color: rgba(232,137,154,0.45); color: var(--berry); background: rgba(253,232,237,0.55); }
.qs-btn:active { transform: scale(0.94); }
.qs-random { background: linear-gradient(135deg,rgba(122,45,69,0.08),rgba(201,169,110,0.1)); border-color: rgba(122,45,69,0.2); color: var(--berry); }

/* ── Check header ── */
.check-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 0 2px; }
.check-header-line { flex: 1; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,169,110,0.35),transparent); }
.check-header-text { font-size: 10px; font-weight: 700; letter-spacing: 0.32em; text-transform: uppercase; color: rgba(160,145,130,0.7); white-space: nowrap; }

/* ── Checklist ── */
.checklist { display: flex; flex-direction: column; gap: 8px; }
.check-item {
  display: flex; align-items: center; gap: 11px; padding: 12px 14px;
  border-radius: 18px; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1);
  user-select: none; -webkit-tap-highlight-color: transparent;
  background: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 2px 8px rgba(90,31,48,0.04);
}
.check-item.checked { background: rgba(245,196,207,0.38); border-color: rgba(122,45,69,0.2); box-shadow: 0 6px 24px rgba(122,45,69,0.1); transform: scale(1.01); }
.check-item:active { transform: scale(0.975); }
.check-ring { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(0,0,0,0.06); border: 1.5px solid rgba(122,45,69,0.22); transition: all 0.25s cubic-bezier(0.34,1.4,0.64,1); }
.check-ring.on { background: linear-gradient(135deg,#7A2D45,#C45B6E); border-color: transparent; box-shadow: 0 4px 14px rgba(122,45,69,0.44); transform: scale(1.08); }
.check-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(90,31,48,0.08); }
.check-info { flex: 1; min-width: 0; }
.check-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.check-name { font-family: var(--font-display); font-size: 14.5px; font-weight: 600; color: rgba(120,100,100,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.25s; flex: 1; min-width: 0; }
.check-name.active { color: var(--berry-dark); }
.exp-badge { flex-shrink: 0; font-size: 10px; font-weight: 700; color: var(--sage); background: rgba(141,170,140,0.18); border: 1px solid rgba(141,170,140,0.3); border-radius: 100px; padding: 1px 7px; white-space: nowrap; }
.check-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.check-price { font-size: 10.5px; color: rgba(190,165,150,0.8); transition: color 0.25s; }
.check-price.active { color: var(--rose-deep); opacity: 0.85; }
.check-district { font-size: 10px; color: rgba(180,140,150,0.75); white-space: nowrap; }

/* ── Empty list state ── */
.list-empty { text-align: center; padding: 40px 20px; }
.list-empty-icon { font-size: 40px; margin-bottom: 10px; opacity: 0.5; }
.list-empty p { font-family: var(--font-accent); font-style: italic; font-size: 15px; color: rgba(160,145,130,0.65); margin-bottom: 14px; }
.clear-filter-btn { padding: 8px 18px; border-radius: 100px; border: 1.5px solid rgba(122,45,69,0.22); background: rgba(245,196,207,0.3); font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--berry); cursor: pointer; transition: all 0.2s; }
.clear-filter-btn:hover { background: rgba(245,196,207,0.5); }

/* ── Fade scale transition ── */
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: translateY(-50%) scale(0.7); }

/* ══ WINNER MODAL ══ */
.modal-overlay { position: fixed; inset: 0; z-index: 70; display: flex; align-items: flex-end; justify-content: center; padding: 0 16px 28px; background: rgba(61,26,38,0.65); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.winner-card { width: 100%; max-width: 400px; border-radius: 36px; overflow: hidden; background: #FAF7F2; box-shadow: 0 24px 80px rgba(90,31,48,0.38), 0 8px 24px rgba(90,31,48,0.2); }
.winner-band { height: 5px; background: linear-gradient(90deg,#7A2D45,#C45B6E,#E8899A,#C9A96E,#E8899A,#C45B6E,#7A2D45); background-size: 200% auto; animation: borderShimmer 3s linear infinite; }
.winner-body { padding: 28px 28px 32px; position: relative; overflow: hidden; }
.winner-blob-1 { position: absolute; top: -50px; right: -50px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle,rgba(245,196,207,0.8),transparent); filter: blur(26px); pointer-events: none; }
.winner-blob-2 { position: absolute; bottom: -30px; left: -30px; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle,rgba(201,169,110,0.6),transparent); filter: blur(22px); pointer-events: none; }
.winner-blob-3 { position: absolute; top: 40%; left: 40%; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle,rgba(234,230,240,0.6),transparent); filter: blur(30px); pointer-events: none; }
.winner-content { position: relative; text-align: center; }
.winner-celebrate { margin-bottom: 18px; }
.winner-emoji-ring { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg,rgba(245,196,207,0.7),rgba(201,169,110,0.4)); box-shadow: 0 12px 40px rgba(122,45,69,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; position: relative; }
.winner-ripple { position: absolute; inset: 0; border-radius: 50%; border: 2px solid rgba(232,137,154,0.5); animation: ripple 2s ease-out infinite; }
.winner-ripple-2 { animation-delay: 0.6s; }
.winner-emoji { font-size: 42px; position: relative; z-index: 1; }
.winner-stars { font-size: 11px; letter-spacing: 10px; margin-bottom: 2px; }
.winner-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); opacity: 0.82; margin-bottom: 8px; }
.winner-name { font-family: var(--font-display); font-size: 27px; font-weight: 600; color: var(--berry-dark); line-height: 1.2; margin-bottom: 7px; }
.winner-addr { font-size: 12px; color: rgba(160,145,130,0.8); display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 16px; line-height: 1.5; }
.winner-divider { height: 1px; margin-bottom: 14px; background: linear-gradient(90deg,transparent,rgba(201,169,110,0.55),rgba(232,137,154,0.4),rgba(201,169,110,0.55),transparent); }
.winner-price { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 100px; background: linear-gradient(135deg,rgba(201,169,110,0.2),rgba(245,196,207,0.3)); border: 1px solid rgba(201,169,110,0.32); font-size: 13.5px; font-weight: 600; color: var(--berry); margin-bottom: 12px; }
.winner-pro { display: flex; flex-direction: column; gap: 3px; padding: 10px 16px; border-radius: 14px; background: rgba(141,170,140,0.12); border: 1px solid rgba(141,170,140,0.28); margin-bottom: 20px; text-align: left; }
.winner-pro-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sage); }
.winner-pro-text { font-size: 13px; color: var(--plum); opacity: 0.75; line-height: 1.5; }
.winner-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-spin-again { flex: 1; padding: 13px 10px; border-radius: 16px; border: 1.5px solid rgba(201,169,110,0.3); background: rgba(255,255,255,0.6); font-family: var(--font-body); font-size: 12.5px; font-weight: 700; color: var(--berry); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-spin-again:hover { background: rgba(245,196,207,0.35); border-color: rgba(232,137,154,0.4); transform: translateY(-1px); }
.btn-spin-again:active { transform: scale(0.96); }
.btn-close { flex: 1; padding: 13px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.05); font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: rgba(100,85,85,0.8); cursor: pointer; transition: all 0.2s; }
.btn-close:hover { background: rgba(0,0,0,0.09); }
.btn-close:active { transform: scale(0.96); }
.btn-map { flex: 2; padding: 13px; border-radius: 16px; border: none; background: linear-gradient(135deg,#7A2D45 0%,#C45B6E 55%,#E8899A 100%); box-shadow: var(--shadow-btn); font-family: var(--font-body); font-size: 12.5px; font-weight: 700; color: white; text-decoration: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.25s; white-space: nowrap; }
.btn-map:hover { transform: translateY(-2px); box-shadow: 0 16px 44px rgba(122,45,69,0.52); }
.btn-map:active { transform: scale(0.97); }
</style>