<template>
    <div class="pt-16 px-4 space-y-4">
        <h2 class="text-xl font-bold mb-2">Encontre um espaço</h2>
        <SpaceCard v-for="space in store.spaces" :key="space.id" :id="space.id" :name="space.name" :img="space.img" />
    </div>
</template>

<script setup lang="ts">
import SpaceCard from '../components/SpaceCard.vue'
import { useSpacesStore } from '@/stores/spaces'

const store = useSpacesStore()
</script>