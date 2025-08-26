<template>
    <div class="pt-16 px-4 space-y-4">
        <h2 class="text-xl font-bold mb-2">Encontre um espaço</h2>
        <div v-if="store.loading" class="text-center py-8">Carregando...</div>
        <div v-else-if="store.error" class="text-red-500 text-center py-8">{{ store.error }}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SpaceCard
                v-for="space in store.spaces"
                :key="space.id"
                :id="space.id"
                :name="space.name"
                :img="space.img || ''"
                :price="space.price"
            />
        </div>
    </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue'
import SpaceCard from '../components/SpaceCard.vue'
import { useSpacesStore } from '@/stores/spaces'

const store = useSpacesStore()
onMounted(() => {
    store.fetchSpaces()
})
</script>