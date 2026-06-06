import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Restaurant } from '../types';
import restaurantsData from '../assets/restaurants.json';

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>(restaurantsData as Restaurant[]);
  return { restaurants };
});