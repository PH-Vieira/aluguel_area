<template>
    <div class="pt-16 px-4 space-y-4">
        <h2 class="text-xl font-bold">Agendar: {{ space?.name }}</h2>

        <input v-model="date" type="date" class="w-full border px-3 py-2 rounded" />
        <input v-model="time" type="time" class="w-full border px-3 py-2 rounded" />

        <button @click="confirmBooking" class="w-full bg-blue-600 text-white py-3 rounded">
            Confirmar agendamento
        </button>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { useSpacesStore } from '@/stores/spaces'
import { ref } from 'vue'
import type { Space } from '@/types/space'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingsStore()
const spacesStore = useSpacesStore()

const space = spacesStore.spaces.find((s: Space) => s.id === Number(route.params.id))

const date = ref('')
const time = ref('')

function confirmBooking() {
    if (!date.value || !time.value) return
    if (!space || !date.value || !time.value) return

    bookingStore.bookings.push({
        spaceId: space?.id,
        spaceName: space?.name,
        date: date.value,
        time: time.value,
    })

    router.push('/')
}
</script>
