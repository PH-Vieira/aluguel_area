<template>
    <div class="pt-16 pb-24 px-4">
        <router-link to="/" class="text-blue-600 underline block mb-4">← Voltar</router-link>

        <img :src="space?.img" alt="" class="w-full h-48 object-cover rounded-md mb-4" />

        <h2 class="text-2xl font-bold mb-2">{{ space?.name }}</h2>
        <p class="text-gray-600 mb-6">
            Aqui vai uma descrição do espaço. Pode incluir horários de uso, regras, capacidade, etc.
        </p>
    </div>

    <!-- Botão fixo -->
    <div class="fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50">
        <router-link :to="`/espaco/${space?.id}/agendar`"
            class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg block text-center">
            Agendar
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSpacesStore } from '@/stores/spaces'
import type { Space } from '@/types/space'

const store = useSpacesStore()
const route = useRoute()
const space = store.spaces.find((s: Space) => s.id === Number(route.params.id))
</script>