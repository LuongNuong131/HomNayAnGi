<template>
  <main class="home">

    <!-- ── Section Header ── -->
    <div class="section-head">
      <div class="section-left">
        <p class="section-eyebrow">Bộ sưu tập</p>
        <h2 class="section-title">
          Những nơi<br>
          <em>tụi mình yêu</em>
        </h2>
      </div>
      <div class="count-badge">
        <span class="count-pulse"></span>
        <span class="count-num">{{ store.restaurants.length }}</span>
        <span class="count-label">địa điểm</span>
      </div>
    </div>

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
        placeholder="Tìm quán yêu thích..."
        class="search-input"
      />
      <transition name="fade-in">
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </transition>
    </div>

    <!-- ── Filter Tabs ── -->
    <div class="filter-section">

      <!-- Filter type switcher -->
      <div class="filter-switcher">
        <button
          class="fsw-btn"
          :class="{ active: filterMode === 'category' }"
          @click="filterMode = 'category'; activeDistrict = ''"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M4 12h8M4 18h16"/>
          </svg>
          Loại
        </button>
        <button
          class="fsw-btn"
          :class="{ active: filterMode === 'district' }"
          @click="filterMode = 'district'; activeFilter = ''"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Khu vực
        </button>
      </div>

      <!-- Category filters -->
      <transition name="filter-slide">
        <div v-if="filterMode === 'category'" class="filter-row no-scrollbar">
          <button
            class="filter-chip"
            :class="{ active: activeFilter === '' }"
            @click="activeFilter = ''"
          >
            <span class="filter-chip-dot"></span>
            Tất cả
          </button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'cheap' }"
            @click="activeFilter = activeFilter === 'cheap' ? '' : 'cheap'"
          >💸 Bình dân</button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'buffet' }"
            @click="activeFilter = activeFilter === 'buffet' ? '' : 'buffet'"
          >🍽️ Buffet</button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'has_pros' }"
            @click="activeFilter = activeFilter === 'has_pros' ? '' : 'has_pros'"
          >✨ Có ưu điểm</button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'no_cons' }"
            @click="activeFilter = activeFilter === 'no_cons' ? '' : 'no_cons'"
          >🌟 Không nhược điểm</button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'drink' }"
            @click="activeFilter = activeFilter === 'drink' ? '' : 'drink'"
          >🧋 Đồ uống</button>
          <button
            class="filter-chip"
            :class="{ active: activeFilter === 'grill' }"
            @click="activeFilter = activeFilter === 'grill' ? '' : 'grill'"
          >🔥 Đồ nướng</button>
        </div>
      </transition>

      <!-- District filters -->
      <transition name="filter-slide">
        <div v-if="filterMode === 'district'" class="filter-row no-scrollbar">
          <button
            class="filter-chip district-chip"
            :class="{ active: activeDistrict === '' }"
            @click="activeDistrict = ''"
          >
            <span class="filter-chip-dot"></span>
            Tất cả
          </button>
          <button
            v-for="d in availableDistricts"
            :key="d.key"
            class="filter-chip district-chip"
            :class="{ active: activeDistrict === d.key }"
            @click="activeDistrict = activeDistrict === d.key ? '' : d.key"
          >
            <span class="district-pin">📍</span>
            {{ d.label }}
            <span class="district-count">{{ d.count }}</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- ── Result count ── -->
    <div class="result-info" v-if="searchQuery || activeFilter || activeDistrict">
      <span class="result-count">{{ filteredRestaurants.length }}</span>
      <span class="result-label"> kết quả</span>
      <button
        v-if="activeFilter || activeDistrict || searchQuery"
        class="result-clear"
        @click="searchQuery = ''; activeFilter = ''; activeDistrict = ''"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        Xóa lọc
      </button>
    </div>

    <!-- ── Empty state ── -->
    <transition name="page">
      <div v-if="filteredRestaurants.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-title">Không tìm thấy quán nào</p>
        <p class="empty-sub">Thử từ khóa khác nhé cưng</p>
      </div>
    </transition>

    <!-- ── Cards ── -->
    <div class="cards-list">
      <TransitionGroup name="list" tag="div" class="cards-inner">
        <div
          v-for="(place, index) in filteredRestaurants"
          :key="place.id"
          class="card-wrap"
          :style="`animation-delay: ${index * 35}ms`"
          @click="openDetails(place)"
        >
          <div class="card">
            <!-- Shimmer accent corner -->
            <div class="card-corner-accent"></div>

            <!-- Number badge -->
            <div class="card-num-badge">
              {{ String(place.id).padStart(2, '0') }}
            </div>

            <!-- Left icon -->
            <div class="card-icon" :style="iconGrad(index)">
              <span class="card-emoji">{{ cardEmoji(place.name) }}</span>
            </div>

            <!-- Body -->
            <div class="card-body">
              <h4 class="card-name">{{ place.name }}</h4>

              <!-- District tag -->
              <div class="card-district-tag" v-if="getDistrict(place.address)">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ getDistrict(place.address)?.label }}
              </div>

              <p class="card-addr">{{ place.address }}</p>

              <div class="card-chips">
                <span v-if="place.price" class="chip chip-price">
                  💰 {{ place.price }}
                </span>
                <span v-if="place.advantage" class="chip chip-pro">
                  ✦ Có ưu điểm
                </span>
                <span v-if="!place.disadvantages && place.advantage" class="chip chip-clean">
                  🌟 Hoàn hảo
                </span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="card-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="#7A2D45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Footer ornament -->
      <div v-if="filteredRestaurants.length > 0" class="list-footer">
        <div class="footer-line"></div>
        <span class="footer-ornament">✦</span>
        <span class="footer-text">{{ filteredRestaurants.length }} địa điểm</span>
        <span class="footer-ornament">✦</span>
        <div class="footer-line"></div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         DETAIL BOTTOM SHEET
    ══════════════════════════════════════ -->
    <Teleport to="body">
      <transition name="sheet">
        <div
          v-if="selectedPlace"
          class="overlay"
          @click.self="selectedPlace = null"
        >
          <transition name="sheet-content">
            <div v-if="selectedPlace" class="sheet">

              <!-- Handle -->
              <div class="sheet-handle-wrap">
                <div class="sheet-handle"></div>
              </div>

              <!-- Scrollable content -->
              <div class="sheet-body no-scrollbar">

                <!-- Hero section -->
                <div class="sheet-hero">
                  <div class="sheet-blob-1"></div>
                  <div class="sheet-blob-2"></div>

                  <div class="sheet-hero-inner">
                    <div class="sheet-icon-big" :style="iconGrad(selectedPlace.id - 1)">
                      <span style="font-size: 28px;">{{ cardEmoji(selectedPlace.name) }}</span>
                    </div>
                    <div class="sheet-info">
                      <h3 class="sheet-name">{{ selectedPlace.name }}</h3>
                      <!-- District in sheet -->
                      <div class="sheet-district" v-if="getDistrict(selectedPlace.address)">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(232,137,154,0.8)" stroke-width="2.5" stroke-linecap="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {{ getDistrict(selectedPlace.address)?.label }}
                      </div>
                      <p class="sheet-addr">{{ selectedPlace.address }}</p>
                    </div>
                  </div>
                </div>

                <div class="sheet-divider"></div>

                <!-- Price -->
                <div v-if="selectedPlace.price" class="sheet-price">
                  <span class="price-tag">
                    <span style="font-size: 15px;">💰</span>
                    {{ selectedPlace.price }}
                  </span>
                </div>

                <!-- Detail cards -->
                <div class="detail-cards">
                  <div v-if="selectedPlace.advantage" class="detail-card detail-pro">
                    <div class="detail-bar detail-bar-pro"></div>
                    <div class="detail-inner">
                      <p class="detail-label detail-label-pro">✨ Ưu điểm</p>
                      <p class="detail-text">{{ selectedPlace.advantage }}</p>
                    </div>
                  </div>

                  <div v-if="selectedPlace.disadvantages" class="detail-card detail-con">
                    <div class="detail-bar detail-bar-con"></div>
                    <div class="detail-inner">
                      <p class="detail-label detail-label-con">⚠️ Nhược điểm</p>
                      <p class="detail-text">{{ selectedPlace.disadvantages }}</p>
                    </div>
                  </div>

                  <div
                    v-if="!selectedPlace.advantage && !selectedPlace.disadvantages"
                    class="detail-empty"
                  >
                    <span>🌸</span>
                    <p>Chưa có ghi chú nào...</p>
                  </div>
                </div>

                <!-- Buttons -->
                <div class="sheet-btns">
                  <button class="btn-close" @click="selectedPlace = null">Đóng lại</button>
                  <a
                    v-if="selectedPlace.linkmap"
                    :href="selectedPlace.linkmap"
                    target="_blank"
                    class="btn-map"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
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

const store = useRestaurantStore()
const selectedPlace = ref<Restaurant | null>(null)
const searchQuery   = ref('')
const activeFilter  = ref('')
const activeDistrict = ref('')
const filterMode    = ref<'category' | 'district'>('category')

// ─── District mapping ─────────────────────────────
// Map ward/commune names found in addresses → district label
interface DistrictInfo { key: string; label: string }

const DISTRICT_MAP: Array<{ wards: string[]; key: string; label: string }> = [
  {
    key: 'go-vap',
    label: 'Gò Vấp',
    wards: ['Hạnh Thông', 'An Hội', 'Gò Vấp', 'Nguyễn Văn Nghi', 'Phan Văn Trị', 'Lê Đức Thọ', 'Quang Trung', 'Nguyễn Văn Bảo'],
  },
  {
    key: 'quan-12',
    label: 'Quận 12',
    wards: ['Đông Hưng Thuận', 'Tân Thới Hiệp', 'Trung Mỹ Tây', 'An Phú Đông', 'Nguyễn Văn Quá', 'Thị Mười', 'Tô Ký', 'Quận 12'],
  },
  {
    key: 'hoc-mon',
    label: 'Hóc Môn',
    wards: ['Bà Điểm', 'Phan Văn Hớn', 'Nguyễn Hữu Cầu', 'Nguyễn Ảnh Thủ', 'Vạn Hạnh', 'Song Hành'],
  },
  {
    key: 'binh-thanh',
    label: 'Bình Thạnh',
    wards: ['Nhiêu Lộc', 'Gia Định', 'Phan Xích Long', 'Hoàng Sa', 'Lý Chính Thắng'],
  },
  {
    key: 'thu-duc',
    label: 'TP. Thủ Đức',
    wards: ['Linh Xuân', 'Thủ Đức'],
  },
  {
    key: 'binh-duong',
    label: 'Bình Dương',
    wards: ['Phú Lợi', 'Lê Hồng Phong', 'Diên Hồng', 'Tam Đảo'],
  },
]

const getDistrict = (address: string): DistrictInfo | null => {
  const a = address.toLowerCase()
  for (const d of DISTRICT_MAP) {
    if (d.wards.some(w => a.includes(w.toLowerCase()))) {
      return { key: d.key, label: d.label }
    }
  }
  return null
}

// Available districts that actually have restaurants
const availableDistricts = computed(() => {
  return DISTRICT_MAP
    .map(d => {
      const count = store.restaurants.filter(r => {
        const dist = getDistrict(r.address)
        return dist?.key === d.key
      }).length
      return { key: d.key, label: d.label, count }
    })
    .filter(d => d.count > 0)
})

// ─── Filtering ───────────────────────────────────
const filteredRestaurants = computed(() => {
  let list = store.restaurants

  // Text search
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.advantage?.toLowerCase().includes(q) ||
      r.disadvantages?.toLowerCase().includes(q)
    )
  }

  // Category filter
  switch (activeFilter.value) {
    case 'cheap':
      list = list.filter(r => {
        if (!r.price) return false
        const nums = r.price.match(/\d+/g)
        if (!nums) return false
        const min = Math.min(...nums.map(Number))
        return min <= 30000 || (min < 1000 && min <= 30)
      })
      break
    case 'buffet':
      list = list.filter(r => r.name.toLowerCase().includes('buffet'))
      break
    case 'has_pros':
      list = list.filter(r => r.advantage && r.advantage.trim() !== '')
      break
    case 'no_cons':
      list = list.filter(r => !r.disadvantages || r.disadvantages.trim() === '')
      break
    case 'drink':
      list = list.filter(r => {
        const n = r.name.toLowerCase()
        return n.includes('trà') || n.includes('tea') || n.includes('nước') || n.includes('milk')
      })
      break
    case 'grill':
      list = list.filter(r => {
        const n = r.name.toLowerCase()
        return n.includes('nướng') || n.includes('chân gà') || n.includes('lòng')
      })
      break
  }

  // District filter
  if (activeDistrict.value) {
    list = list.filter(r => {
      const d = getDistrict(r.address)
      return d?.key === activeDistrict.value
    })
  }

  return list
})

const openDetails = (place: Restaurant) => { selectedPlace.value = place }

const ICON_GRADS = [
  'background: linear-gradient(135deg, #FDE8ED 0%, #F5C4CF 100%);',
  'background: linear-gradient(135deg, #F0DEB8 0%, #FDE8ED 100%);',
  'background: linear-gradient(135deg, #EAE6F0 0%, #FDE8ED 100%);',
  'background: linear-gradient(135deg, #F5C4CF 0%, rgba(232,137,154,0.4) 100%);',
  'background: linear-gradient(135deg, #F0DEB8 0%, rgba(201,169,110,0.35) 100%);',
]
const iconGrad = (i: number) => ICON_GRADS[i % ICON_GRADS.length]

const cardEmoji = (name: string): string => {
  const l = name.toLowerCase()
  if (l.includes('burger') || l.includes('hamburger')) return '🍔'
  if (l.includes('hàu') || l.includes('ốc') || l.includes('hải sản')) return '🦪'
  if (l.includes('bánh') || l.includes('bột')) return '🥐'
  if (l.includes('bún') || l.includes('phở')) return '🍜'
  if (l.includes('cơm')) return '🍚'
  if (l.includes('lẩu')) return '🫕'
  if (l.includes('trà') || l.includes('tea')) return '🧋'
  if (l.includes('buffet')) return '🍽️'
  if (l.includes('nướng')) return '🔥'
  if (l.includes('gà') || l.includes('chân')) return '🍗'
  if (l.includes('thai') || l.includes('nhật') || l.includes('hàn')) return '🍱'
  if (l.includes('takoyaki')) return '🐙'
  if (l.includes('trứng')) return '🥚'
  return '🌸'
}
</script>

<style scoped>
.home { padding: 22px 20px 130px; }

/* ── Section Header ── */
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
  padding: 0 2px;
}
.section-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
  margin-bottom: 5px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  color: var(--berry-dark);
  line-height: 1.2;
}
.section-title em {
  font-weight: 600;
  font-style: italic;
  color: var(--berry);
}
.count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(245,196,207,0.55), rgba(201,169,110,0.22));
  border: 1px solid rgba(201,169,110,0.32);
  box-shadow: 0 2px 12px rgba(122,45,69,0.08);
}
.count-pulse {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--rose);
  animation: pulseGlow 2s ease-in-out infinite;
}
.count-num {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--berry-dark);
  line-height: 1;
}
.count-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--berry);
  opacity: 0.7;
}

/* ── Search ── */
.search-wrap {
  position: relative;
  margin-bottom: 16px;
}
.search-icon-wrap {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 14px 44px 14px 44px;
  border-radius: 20px;
  border: 1px solid rgba(201,169,110,0.28);
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(14px);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--plum);
  outline: none;
  box-shadow: 0 2px 16px rgba(90,31,48,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: all 0.25s ease;
}
.search-input::placeholder { color: rgba(160,145,130,0.7); }
.search-input:focus {
  border-color: rgba(232,137,154,0.55);
  box-shadow: 0 0 0 4px rgba(232,137,154,0.1), 0 4px 20px rgba(90,31,48,0.08);
  background: rgba(255,255,255,0.88);
}
.search-clear {
  position: absolute;
  right: 14px; top: 50%;
  transform: translateY(-50%);
  width: 26px; height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.07);
  color: var(--berry);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.search-clear:hover { background: rgba(0,0,0,0.12); }

/* ── Filter Section ── */
.filter-section {
  margin-bottom: 10px;
}

/* Filter mode switcher */
.filter-switcher {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(201,169,110,0.22);
  border-radius: 14px;
  padding: 4px;
  width: fit-content;
}
.fsw-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: rgba(120,100,100,0.65);
  cursor: pointer;
  transition: all 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}
.fsw-btn.active {
  background: linear-gradient(135deg, rgba(122,45,69,0.9), rgba(196,91,110,0.85));
  color: white;
  box-shadow: 0 4px 14px rgba(122,45,69,0.3);
}
.fsw-btn:not(.active):hover {
  color: var(--berry);
  background: rgba(245,196,207,0.35);
}

/* Filter chips row */
.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 10px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

/* Filter slide transition */
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.filter-slide-enter-from { opacity: 0; transform: translateY(-6px); }
.filter-slide-leave-to   { opacity: 0; transform: translateY(4px); }

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: 100px;
  border: 1.5px solid rgba(201,169,110,0.28);
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: rgba(120,100,100,0.75);
  cursor: pointer;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: all 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}
.filter-chip:hover {
  border-color: rgba(232,137,154,0.45);
  color: var(--berry);
  background: rgba(253,232,237,0.6);
  transform: translateY(-1px);
}
.filter-chip:active { transform: scale(0.95); }
.filter-chip.active {
  background: linear-gradient(135deg, rgba(122,45,69,0.9), rgba(196,91,110,0.85));
  border-color: transparent;
  color: white;
  box-shadow: 0 6px 20px rgba(122,45,69,0.35);
  transform: translateY(-1px);
}
.filter-chip-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}
.filter-chip.active .filter-chip-dot {
  background: white;
  opacity: 0.8;
  animation: pulseGlow 1.8s ease-in-out infinite;
}

/* District specific chips */
.district-chip {
  gap: 4px;
}
.district-pin {
  font-size: 11px;
}
.district-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px; height: 18px;
  border-radius: 100px;
  background: rgba(0,0,0,0.08);
  font-size: 10px;
  font-weight: 700;
  padding: 0 5px;
}
.filter-chip.active .district-count {
  background: rgba(255,255,255,0.25);
}

/* ── Result info ── */
.result-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px 12px;
  font-size: 12px;
}
.result-count {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--berry);
}
.result-label {
  color: rgba(160,145,130,0.75);
  font-weight: 500;
}
.result-clear {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid rgba(122,45,69,0.18);
  background: rgba(245,196,207,0.28);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: var(--berry);
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.2s;
}
.result-clear:hover { background: rgba(245,196,207,0.5); }

/* ── Empty ── */
.empty-state {
  text-align: center;
  padding: 64px 24px;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.6; }
.empty-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-style: italic;
  color: var(--berry);
  opacity: 0.5;
  margin-bottom: 6px;
}
.empty-sub { font-size: 13px; color: rgba(160,145,130,0.7); }

/* ── Cards ── */
.cards-list {}
.cards-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;   /* ← khoảng cách giữa các card */
}

.card-wrap {
  animation: fadeIn 0.5s ease both;
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px;
  border-radius: 24px;
  background: rgba(255,255,255,0.84);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.95);
  box-shadow:
    0 6px 32px rgba(90,31,48,0.08),
    0 1px 4px rgba(90,31,48,0.04),
    inset 0 1px 0 rgba(255,255,255,1);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1),
    box-shadow 0.28s ease;
  -webkit-tap-highlight-color: transparent;
}
.card:hover {
  transform: translateY(-5px) scale(1.007);
  box-shadow:
    0 20px 60px rgba(90,31,48,0.14),
    0 4px 16px rgba(90,31,48,0.07),
    inset 0 1px 0 rgba(255,255,255,1);
}
.card:active {
  transform: scale(0.976);
  box-shadow: 0 4px 16px rgba(90,31,48,0.08);
}

/* Corner shimmer */
.card-corner-accent {
  position: absolute;
  top: 0; right: 0;
  width: 120px; height: 120px;
  background: radial-gradient(ellipse at 100% 0%, rgba(245,196,207,0.6) 0%, transparent 60%);
  pointer-events: none;
}

/* Number badge */
.card-num-badge {
  position: absolute;
  top: 12px; right: 14px;
  font-family: var(--font-display);
  font-size: 10.5px;
  font-weight: 600;
  color: rgba(201,169,110,0.5);
  letter-spacing: 0.06em;
  line-height: 1;
  padding: 3px 7px;
  border-radius: 100px;
  background: rgba(201,169,110,0.08);
  border: 1px solid rgba(201,169,110,0.15);
}

.card-icon {
  width: 54px; height: 54px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow:
    0 4px 14px rgba(90,31,48,0.1),
    inset 0 1px 0 rgba(255,255,255,0.8);
}
.card-emoji { font-size: 24px; }

.card-body { flex: 1; min-width: 0; }
.card-name {
  font-family: var(--font-display);
  font-size: 17.5px;
  font-weight: 600;
  color: var(--berry-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 42px; /* space for num badge */
  margin-bottom: 5px;
  line-height: 1.3;
}

/* District tag inline */
.card-district-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(232,137,154,0.15), rgba(245,196,207,0.2));
  border: 1px solid rgba(232,137,154,0.22);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--rose-deep);
  margin-bottom: 5px;
}

.card-addr {
  font-size: 11px;
  color: rgba(150,130,120,0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  line-height: 1.4;
}
.card-chips { display: flex; gap: 6px; flex-wrap: wrap; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--r-chip);
  font-size: 10.5px;
  font-weight: 600;
}
.chip-price {
  background: linear-gradient(135deg, rgba(201,169,110,0.2), rgba(245,196,207,0.28));
  color: var(--berry);
  border: 1px solid rgba(201,169,110,0.25);
}
.chip-pro {
  background: rgba(141,170,140,0.14);
  color: var(--sage);
  border: 1px solid rgba(141,170,140,0.28);
}
.chip-clean {
  background: rgba(234,230,240,0.45);
  color: #5A3870;
  border: 1px solid rgba(180,160,210,0.3);
}

.card-arrow {
  position: absolute;
  bottom: 16px; right: 14px;
  opacity: 0.22;
  transition: opacity 0.2s, transform 0.2s;
}
.card:hover .card-arrow { opacity: 0.55; transform: translateX(2px); }

/* ── List footer ── */
.list-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 28px 4px 8px;
}
.footer-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent);
}
.footer-ornament {
  font-size: 9px;
  color: rgba(201,169,110,0.55);
}
.footer-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 13px;
  color: rgba(201,169,110,0.6);
  white-space: nowrap;
}

/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(61,26,38,0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* ── Sheet ── */
.sheet {
  background: #FAF7F2;
  border-radius: 36px 36px 0 0;
  box-shadow: var(--shadow-sheet);
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sheet-handle-wrap {
  padding: 16px 0 8px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
.sheet-handle {
  width: 44px; height: 5px;
  border-radius: 10px;
  background: rgba(122,45,69,0.18);
}
.sheet-body {
  padding: 0 24px 36px;
  overflow-y: auto;
  flex: 1;
}

/* Sheet hero */
.sheet-hero {
  position: relative;
  padding-bottom: 22px;
  margin-bottom: 4px;
  overflow: hidden;
}
.sheet-blob-1 {
  position: absolute;
  width: 180px; height: 180px;
  top: -60px; right: -50px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,196,207,0.65), transparent);
  filter: blur(24px);
  pointer-events: none;
}
.sheet-blob-2 {
  position: absolute;
  width: 140px; height: 140px;
  bottom: 0; left: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,169,110,0.4), transparent);
  filter: blur(20px);
  pointer-events: none;
}
.sheet-hero-inner {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.sheet-icon-big {
  width: 62px; height: 62px;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(90,31,48,0.14);
}
.sheet-info { flex: 1; }
.sheet-name {
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 600;
  color: var(--berry-dark);
  line-height: 1.25;
  margin-bottom: 6px;
}
.sheet-district {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(232,137,154,0.15), rgba(245,196,207,0.2));
  border: 1px solid rgba(232,137,154,0.22);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--rose-deep);
  margin-bottom: 6px;
}
.sheet-addr {
  font-size: 12px;
  color: rgba(160,145,130,0.85);
  display: flex;
  align-items: flex-start;
  gap: 5px;
  line-height: 1.5;
}

/* Sheet divider */
.sheet-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.55), rgba(232,137,154,0.4), rgba(201,169,110,0.55), transparent);
  margin-bottom: 18px;
}

/* Price */
.sheet-price { margin-bottom: 18px; }
.price-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(201,169,110,0.22), rgba(245,196,207,0.32));
  border: 1px solid rgba(201,169,110,0.3);
  font-family: var(--font-body);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--berry);
  box-shadow: 0 2px 10px rgba(122,45,69,0.08);
}

/* Detail cards */
.detail-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.detail-card {
  padding: 15px 16px 15px 20px;
  border-radius: 18px;
  background: rgba(255,255,255,0.72);
  position: relative;
  overflow: hidden;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(90,31,48,0.05);
}
.detail-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  border-radius: 18px 0 0 18px;
}
.detail-bar-pro { background: linear-gradient(180deg, #8DAA8C, #C5D5C4); }
.detail-bar-con { background: linear-gradient(180deg, #E8899A, #F5C4CF); }
.detail-pro { border: 1px solid rgba(141,170,140,0.3); }
.detail-con { border: 1px solid rgba(232,137,154,0.32); }
.detail-inner { flex: 1; }
.detail-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.detail-label-pro { color: var(--sage); }
.detail-label-con { color: var(--rose-deep); }
.detail-text { font-size: 13.5px; color: var(--plum); opacity: 0.75; line-height: 1.6; }
.detail-empty {
  text-align: center; padding: 20px;
  color: rgba(160,145,130,0.7);
  font-style: italic; font-size: 14px;
  display: flex; gap: 8px; align-items: center; justify-content: center;
}

/* Sheet buttons */
.sheet-btns { display: flex; gap: 10px; }
.btn-close {
  flex: 1;
  padding: 16px;
  border-radius: var(--r-btn);
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(0,0,0,0.05);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(100,85,85,0.8);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-close:hover { background: rgba(0,0,0,0.09); }
.btn-close:active { transform: scale(0.96); }
.btn-map {
  flex: 2;
  padding: 16px;
  border-radius: var(--r-btn);
  border: none;
  background: linear-gradient(135deg, #7A2D45 0%, #C45B6E 55%, #E8899A 100%);
  box-shadow: var(--shadow-btn);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.25s;
}
.btn-map:hover { transform: translateY(-2px); box-shadow: 0 16px 44px rgba(122,45,69,0.5); }
.btn-map:active { transform: scale(0.97); }
</style>