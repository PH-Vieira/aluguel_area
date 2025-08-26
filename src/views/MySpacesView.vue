<template>
  <div class="pt-16 px-4 max-w-5xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Minhas Áreas</h2>
    <div v-if="loading" class="text-center py-8">Carregando...</div>
    <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="space in spaces" :key="space.id" class="bg-white rounded-lg shadow p-4 flex flex-col h-full">
          <img v-if="space.img" :src="space.img" alt="Espaço" class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-md mb-2" />
          <h3 class="font-bold mb-1">{{ space.name }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ space.location }}</p>
          <p class="text-blue-700 font-semibold mb-2">R$ {{ space.price }}</p>
          <div class="flex gap-2 mt-auto">
            <button
              @click="openModal(space.id)"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >Excluir</button>
            <router-link
              :to="`/my-spaces-schedule?spaceId=${space.id}`"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            >
              Ver calendário
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-if="success" class="text-green-500 text-center mt-4">{{ success }}</div>

    <!-- Modal de confirmação -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-bold mb-4">Confirmar exclusão</h3>
        <p class="mb-4">
          Tem certeza que deseja excluir a área <strong>{{ getSpaceName(spaceToDelete) }}</strong>?
        </p>
        <div class="flex justify-end space-x-2">
          <button @click="showModal = false" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button @click="deleteSpace(spaceToDelete)" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import Toastify from 'toastify-js'

const spaces = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showModal = ref(false)
const spaceToDelete = ref(null)

async function fetchMySpaces() {
  loading.value = true
  error.value = ''
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  const { data, error: fetchError } = await supabase
    .from('spaces')
    .select('*')
    .eq('owner_id', userId)
  if (fetchError) {
    error.value = fetchError.message
  } else {
    spaces.value = data || []
  }
  loading.value = false
}

function openModal(id) {
  spaceToDelete.value = id
  showModal.value = true
}

async function deleteSpace(id) {
  showModal.value = false
  const nomeArea = getSpaceName(id)
  const { error: deleteError } = await supabase
    .from('spaces')
    .delete()
    .eq('id', id)
  if (deleteError) {
    error.value = deleteError.message
    success.value = ''
    Toastify({
      text: `Erro ao excluir área "${nomeArea}"!`,
      duration: 3000,
      gravity: 'top',
      position: 'center',
      backgroundColor: '#f87171',
    }).showToast()
  } else {
    spaces.value = spaces.value.filter(space => space.id !== id)
    success.value = `Área "${nomeArea}" excluída com sucesso!`
    Toastify({
      text: success.value,
      duration: 2000,
      gravity: 'top',
      position: 'center',
      backgroundColor: '#22c55e',
    }).showToast()
    setTimeout(() => {
      success.value = ''
    }, 2000)
  }
}

function getSpaceName(id) {
  const space = spaces.value.find(space => space.id === id)
  return space ? space.name : ''
}

onMounted(() => {
  fetchMySpaces()
})
</script>