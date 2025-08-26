<template>
    <div class="pt-16 px-4 max-w-4xl mx-auto">
        <router-link to="/my-spaces" class="text-blue-600 underline block mb-4">← Voltar</router-link>
        <h2 class="text-2xl font-bold mb-6">Agenda da Área</h2>
        <div v-if="loading" class="text-center py-8">Carregando...</div>
        <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>
        <div v-else-if="space">
            <h3 class="font-semibold text-lg mb-2">{{ space.name }}</h3>
            <Calendar :bookedDates="getBookedDates(space.id)" />
        </div>
        <div v-else class="text-center py-8">Área não encontrada.</div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'
import Calendar from '@/components/Calendar.vue'

const route = useRoute()
const spaceId = Number(route.query.spaceId)
const space = ref(null)
const bookings = ref([])
const loading = ref(true)
const error = ref('')

async function fetchSpaceAndBookings() {
    loading.value = true
    error.value = ''
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    // Busca área específica do usuário
    const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select('id, name')
        .eq('id', spaceId)
        .single()

    if (spaceError) {
        error.value = spaceError.message
        loading.value = false
        return
    }
    space.value = spaceData

    // Busca agendamentos da área
    if (space.value) {
        const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('space_id, date')
            .eq('space_id', String(spaceId))

        if (bookingsError) {
            error.value = bookingsError.message
        } else {
            bookings.value = bookingsData || []
        }
    }
    loading.value = false
}

// Retorna array de datas agendadas para a área
function getBookedDates(spaceId) {
    const result = bookings.value
        .filter(b => b.space_id === spaceId)
        .map(b => {
            let d = b.date
            if (typeof d === 'string' && d.includes('T')) d = d.split('T')[0]
            return d
        })
    return result
}

onMounted(() => {
    if (spaceId) {
        fetchSpaceAndBookings()
    } else {
        loading.value = false
        error.value = 'ID da área não informado.'
    }
})
</script>