<template>
  <div class="min-h-screen bg-background pb-32">
    <header class="sticky top-0 z-30 glass-panel border-b border-black/5 dark:border-white/5 p-4 md:px-8">
      <div class="max-w-7xl mx-auto flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/">
              <button class="p-2 rounded-full hover:bg-accent transition-colors">
                <ArrowLeft class="w-5 h-5 text-foreground" />
              </button>
            </router-link>
            <h1 class="font-bold text-2xl text-foreground">Bộ Sưu Tập Quán</h1>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Tìm tên quán, địa chỉ..."
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-accent border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none text-foreground placeholder:text-foreground/40"
            />
          </div>
          <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <select v-model="selectedCategory" class="px-4 py-3 rounded-xl bg-accent text-sm font-medium outline-none text-foreground min-w-[120px]">
              <option value="All">Tất cả danh mục</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <button 
              @click="showUnvisitedOnly = !showUnvisitedOnly"
              :class="['px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2', showUnvisitedOnly ? 'bg-primary text-white' : 'bg-accent text-foreground']"
            >
              <MapPin class="w-4 h-4" />
              Chưa đi
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-4 md:p-8">
      <div v-if="store.isLoading" class="flex flex-col items-center justify-center py-20 text-foreground/50">
        <Loader2 class="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Đang tải dữ liệu từ Google Sheets...</p>
      </div>

      <div v-else-if="filteredRestaurants.length === 0" class="text-center py-20 text-foreground/50">
        <p class="text-lg">Không tìm thấy quán ăn nào phù hợp.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="restaurant in filteredRestaurants" 
          :key="restaurant.id"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
          :class="['glass-panel rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 border-2', isSelected(restaurant.id) ? 'border-primary shadow-primary/20' : 'border-transparent hover:-translate-y-1']"
          @click="toggleSelection(restaurant.id)"
        >
          <div class="h-32 bg-accent relative flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <span class="text-4xl group-hover:scale-110 transition-transform duration-300">
              {{ getIcon(restaurant.category) }}
            </span>
            <div class="absolute top-2 right-2 flex gap-1">
              <span v-if="!restaurant.visited" class="px-2 py-1 bg-white/90 text-red-500 text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wider">
                Chưa đi
              </span>
              <span class="px-2 py-1 bg-white/90 text-yellow-500 flex items-center gap-1 text-[10px] font-bold rounded-md shadow-sm">
                <Star class="w-3 h-3 fill-current" /> {{ restaurant.rating || '4.5' }}
              </span>
            </div>
            <div v-if="isSelected(restaurant.id)" class="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[1px]">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                <Check class="w-6 h-6" />
              </div>
            </div>
          </div>

          <div class="p-5 flex flex-col h-[calc(100%-8rem)]">
            <h3 class="font-bold text-lg leading-tight mb-2 text-foreground line-clamp-1">{{ restaurant.name }}</h3>
            <p class="text-foreground/60 text-sm mb-4 line-clamp-2 flex-1">{{ restaurant.address }}</p>
            
            <div class="flex items-center justify-between mt-auto">
              <span class="text-xs font-semibold px-2.5 py-1 bg-accent rounded-md text-foreground/70">
                {{ restaurant.category }}
              </span>
              <span class="text-sm font-bold text-primary">
                {{ restaurant.priceRange || 'Đang cập nhật' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
        <div class="glass-panel rounded-full p-2 pl-6 flex items-center justify-between shadow-premium bg-foreground text-background">
          <span class="font-bold text-sm">Đã chọn {{ selectedIds.length }} quán</span>
          <button @click="goToRoulette" class="px-6 py-3 bg-primary text-white rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
            <Dices class="w-4 h-4" />
            Ném vào Vòng Quay
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { ArrowLeft, Search, MapPin, Star, Check, Dices, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const store = useRestaurantStore()

const searchQuery = ref('')
const selectedCategory = ref('All')
const showUnvisitedOnly = ref(false)

const selectedIds = ref<string[]>([])

// Load data if not already loaded
onMounted(() => {
  if (store.restaurants.length === 0) {
    store.fetchRestaurants()
  }
})

// Lấy danh sách Categories độc nhất từ data
const uniqueCategories = computed(() => {
  const cats = new Set(store.restaurants.map(r => r.category).filter(Boolean))
  return Array.from(cats)
})

// Logic bộ lọc thủ công
const filteredRestaurants = computed(() => {
  return store.restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        r.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat = selectedCategory.value === 'All' || r.category === selectedCategory.value
    const matchVisited = !showUnvisitedOnly.value || r.visited === false
    
    return matchSearch && matchCat && matchVisited
  })
})

const getIcon = (category: string) => {
  if (!category) return '🍜'
  const lowerCat = category.toLowerCase()
  if (lowerCat.includes('ăn vặt')) return '🍟'
  if (lowerCat.includes('hải sản')) return '🦞'
  if (lowerCat.includes('nước') || lowerCat.includes('coffee')) return '🧋'
  if (lowerCat.includes('buffet')) return '🥩'
  return '🍜'
}

const toggleSelection = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const isSelected = (id: string) => selectedIds.value.includes(id)

const goToRoulette = () => {
  // Pass selected IDs via query string to Roulette page
  router.push({ path: '/roulette', query: { ids: selectedIds.value.join(',') } })
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>