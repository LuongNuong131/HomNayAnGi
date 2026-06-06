import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Restaurant } from '../types';
import restaurantsData from '../assets/restaurants.json';

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>(restaurantsData as Restaurant[]);

  const visitedRestaurants = computed(() => 
    restaurants.value.filter(r => r.visited).sort((a, b) => 
      new Date(b.dateVisited || '').getTime() - new Date(a.dateVisited || '').getTime()
    )
  );

  const bucketList = computed(() => 
    restaurants.value.filter(r => !r.visited)
  );

  const getRandomRestaurant = () => {
    const randomIndex = Math.floor(Math.random() * restaurants.value.length);
    return restaurants.value[randomIndex];
  };

  return { restaurants, visitedRestaurants, bucketList, getRandomRestaurant };
});