<template>
    <div class="bg-white rounded-lg shadow p-4">
        <img :src="img" alt="Espaço" class="w-full h-40 object-cover rounded-md mb-2" />
        <h3 class="text-lg font-semibold">{{ name }}</h3>
        <router-link :to="`/espaco/${id}`" class="mt-2 text-blue-600 underline block">
            Ver detalhes
        </router-link>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    id: number
    name: string
    img: string
}>()
</script>