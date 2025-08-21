<template>
    <div class="pt-16 px-4">
        <h2 class="text-xl font-bold mb-4">Meus Agendamentos</h2>

        <div v-if="store.bookings.length === 0" class="text-gray-500">
            Nenhum agendamento encontrado.
        </div>

        <ul v-else class="space-y-4">
            <li v-for="(b, i) in store.bookings" :key="i" class="border rounded p-3 shadow-sm">
                <p class="font-semibold">{{ b.spaceName }}</p>
                <p class="text-sm text-gray-600">Dia {{ b.date }} às {{ b.time }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useBookingsStore } from '@/stores/bookings'

const store = useBookingsStore()
</script>
