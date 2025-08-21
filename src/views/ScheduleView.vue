<template>
    <div class="pt-16 px-4 space-y-4">
        <h2 class="text-xl font-bold">Agendar: {{ space?.name }}</h2>

        <input v-model="date" type="date" class="w-full border px-3 py-2 rounded text-sm h-[42px]" />

        <Timepicker v-model="time" hour-label="Hora" minute-label="Minuto" format="HH:mm" :minute-interval="30" class="border border-black rounded-sm"
            :hour-range="[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]" :minute-step="30" hide-disabled-hours />

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
import Toastify from 'toastify-js'
import Timepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingsStore()
const spacesStore = useSpacesStore()

const space = spacesStore.spaces.find((s: Space) => s.id === Number(route.params.id))

const date = ref('')
const time = ref({
    HH: '06',
    mm: '00'
})

function confirmBooking() {
    if (!date.value) {
        Toastify({
            text: 'Selecione uma data',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171', // vermelho
        }).showToast()
        return
    }

    if (!time.value) {
        Toastify({
            text: 'Selecione um horário',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        return
    }

    bookingStore.bookings.push({
        spaceId: space?.id!,
        spaceName: space?.name!,
        date: date.value,
        time: time.value,
    })

    Toastify({
        text: 'Agendamento confirmado!',
        duration: 2000,
        gravity: 'top',
        position: 'center',
        backgroundColor: '#22c55e',
    }).showToast()

    setTimeout(() => {
        router.push('/')
    }, 2000)
}
</script>
