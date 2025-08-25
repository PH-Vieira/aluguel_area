<template>
  <div class="pt-16 px-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Meu Perfil</h2>
    <div class="bg-white p-6 rounded shadow">
      <p><strong>E-mail:</strong> {{ email }}</p>
      <p><strong>Nome completo:</strong> {{ fullName }}</p>
      <p><strong>Tipo de conta:</strong>
        <span v-if="role === 'anunciante' || role === 'anunciante_locatario'">Anunciante e Locatário</span>
        <span v-else-if="role === 'Locatario'">Locatário</span>
        <span v-else>Não definido</span>
      </p>

      <div v-if="role === 'Locatario'" class="mt-6">
        <h3 class="font-semibold mb-2">Quero anunciar áreas</h3>
        <form @submit.prevent="activateAdvertiser">
          <input
            v-model="company"
            type="text"
            placeholder="Nome da empresa (opcional)"
            class="w-full mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            :disabled="loading"
          >
            {{ loading ? 'Salvando...' : 'Ativar anunciante' }}
          </button>
        </form>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </div>

      <p v-if="success" class="text-green-500 mt-4">{{ success }}</p>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const email = ref('')
const fullName = ref('')
const role = ref('')
const company = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function fetchProfile() {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  if (!userId) return

  // Busca o perfil na tabela 'profiles'
  const { data, error: fetchError } = await supabase
    .from('profiles')
    .select('email, full_name, role')
    .eq('id', userId)
    .single()

  if (data) {
    email.value = data.email
    fullName.value = data.full_name
    role.value = data.role
  }
}

onMounted(() => {
  fetchProfile()
})

async function activateAdvertiser() {
  loading.value = true
  error.value = ''
  success.value = ''

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'anunciante_locatario', company: company.value })
    .eq('id', userId)

  if (updateError) {
    error.value = updateError.message
  } else {
    success.value = 'Agora você pode anunciar áreas!'
    role.value = 'anunciante_locatario'
    await userStore.checkAdvertiser()
  }
  loading.value = false
}
</script>