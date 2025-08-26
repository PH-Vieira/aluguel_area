<template>
    <div class="pt-16 px-4 flex justify-center">
        <div class="w-full max-w-md space-y-4">
            <h2 class="text-xl font-bold text-center">Agendar: {{ space?.name }}</h2>
            <label class="block mb-2">Data do agendamento</label>
            <VueDatePicker
                v-model="date"
                :min-date="new Date()"
                :disabled-dates="disabledDates"
                :format="'yyyy-MM-dd'"
                class="w-full mb-4"
                :input-class="'w-full p-2 border rounded'"
                :placeholder="'Selecione a data'"
            />
            <div v-if="date && isBooked(date)" class="text-red-500 text-xs mb-2">
                Esta data já está agendada. Escolha outra.
            </div>
            <button
                @click="openModal"
                class="w-full bg-blue-600 text-white py-3 rounded cursor-pointer"
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
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingsStore()
const spacesStore = useSpacesStore()

const space = spacesStore.spaces.find((s) => s.id === Number(route.params.id))

const date = ref('')
const showModal = ref(false)
const loading = ref(false)
const bookedDates = ref([])

function formatDateBr(dateInput) {
    if (!dateInput) return ''
    let dateStr = typeof dateInput === 'string'
        ? dateInput
        : dateInput.toISOString().split('T')[0]
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
}

function isBooked(d) {
    if (!d) return false
    // d pode ser Date ou string
    const dateStr = typeof d === 'string'
        ? d
        : d.toISOString().split('T')[0]
    return bookedDates.value.includes(dateStr)
}

function isFuture(d) {
    if (!d) return false
    const dateObj = typeof d === 'string' ? new Date(d) : d
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dateObj >= today
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

    const dateStr = typeof date.value === 'string'
        ? date.value
        : date.value.toISOString().split('T')[0]

    const { error: insertError } = await supabase.from('bookings').insert({
        space_id: space.id,
        user_id: userId,
        date: dateStr
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
        date: formatDateBr(dateStr)
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
    if (!space || !space.id) {
        Toastify({ text: 'Área não encontrada.', backgroundColor: '#f87171' }).showToast()
        loading.value = false
        return
    }
})

// Função para desabilitar datas já agendadas
function disabledDates(dateObj) {
    const dateStr = dateObj.toISOString().split('T')[0]
    return bookedDates.value.includes(dateStr)
}
</script>

<style scoped>
/* Adicione estilos personalizados aqui, se necessário */
</style>
