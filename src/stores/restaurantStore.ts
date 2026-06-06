import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Restaurant } from '@/types'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const unvisitedRestaurants = computed(() => 
    restaurants.value.filter(r => !r.visited)
  )

  const recommendedRestaurants = computed(() => 
    restaurants.value.filter(r => r.recommended)
  )

  async function fetchRestaurants() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('/api/restaurants')
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      restaurants.value = data
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi tải dữ liệu'
    } finally {
      isLoading.value = false
    }
  }

  return {
    restaurants,
    isLoading,
    error,
    unvisitedRestaurants,
    recommendedRestaurants,
    fetchRestaurants
  }
})