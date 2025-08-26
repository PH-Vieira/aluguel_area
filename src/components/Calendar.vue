<template>
    <div class="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto">
        <div class="flex justify-between items-center mb-4">
            <button @click="prevMonth" class="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
            <span class="font-semibold text-lg">{{ monthName }} {{ currentYear }}</span>
            <button @click="nextMonth" class="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-1">
            <span v-for="d in daysShort" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
            <span v-for="n in firstDayOfMonth" :key="'empty-' + n"></span>
            <button v-for="day in daysInMonth" :key="day" :class="[
                'py-2 rounded',
                isBooked(day) ? 'bg-red-500 text-white font-bold' : 'bg-gray-100',
                isToday(day) ? 'border border-blue-500' : ''
            ]" disabled>
                {{ day }}
            </button>
        </div>
        <div class="mt-4 text-xs text-gray-500">
            <span class="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span> Dia agendado
            <span class="inline-block w-3 h-3 bg-gray-100 border ml-4 mr-1"></span> Livre
            <span class="inline-block w-3 h-3 border border-blue-500 ml-4 mr-1"></span> Hoje
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    bookedDates: {
        type: Array,
        default: () => []
    }
})

const today = new Date()
// Inicializa o mês e ano com o mês e ano atuais
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const daysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const monthName = computed(() =>
    new Date(currentYear.value, currentMonth.value).toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() +
    new Date(currentYear.value, currentMonth.value).toLocaleString('pt-BR', { month: 'long' }).slice(1)
)

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

function isBooked(day) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return props.bookedDates.includes(dateStr)
}

function isToday(day) {
    return (
        day === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()
    )
}

function prevMonth() {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
}

function nextMonth() {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
}
</script>

<style scoped>
/* Adicione estilos personalizados, se necessário */
</style>
