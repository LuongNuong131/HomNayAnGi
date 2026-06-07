<template>
  <div class="app-shell">

    <!-- ── Ambient atmosphere ── -->
    <div class="ambient" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
      <!-- Grain overlay -->
      <div class="grain"></div>
    </div>

    <!-- ── Header ── -->
    <header class="header">
      <!-- Decorative top border -->
      <div class="header-border-top"></div>

      <!-- Eyebrow -->
      <div class="eyebrow">
        <div class="eyebrow-line"></div>
        <div class="eyebrow-diamond">◆</div>
        <span class="eyebrow-text">Nhật Ký Ẩm Thực</span>
        <div class="eyebrow-diamond">◆</div>
        <div class="eyebrow-line"></div>
      </div>

      <!-- Brand -->
      <div class="brand">
        <h1 class="brand-title shimmer-text">LuNu</h1>
        <p class="brand-sub">
          <span class="amp">&</span>
          <span class="sub-name">Bé Yêu</span>
          <span class="float-icon" style="animation: floatSlow 5s ease-in-out infinite;">🌸</span>
        </p>
      </div>

      <!-- Bottom border -->
      <div class="gold-line" style="margin-top: 18px;"></div>
    </header>

    <!-- ── Main ── -->
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100svh;
  max-width: 430px;
  margin: 0 auto;
  background: #FAF7F2;
  box-shadow: 0 0 120px rgba(90,31,48,0.18);
  overflow: hidden;
}

/* ── Ambient ── */
.ambient {
  position: fixed;
  inset: 0;
  max-width: 430px;
  margin: 0 auto;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  pointer-events: none;
}
.blob-1 {
  width: 260px; height: 260px;
  top: -80px; right: -60px;
  background: radial-gradient(circle, rgba(245,196,207,0.6) 0%, transparent 70%);
  animation: floatSlow 8s ease-in-out infinite;
}
.blob-2 {
  width: 200px; height: 200px;
  top: 40%; left: -70px;
  background: radial-gradient(circle, rgba(201,169,110,0.38) 0%, transparent 70%);
  animation: floatReverse 11s ease-in-out infinite;
}
.blob-3 {
  width: 240px; height: 240px;
  bottom: 120px; right: -40px;
  background: radial-gradient(circle, rgba(232,137,154,0.32) 0%, transparent 70%);
  animation: floatSlow 9s ease-in-out infinite 2s;
}
.blob-4 {
  width: 180px; height: 180px;
  bottom: 0; left: 20%;
  background: radial-gradient(circle, rgba(240,222,184,0.3) 0%, transparent 70%);
  animation: floatReverse 13s ease-in-out infinite 1s;
}
.grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.5;
}

/* ── Header ── */
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 52px 24px 18px;
  background: linear-gradient(
    180deg,
    rgba(250,247,242,0.96) 0%,
    rgba(250,247,242,0.82) 80%,
    rgba(250,247,242,0.0) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
.header-border-top {
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #7A2D45, #C45B6E, #E8899A, #C9A96E, #E8899A, #C45B6E, #7A2D45);
  background-size: 200% auto;
  animation: borderShimmer 6s linear infinite;
}

/* ── Eyebrow ── */
.eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}
.eyebrow-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.55));
  max-width: 50px;
}
.eyebrow-line:last-child {
  background: linear-gradient(90deg, rgba(201,169,110,0.55), transparent);
}
.eyebrow-diamond {
  font-size: 6px;
  color: rgba(201,169,110,0.6);
  letter-spacing: 0;
}
.eyebrow-text {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
}

/* ── Brand ── */
.brand { text-align: center; }
.brand-title {
  font-family: var(--font-display);
  font-size: 46px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
}
.brand-sub {
  font-family: var(--font-accent);
  font-size: 19px;
  font-style: italic;
  color: var(--rose);
  opacity: 0.88;
  margin-top: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.amp {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 300;
  color: var(--gold);
  font-size: 22px;
}
.sub-name { letter-spacing: 0.04em; }
.float-icon { display: inline-block; }

/* ── Content ── */
.main-content {
  position: relative;
  z-index: 1;
}
</style>