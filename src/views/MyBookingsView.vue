<template>
  <div class="pt-16 px-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Meus Agendamentos</h2>

    <div v-if="loading" class="text-center py-8">Carregando...</div>
    <div v-else-if="bookings.length === 0" class="text-gray-500">
      Nenhum agendamento encontrado.
    </div>

    <ul v-else class="space-y-4">
      <li v-for="b in bookings" :key="b.id" class="border rounded p-3 shadow-sm">
        <p class="font-semibold">{{ b.spaceName }}</p>
        <p class="text-sm text-gray-600">Dia {{ b.date }}</p>
        <div class="flex gap-2 mt-2">
          <button
            @click="goToDetails(b.spaceId)"
            class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >Ver detalhes</button>
          <button
            @click="openEditModal(b)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
          >Editar</button>
          <button
            @click="openDeleteModal(b)"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >Excluir</button>
        </div>
      </li>
    </ul>

    <!-- Modal de exclusão -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-bold mb-4">Confirmar exclusão</h3>
        <p class="mb-4">Deseja excluir o agendamento para <strong>{{ bookingToDelete?.spaceName }}</strong>?</p>
        <div class="flex justify-end space-x-2">
          <button @click="showDeleteModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button @click="deleteBooking(bookingToDelete.id)" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Excluir</button>
        </div>
      </div>
    </div>

    <!-- Modal de edição -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-bold mb-4">Editar agendamento</h3>
        <label class="block mb-2">Nova data</label>
        <input v-model="editDate" type="date" class="w-full mb-4 p-2 border rounded" />
        <div class="flex justify-end space-x-2">
          <button @click="showEditModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button @click="saveEdit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useBookingsStore } from '@/stores/bookings'
import { useRouter } from 'vue-router'
import Toastify from 'toastify-js'
import { supabase } from '../supabase'

const router = useRouter()
const bookings = ref([])
const loading = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const bookingToDelete = ref(null)
const bookingToEdit = ref(null)
const editDate = ref('')

async function fetchBookings() {
  loading.value = true
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  const { data, error } = await supabase
    .from('bookings')
    .select('id, space_id, date, spaces(name)')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  if (!error && data) {
    bookings.value = data.map(b => ({
      id: b.id,
      spaceId: b.space_id,
      spaceName: b.spaces?.name || '',
      date: b.date
    }))
  }
  loading.value = false
}

function goToDetails(spaceId) {
  router.push(`/espaco/${spaceId}`)
}

function openDeleteModal(booking) {
  bookingToDelete.value = booking
  showDeleteModal.value = true
}

async function deleteBooking(id) {
  showDeleteModal.value = false
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (!error) {
    bookings.value = bookings.value.filter(b => b.id !== id)
    Toastify({ text: 'Agendamento excluído!', backgroundColor: '#22c55e', duration: 2000 }).showToast()
  }
}

function openEditModal(booking) {
  bookingToEdit.value = booking
  editDate.value = booking.date
  showEditModal.value = true
}

async function saveEdit() {
  showEditModal.value = false
  const { error } = await supabase
    .from('bookings')
    .update({ date: editDate.value })
    .eq('id', bookingToEdit.value.id)
  if (!error) {
    bookingToEdit.value.date = editDate.value
    Toastify({ text: 'Agendamento atualizado!', backgroundColor: '#22c55e', duration: 2000 }).showToast()
    fetchBookings()
  }
}

onMounted(() => {
  fetchBookings()
})
</script>

