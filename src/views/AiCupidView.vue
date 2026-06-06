<template>
  <main class="p-6 flex flex-col h-full">
    <div class="text-center mb-6">
      <h2 class="font-serif text-2xl text-warm-purple">AI Cupid 💘</h2>
      <p class="text-sm text-gray-500">Trung Tình sẽ giúp hai bạn chọn món nhé!</p>
    </div>

    <!-- Khung Chat -->
    <div class="flex-1 bg-white rounded-3xl p-4 shadow-sm border border-soft-pink/30 mb-4 h-96 overflow-y-auto flex flex-col gap-4">
      <div v-for="(msg, i) in messages" :key="i" class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-[80%] rounded-2xl p-3 text-sm" 
             :class="msg.role === 'user' ? 'bg-pastel-rose text-white rounded-tr-sm' : 'bg-soft-pink/20 text-gray-800 rounded-tl-sm border border-soft-pink'">
          {{ msg.text }}
        </div>
      </div>
      <div v-if="isLoading" class="text-xs text-warm-purple flex items-center gap-1">
        <span class="animate-bounce">●</span><span class="animate-bounce" style="animation-delay: 0.1s">●</span><span class="animate-bounce" style="animation-delay: 0.2s">●</span>
        đang suy nghĩ...
      </div>
    </div>

    <!-- Input Box -->
    <div class="flex gap-2 mb-16">
      <input v-model="userInput" @keyup.enter="sendMessage" type="text" placeholder="Hôm nay mưa, muốn ăn gì đó ấm bụng..." class="flex-1 bg-white border border-soft-pink rounded-full px-4 py-3 outline-none focus:border-warm-purple text-sm" />
      <button @click="sendMessage" :disabled="isLoading || !userInput" class="bg-warm-purple text-white p-3 rounded-full disabled:opacity-50">
        <SendIcon class="w-5 h-5" />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SendIcon } from 'lucide-vue-next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useRestaurantStore } from '../stores/restaurant';

const store = useRestaurantStore();
const userInput = ref('');
const isLoading = ref(false);
const messages = ref<{role: 'user' | 'ai', text: string}[]>([
  { role: 'ai', text: 'Chào LuNu và Bé Yêu! Hôm nay thời tiết thế nào, hai bạn thèm vị gì hay có ngân sách bao nhiêu không? Cứ nói để AI Cupid tìm quán trong danh sách nhé!' }
]);

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const sendMessage = async () => {
  if (!userInput.value) return;
  
  const text = userInput.value;
  messages.value.push({ role: 'user', text });
  userInput.value = '';
  isLoading.value = true;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // Ép Gemini dựa vào database của mình
    const context = `Bạn là trợ lý tình yêu của cặp đôi tên LuNu và người yêu. Danh sách quán ăn của họ có: ${JSON.stringify(store.restaurants.map(r=>({name: r.name, address: r.address, price: r.price, type: r.notes})))}\n. 
    Người dùng yêu cầu: "${text}". Hãy chọn 1-2 quán phù hợp nhất từ danh sách trên, giải thích lý do thật lãng mạn, xưng hô là "Trung Tình" và gọi họ là "LuNu và Bé Yêu". Không đề xuất quán ngoài danh sách. Ngắn gọn, ấm áp.`;

    const result = await model.generateContent(context);
    const response = await result.response;
    messages.value.push({ role: 'ai', text: response.text() });
  } catch (error) {
    messages.value.push({ role: 'ai', text: 'Xin lỗi cưng, Trung Tình đang gặp sự cố kết nối xíu. Hai bạn tự mở Vòng Quay ra quay tạm nha! 💔' });
  } finally {
    isLoading.value = false;
  }
};
</script>