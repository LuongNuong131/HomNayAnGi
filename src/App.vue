<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { onMounted } from 'vue'

const store = useRestaurantStore()

onMounted(() => {
  store.fetchRestaurants()
})
</script>

<template>
  <main class="min-h-screen flex flex-col font-sans">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>