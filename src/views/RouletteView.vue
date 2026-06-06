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

      <!-- Outer glow ring (spinning) -->
      <div class="wheel-glow-ring" :class="{ spinning: isSpinning }"></div>

      <!-- Wheel container -->
      <div class="wheel-container">

        <!-- Empty placeholder -->
        <div v-if="candidates.length < 2" class="wheel-empty">
          <div class="wheel-empty-icon">🌀</div>
          <p>Hãy chọn ít nhất 2 quán<br>bên dưới nhé cưng</p>
        </div>

        <!-- SVG Wheel -->
        <div
          v-else
          class="wheel-svg-wrap"
          :class="{ 'spin-ease': isSpinning }"
          :style="{ transform: `rotate(${rotation}deg)` }"
        >
          <svg width="290" height="290" viewBox="0 0 290 290">
            <defs>
              <filter id="seg-shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-opacity="0.08"/>
              </filter>
            </defs>
            <g transform="translate(145,145)">
              <path
                v-for="(p, i) in candidates" :key="p.id"
                :d="segPath(i, candidates.length, 140)"
                :fill="segFill(i)"
                stroke="rgba(255,255,255,0.65)"
                stroke-width="1.8"
                filter="url(#seg-shadow)"
              />
              <!-- Segment labels -->
              <text
                v-for="(p, i) in candidates" :key="'t'+p.id"
                :transform="labelTransform(i, candidates.length)"
                text-anchor="middle"
                dominant-baseline="middle"
                :font-size="candidates.length > 8 ? 9.5 : 11.5"
                font-family="Cormorant Garamond, serif"
                font-weight="600"
                :fill="segText(i)"
                class="wheel-label"
              >
                {{ shorten(p.name, candidates.length > 8 ? 10 : 15) }}
              </text>
            </g>
          </svg>

          <!-- Center hub -->
          <div class="wheel-hub">
            <div class="wheel-hub-inner"></div>
          </div>
        </div>

        <!-- Pointer -->
        <div v-if="candidates.length >= 2" class="wheel-pointer">
          <svg viewBox="0 0 22 28" fill="none" class="pointer-svg">
            <path d="M11 28 L2 9 C0.5 5, 4 1.5, 11 1.5 C18 1.5, 21.5 5, 20 9 Z"
                  fill="url(#pGrad)" stroke="white" stroke-width="1.2"/>
            <defs>
              <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#7A2D45"/>
                <stop offset="100%" stop-color="#C45B6E"/>
              </linearGradient>
            </defs>
          </svg>
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
        <!-- Shimmer layer -->
        <div class="spin-btn-shimmer"></div>
        <!-- Ripple on active -->
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

    <!-- ── Checklist header ── -->
    <div class="check-header">
      <div class="check-header-line"></div>
      <span class="check-header-text">Chọn quán ăn</span>
      <div class="check-header-line"></div>
    </div>

    <!-- ── Checklist ── -->
    <div class="checklist">
      <label
        v-for="(place, idx) in store.restaurants"
        :key="place.id"
        class="check-item"
        :class="{ checked: selectedIds.includes(place.id) }"
      >
        <input type="checkbox" :value="place.id" v-model="selectedIds" class="hidden-check"/>

        <!-- Checkbox ring -->
        <div class="check-ring" :class="{ on: selectedIds.includes(place.id) }">
          <svg v-if="selectedIds.includes(place.id)"
               width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <!-- Icon -->
        <div class="check-icon" :style="iconGrad(idx)">
          {{ emoji(place.name) }}
        </div>

        <!-- Info -->
        <div class="check-info">
          <p class="check-name" :class="{ active: selectedIds.includes(place.id) }">
            {{ place.name }}
          </p>
          <p v-if="place.price" class="check-price" :class="{ active: selectedIds.includes(place.id) }">
            {{ place.price }}
          </p>
        </div>
      </label>
    </div>

    <!-- ══════════════════════════════════════
         WINNER MODAL
    ══════════════════════════════════════ -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="winner"
          class="modal-overlay"
          @click.self="winner = null"
        >
          <transition name="modal-card">
            <div v-if="winner" class="winner-card">
              <!-- Rainbow band -->
              <div class="winner-band"></div>

              <div class="winner-body">
                <!-- BG blobs -->
                <div class="winner-blob-1"></div>
                <div class="winner-blob-2"></div>

                <div class="winner-content">
                  <!-- Celebration -->
                  <div class="winner-celebrate">
                    <div class="winner-emoji-ring">
                      <div class="winner-ripple"></div>
                      <span class="winner-emoji">🎉</span>
                    </div>
                    <div class="winner-stars">✦ ✦ ✦</div>
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

                  <div v-if="winner.price" class="winner-price">
                    💰 {{ winner.price }}
                  </div>

                  <div class="winner-btns">
                    <button class="btn-close" @click="winner = null">Quay lại</button>
                    <a v-if="winner.linkmap" :href="winner.linkmap" target="_blank" class="btn-map">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
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

// ─── Wheel geometry ──────────────────────────────
const segPath = (i: number, n: number, r: number) => {
  const a = (2 * Math.PI) / n
  const s = i * a - Math.PI / 2
  const e = s + a
  const x1 = r * Math.cos(s), y1 = r * Math.sin(s)
  const x2 = r * Math.cos(e), y2 = r * Math.sin(e)
  return `M0,0 L${x1},${y1} A${r},${r} 0 ${a > Math.PI ? 1 : 0},1 ${x2},${y2} Z`
}
const labelTransform = (i: number, n: number) => {
  const a = (2 * Math.PI) / n
  const m = i * a + a / 2 - Math.PI / 2
  const d = n > 6 ? 82 : 94
  const x = d * Math.cos(m), y = d * Math.sin(m)
  return `translate(${x},${y}) rotate(${(m * 180) / Math.PI + 90})`
}

const FILLS = [
  'rgba(245,196,207,0.92)', 'rgba(240,222,184,0.92)', 'rgba(234,230,240,0.92)',
  'rgba(232,137,154,0.68)', 'rgba(201,169,110,0.55)', 'rgba(253,232,237,0.92)',
  'rgba(210,200,230,0.78)', 'rgba(248,218,190,0.88)',
]
const TEXTS = [
  '#5A1F30', '#6B4A20', '#4A3860', '#7A2030',
  '#6B4A20', '#7A2D45', '#5A3870', '#7A4A20',
]
const segFill = (i: number) => FILLS[i % FILLS.length]
const segText = (i: number) => TEXTS[i % TEXTS.length]
const shorten = (s: string, n: number) => s.length > n ? s.slice(0, n) + '…' : s

// ─── Spin ────────────────────────────────────────
const spin = () => {
  if (isSpinning.value || candidates.value.length < 2) return
  isSpinning.value = true
  winner.value = null

  const n = candidates.value.length
  const wi = Math.floor(Math.random() * n)
  const slice = 360 / n
  const extra = 7 * 360
  const target = extra + 360 - wi * slice - slice / 2 + (Math.random() - 0.5) * slice * 0.55
  rotation.value += target

  setTimeout(() => {
    isSpinning.value = false
    winner.value = candidates.value[wi]
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.45 },
      colors: ['#F5C4CF', '#E8899A', '#C9A96E', '#7A2D45', '#FDE8ED', '#ffffff'],
      disableForReducedMotion: true,
    })
  }, 5300)
}

// ─── Helpers ─────────────────────────────────────
const ICON_GRADS = [
  'background: linear-gradient(135deg, #FDE8ED, #F5C4CF);',
  'background: linear-gradient(135deg, #F0DEB8, #FDE8ED);',
  'background: linear-gradient(135deg, #EAE6F0, #FDE8ED);',
  'background: linear-gradient(135deg, #F5C4CF, rgba(232,137,154,0.4));',
  'background: linear-gradient(135deg, #F0DEB8, rgba(201,169,110,0.35));',
]
const iconGrad = (i: number) => ICON_GRADS[i % ICON_GRADS.length]

const emoji = (name: string): string => {
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
.roulette-eyebrow {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--gold); opacity: 0.8; margin-bottom: 8px;
}
.roulette-title {
  font-family: var(--font-display);
  font-size: 30px; font-weight: 400;
  color: var(--berry-dark);
  line-height: 1.3; margin-bottom: 8px;
}
.roulette-title em { font-weight: 600; font-style: italic; color: var(--berry); }
.roulette-clover { display: inline-block; margin-left: 6px; }
.roulette-hint {
  font-size: 12.5px;
  color: rgba(160,145,130,0.75);
  line-height: 1.5;
}

/* ── Wheel Zone ── */
.wheel-zone {
  position: relative;
  width: 290px; height: 290px;
  margin: 0 auto 28px;
}
.wheel-glow-ring {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(245,196,207,0.5),
    rgba(201,169,110,0.5),
    rgba(232,137,154,0.5),
    rgba(240,222,184,0.4),
    rgba(245,196,207,0.5)
  );
  filter: blur(16px);
  opacity: 0;
  transition: opacity 0.8s ease;
  animation: rotateSlow 8s linear infinite;
}
.wheel-glow-ring.spinning { opacity: 1; }

.wheel-container {
  position: absolute;
  inset: 0;
}

.wheel-empty {
  position: absolute; inset: 0;
  border-radius: 50%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  border: 2.5px dashed rgba(201,169,110,0.42);
  background: rgba(250,247,242,0.55);
  text-align: center; padding: 24px;
}
.wheel-empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.45; }
.wheel-empty p {
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 15px;
  color: rgba(160,145,130,0.75);
  line-height: 1.6;
}

.wheel-svg-wrap {
  position: absolute; inset: 0;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 10px 50px rgba(90,31,48,0.28),
    inset 0 0 0 5px rgba(255,255,255,0.55),
    inset 0 0 0 6px rgba(201,169,110,0.15);
}

.wheel-hub {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 48px; height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 5px 20px rgba(90,31,48,0.22), inset 0 1px 0 rgba(255,255,255,0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
}
.wheel-hub-inner {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7A2D45, #C45B6E);
  box-shadow: 0 2px 8px rgba(122,45,69,0.5);
}

.wheel-label { user-select: none; pointer-events: none; }

.wheel-pointer {
  position: absolute;
  top: -12px; left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.22));
}
.pointer-svg { width: 22px; height: 28px; }

/* ── Spin Button ── */
.spin-btn-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.spin-btn {
  position: relative;
  padding: 16px 36px;
  border-radius: 22px;
  border: none;
  color: white;
  font-family: var(--font-body);
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, #7A2D45 0%, #C45B6E 55%, #E8899A 100%);
  box-shadow: var(--shadow-btn);
  overflow: hidden;
  transition: transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1), box-shadow 0.2s ease;
}
.spin-btn:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 48px rgba(122,45,69,0.52);
}
.spin-btn:not(:disabled):active { transform: scale(0.96); }
.spin-btn:disabled { opacity: 0.72; cursor: not-allowed; }

.spin-btn-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
  background-size: 200% auto;
  animation: shimmerText 2s linear infinite;
  pointer-events: none;
}
.spin-ripple {
  position: absolute;
  top: 50%; left: 50%;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transform: translate(-50%, -50%);
  animation: ripple 1.2s ease-out infinite;
  pointer-events: none;
}
.spin-icon { font-size: 20px; }
.spin-anim { animation: rotateSlow 0.6s linear infinite; }
.spin-text { position: relative; }

.spin-hint {
  text-align: center;
  font-family: var(--font-accent);
  font-style: italic;
  font-size: 14.5px;
  color: rgba(160,145,130,0.7);
  padding: 12px;
}

/* ── Selected count ── */
.selected-count {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px; padding: 0 2px;
}
.selected-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent);
}
.selected-badge {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  color: var(--gold); opacity: 0.85; white-space: nowrap;
}
.sel-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--rose);
  animation: pulseGlow 2s ease-in-out infinite;
}

/* ── Check header ── */
.check-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px; padding: 0 2px;
}
.check-header-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent);
}
.check-header-text {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: rgba(160,145,130,0.7); white-space: nowrap;
}

/* ── Checklist ── */
.checklist { display: flex; flex-direction: column; gap: 9px; }
.check-item {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 2px 8px rgba(90,31,48,0.04);
}
.check-item.checked {
  background: rgba(245,196,207,0.38);
  border-color: rgba(122,45,69,0.2);
  box-shadow: 0 6px 24px rgba(122,45,69,0.1);
  transform: scale(1.012);
}
.check-item:active { transform: scale(0.975); }

.check-ring {
  width: 26px; height: 26px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: rgba(0,0,0,0.06);
  border: 1.5px solid rgba(122,45,69,0.22);
  transition: all 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.check-ring.on {
  background: linear-gradient(135deg, #7A2D45, #C45B6E);
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(122,45,69,0.44);
  transform: scale(1.08);
}

.check-icon {
  width: 38px; height: 38px;
  border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(90,31,48,0.08);
}
.check-info { flex: 1; min-width: 0; }
.check-name {
  font-family: var(--font-display);
  font-size: 15px; font-weight: 600;
  color: rgba(120,100,100,0.85);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color 0.25s;
}
.check-name.active { color: var(--berry-dark); }
.check-price {
  font-size: 11px; margin-top: 2px;
  color: rgba(190,165,150,0.8);
  transition: color 0.25s;
}
.check-price.active { color: var(--rose-deep); opacity: 0.85; }

/* ══ WINNER MODAL ══ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 70;
  display: flex; align-items: flex-end; justify-content: center;
  padding: 0 16px 28px;
  background: rgba(61,26,38,0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.winner-card {
  width: 100%; max-width: 400px;
  border-radius: 36px;
  overflow: hidden;
  background: #FAF7F2;
  box-shadow: var(--shadow-float);
}
.winner-band {
  height: 4px;
  background: linear-gradient(90deg, #7A2D45, #C45B6E, #E8899A, #C9A96E, #E8899A, #C45B6E, #7A2D45);
  background-size: 200% auto;
  animation: borderShimmer 5s linear infinite;
}
.winner-body {
  padding: 28px 28px 32px;
  position: relative;
  overflow: hidden;
}
.winner-blob-1 {
  position: absolute; top: -50px; right: -50px;
  width: 160px; height: 160px; border-radius: 50%;
  background: radial-gradient(circle, rgba(245,196,207,0.75), transparent);
  filter: blur(24px); pointer-events: none;
}
.winner-blob-2 {
  position: absolute; bottom: -30px; left: -30px;
  width: 130px; height: 130px; border-radius: 50%;
  background: radial-gradient(circle, rgba(201,169,110,0.55), transparent);
  filter: blur(20px); pointer-events: none;
}
.winner-content { position: relative; text-align: center; }

.winner-celebrate { margin-bottom: 18px; }
.winner-emoji-ring {
  width: 82px; height: 82px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(245,196,207,0.65), rgba(201,169,110,0.35));
  box-shadow: 0 10px 36px rgba(122,45,69,0.22);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 8px;
  position: relative;
}
.winner-ripple {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(232,137,154,0.25);
  animation: ripple 2s ease-out infinite;
}
.winner-emoji { font-size: 38px; position: relative; z-index: 1; }
.winner-stars {
  font-size: 10px;
  color: var(--gold);
  letter-spacing: 8px;
  opacity: 0.6;
}

.winner-eyebrow {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--gold); opacity: 0.82; margin-bottom: 8px;
}
.winner-name {
  font-family: var(--font-display);
  font-size: 28px; font-weight: 600;
  color: var(--berry-dark); line-height: 1.2;
  margin-bottom: 7px;
}
.winner-addr {
  font-size: 12px; color: rgba(160,145,130,0.8);
  display: flex; align-items: center; justify-content: center; gap: 5px;
  margin-bottom: 18px;
}
.winner-divider {
  height: 1px; margin-bottom: 16px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.55), rgba(232,137,154,0.4), rgba(201,169,110,0.55), transparent);
}
.winner-price {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 100px;
  background: linear-gradient(135deg, rgba(201,169,110,0.2), rgba(245,196,207,0.3));
  border: 1px solid rgba(201,169,110,0.32);
  font-size: 13.5px; font-weight: 600; color: var(--berry);
  margin-bottom: 20px;
}
.winner-btns { display: flex; gap: 10px; }
.btn-close {
  flex: 1; padding: 15px;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(0,0,0,0.05);
  font-family: var(--font-body);
  font-size: 13.5px; font-weight: 600;
  color: rgba(100,85,85,0.8); cursor: pointer;
  transition: all 0.2s;
}
.btn-close:hover { background: rgba(0,0,0,0.09); }
.btn-close:active { transform: scale(0.96); }
.btn-map {
  flex: 2; padding: 15px;
  border-radius: 18px; border: none;
  background: linear-gradient(135deg, #7A2D45 0%, #C45B6E 55%, #E8899A 100%);
  box-shadow: var(--shadow-btn);
  font-family: var(--font-body);
  font-size: 13.5px; font-weight: 700; color: white;
  text-decoration: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.25s;
}
.btn-map:hover { transform: translateY(-2px); box-shadow: 0 16px 44px rgba(122,45,69,0.52); }
.btn-map:active { transform: scale(0.97); }
</style>