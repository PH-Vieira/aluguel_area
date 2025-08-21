<template>
    <nav class="fixed top-0 left-0 w-full bg-white z-50 shadow px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-semibold">AlugaJá</h1>
        <button @click="open = !open">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>