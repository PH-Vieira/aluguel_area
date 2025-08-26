<template>
  <div class="pt-16 pb-24 px-4 max-w-4xl mx-auto">
    <router-link to="/" class="text-blue-600 underline block mb-4">← Voltar</router-link>

    <img
      v-if="space && space.img"
      :src="space.img"
      alt=""
      class="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-md mb-4"
    />

    <h2 v-if="space" class="text-2xl font-bold mb-2">{{ space.name }}</h2>
    <p v-if="space" class="mb-2 text-blue-700 font-semibold">R$ {{ space.price }}</p>
    <p v-if="space" class="mb-4">{{ space.description }}</p>
    <div v-else class="text-center py-8">Carregando...</div>

    <!-- Lista de avaliações -->
    <div v-if="reviews.length" class="mb-8">
      <h3 class="font-semibold mb-2 text-lg text-gray-700">Avaliações ({{ reviews.length }})</h3>
      <ul class="space-y-2">
        <li v-for="r in reviews" :key="r.id" class="border rounded p-3 bg-gray-50">
          <div class="flex items-center justify-between mb-1">
            <span class="text-yellow-500 font-bold">Nota: {{ r.rating }}/5</span>
            <span class="text-xs text-gray-500">{{ formatDate(r.created_at) }}</span>
          </div>
          <p class="text-sm text-gray-700 mb-1"><strong>{{ r.user_name || 'Usuário' }}</strong></p>
          <p class="text-sm text-gray-700">{{ r.comment }}</p>
        </li>
      </ul>
    </div>
    <div v-else class="mb-8 text-xs text-gray-400">Ainda não há avaliações.</div>

    <ReviewForm v-if="space" :spaceId="space.id" />
  </div>

  <div class="fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50">
    <router-link :to="`/espaco/${space?.id}/agendar`"
      class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg block text-center">
      Agendar
    </router-link>
  </div>
</template>

<script setup lang="js">
import { useRoute } from 'vue-router'
import { useSpacesStore } from '@/stores/spaces'
import ReviewForm from '@/components/ReviewForm.vue'
import { computed, onMounted, ref } from 'vue'
import { supabase } from '../supabase'

const store = useSpacesStore()
const route = useRoute()
const reviews = ref([])

onMounted(async () => {
  if (!store.spaces.length) {
    await store.fetchSpaces()
  }
  await fetchReviews()
})

const space = computed(() =>
  store.spaces.find((s) => s.id === Number(route.params.id))
)

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

async function fetchReviews() {
  if (!space.value) return
  // Busca reviews
  const { data: reviewsData, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id')
    .eq('space_id', space.value.id)
    .order('created_at', { ascending: false })

  if (reviewsError || !reviewsData) {
    reviews.value = []
    return
  }

  // Busca nomes dos usuários
  const userIds = [...new Set(reviewsData.map(r => r.user_id))]
  let usersMap = {}
  if (userIds.length) {
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)
    usersMap = Object.fromEntries((usersData || []).map(u => [u.id, u.full_name]))
  }
  // Junta nome do usuário ao review
  reviews.value = reviewsData.map(r => ({
    ...r,
    user_name: usersMap[r.user_id] || 'Usuário'
  }))
}
</script>

<style scoped>
/* Adicione estilos personalizados aqui, se necessário */
</style>