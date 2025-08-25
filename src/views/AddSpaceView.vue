<template>
  <div class="pt-16 px-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Cadastrar Área</h2>
    <form @submit.prevent="addSpace">
      <input v-model="name" type="text" placeholder="Nome do espaço" class="w-full mb-2 p-2 border rounded" required />
      <input v-model="location" type="text" placeholder="Localização" class="w-full mb-2 p-2 border rounded" required />
      <input v-model="price" type="number" placeholder="Preço" class="w-full mb-2 p-2 border rounded" required />

      <label class="block mb-2">
        <span class="block text-sm font-medium text-gray-700 mb-1">Imagem do espaço</span>
        <div class="flex items-center space-x-2">
          <input
            id="file-upload"
            type="file"
            @change="onFileChange"
            accept="image/*"
            class="hidden"
            required
          />
          <label
            for="file-upload"
            class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Selecionar imagem
          </label>
          <span v-if="file" class="text-xs text-gray-700">{{ file.name }}</span>
        </div>
      </label>
      <p class="text-xs text-gray-500 mb-2">
        Apenas arquivos de imagem (JPG, PNG, etc) até 50 MB.
      </p>

      <textarea
        v-model="description"
        placeholder="Descrição da área"
        class="w-full mb-2 p-2 border rounded"
        required
      ></textarea>

      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Cadastrar' }}
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
    </form>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { supabase } from '../supabase'

const name = ref('')
const location = ref('')
const price = ref('')
const description = ref('')
const file = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')

function onFileChange(e) {
  const target = e.target
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    if (!selectedFile.type.startsWith('image/')) {
      error.value = 'Selecione apenas arquivos de imagem.'
      file.value = null
      return
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      error.value = 'O arquivo deve ter no máximo 50 MB.'
      file.value = null
      return
    }
    error.value = ''
    file.value = selectedFile
  }
}

async function addSpace() {
  loading.value = true
  error.value = ''
  success.value = ''

  let imgUrl = ''
  // Busca o user_id do usuário logado
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id

  if (file.value && userId) {
    // Salva a imagem na pasta do usuário
    const filePath = `public/${userId}/${Date.now()}_${file.value.name}`
    const { data, error: uploadError } = await supabase.storage
      .from('spaces-images')
      .upload(filePath, file.value)
    if (uploadError) {
      error.value = 'Erro ao enviar imagem'
      loading.value = false
      return
    }
    imgUrl = supabase.storage.from('spaces-images').getPublicUrl(filePath).data.publicUrl
  }

  if (!imgUrl) {
    error.value = 'Falha ao obter URL da imagem. Área não cadastrada.'
    loading.value = false
    return
  }

  const { error: insertError } = await supabase
    .from('spaces')
    .insert({
      name: name.value,
      location: location.value,
      price: price.value,
      img: imgUrl,
      owner_id: userId,
      description: description.value
    })

  if (insertError) {
    error.value = insertError.message
  } else {
    success.value = 'Área cadastrada com sucesso!'
    name.value = ''
    location.value = ''
    price.value = ''
    description.value = ''
    file.value = null
  }
  loading.value = false
}
</script>