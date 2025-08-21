<template>
    <nav class="fixed top-0 left-0 w-full bg-white z-50 shadow px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-semibold">
            <router-link to="/">AlugaJá</router-link>
        </h1>

        <button @click="open = !open">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <transition name="fade">
            <div v-if="open" class="absolute right-4 top-14 bg-white border rounded shadow p-2 space-y-2 z-50">
                <router-link to="/" class="block text-sm" @click="open = false">Início</router-link>
                <router-link to="/meus-agendamentos" class="block text-sm" @click="open = false">Meus
                    Agendamentos</router-link>
            </div>
        </transition>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}
</style>