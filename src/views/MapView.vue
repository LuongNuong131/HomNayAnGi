<template>
  <main class="h-screen w-full relative">
    <div id="map" class="w-full h-full"></div>
    
    <!-- Lớp phủ cho tiêu đề -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg z-10 border border-soft-pink">
      <h2 class="font-serif text-warm-purple font-bold">Bản Đồ Tình Yêu 🗺️</h2>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { useRestaurantStore } from '../stores/restaurant';

const store = useRestaurantStore();

onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  });

  const { Map } = await loader.importLibrary("maps");
  const { Marker } = await loader.importLibrary("marker");

  const map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 10.762622, lng: 106.660172 }, // Tọa độ trung tâm HCM
    zoom: 13,
    disableDefaultUI: true,
    styles: [
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }, { lightness: 17 }] },
      { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }, { lightness: 20 }] },
      { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }, { lightness: 17 }] },
    ]
  });

  // Render Markers
  store.restaurants.forEach(place => {
    new Marker({
      position: { lat: place.lat, lng: place.lng },
      map: map,
      title: place.name,
      icon: place.visited 
        ? 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' // Đã đi
        : 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png' // Chưa đi
    });
  });
});
</script>