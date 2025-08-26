<template>
    <div class="pt-16 px-4 flex justify-center">
        <div class="w-full max-w-md space-y-4">
            <h2 class="text-xl font-bold text-center">Agendar: {{ space?.name }}</h2>
            <label class="block mb-2">Data do agendamento</label>
            <input
                v-model="date"
                type="date"
                class="w-full mb-4 p-2 border rounded"
                :min="minDate"
                :max="maxDate"
                :disabled="loading"
                required
                :class="{ 'bg-gray-100': loading }"
                :style="{ cursor: loading ? 'not-allowed' : 'pointer' }"
                :readonly="loading"
                :data-booked="isBooked(date)"
                @input="validateDate"
            />
            <div v-if="date && isBooked(date)" class="text-red-500 text-xs mb-2">
                Esta data já está agendada. Escolha outra.
            </div>
            <button
                @click="openModal"
                class="w-full bg-blue-600 text-white py-3 rounded"
                :disabled="loading || !date || isBooked(date) || !isFuture(date)"
            >
                Confirmar agendamento
            </button>

            <!-- Modal de confirmação -->
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                    <h3 class="text-lg font-bold mb-4">Confirmar agendamento</h3>
                    <p class="mb-4">
                        Deseja agendar <strong>{{ space?.name }}</strong> para o dia <strong>{{ formatDateBr(date) }}</strong>?
                    </p>
                    <div class="flex justify-end space-x-2">
                        <button @click="showModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
                        <button @click="confirmBooking" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Agendar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { useSpacesStore } from '@/stores/spaces'
import { ref, onMounted } from 'vue'
import Toastify from 'toastify-js'
import { supabase } from '../supabase'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingsStore()
const spacesStore = useSpacesStore()

const space = spacesStore.spaces.find((s) => s.id === Number(route.params.id))

const date = ref('')
const minDate = new Date().toISOString().split('T')[0]
const maxDate = '2100-12-31'
const showModal = ref(false)
const loading = ref(false)
const bookedDates = ref([])

function formatDateBr(dateStr) {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
}

function isBooked(d) {
    return bookedDates.value.includes(d)
}

function isFuture(d) {
    return d && new Date(d) >= new Date(minDate)
}

function validateDate() {
    if (date.value && isBooked(date.value)) {
        Toastify({
            text: 'Esta data já está agendada. Escolha outra.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        date.value = ''
    }
}

function openModal() {
    if (!date.value) {
        Toastify({
            text: 'Selecione a data',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        return
    }
    if (isBooked(date.value)) {
        Toastify({
            text: 'Esta data já está agendada. Escolha outra.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        return
    }
    if (!isFuture(date.value)) {
        Toastify({
            text: 'Só é possível agendar datas futuras.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        return
    }
    showModal.value = true
}

async function confirmBooking() {
    showModal.value = false
    loading.value = true
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
        Toastify({
            text: 'Você precisa estar logado para agendar!',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        loading.value = false
        return
    }

    if (space.owner_id === userId) {
        Toastify({
            text: 'Você não pode agendar sua própria área.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        loading.value = false
        return
    }

    const { error: insertError } = await supabase.from('bookings').insert({
        space_id: space.id,
        user_id: userId,
        date: date.value
    })
    if (insertError) {
        Toastify({
            text: 'Erro ao agendar. Tente novamente.',
            duration: 3000,
            gravity: 'top',
            position: 'center',
            backgroundColor: '#f87171',
        }).showToast()
        loading.value = false
        return
    }

    bookingStore.bookings.push({
        spaceId: space?.id,
        spaceName: space?.name,
        date: formatDateBr(date.value)
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
    loading.value = false
}

// Busca datas já agendadas para o espaço
onMounted(async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select('date')
        .eq('space_id', space?.id)
    if (!error && data) {
        bookedDates.value = data.map(b => b.date)
    }
})
</script>

<style scoped>
/* Adicione estilos personalizados aqui, se necessário */
</style>
