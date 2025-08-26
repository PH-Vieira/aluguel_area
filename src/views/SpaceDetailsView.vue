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
    <ReviewForm :spaceId="space.id" />
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
import { computed, onMounted } from 'vue'

const store = useSpacesStore()
const route = useRoute()

onMounted(() => {
  if (!store.spaces.length) {
    store.fetchSpaces()
  }
})

const space = computed(() =>
  store.spaces.find((s) => s.id === Number(route.params.id))
)
</script>