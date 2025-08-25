<template>
  <div>
    <div v-if="canReview">
      <h4 class="font-semibold mb-2">Deixe sua avaliação</h4>
      <form @submit.prevent="submitReview" class="space-y-2">
        <label class="block text-sm">Nota:</label>
        <select v-model="rating" class="border rounded p-2 w-full" required>
          <option disabled value="">Selecione</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        <label class="block text-sm">Comentário:</label>
        <textarea v-model="comment" class="border rounded p-2 w-full" rows="3" required></textarea>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? 'Enviando...' : 'Enviar avaliação' }}
        </button>
        <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-xs mt-2">{{ success }}</p>
      </form>
    </div>
    <div v-else class="text-xs text-gray-500">
      Você só pode avaliar áreas que já agendou e usou.
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  spaceId: {
    type: Number,
    required: true
  }
})

const rating = ref('')
const comment = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const canReview = ref(false)

async function checkCanReview() {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) return

  const today = new Date().toISOString().split('T')[0]
  const { data: bookings } = await supabase
    .from('bookings')
    .select('date')
    .eq('user_id', userId)
    .eq('space_id', props.spaceId)
    .lt('date', today)

  canReview.value = bookings && bookings.length > 0
}

async function submitReview() {
  loading.value = true
  error.value = ''
  success.value = ''

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) {
    error.value = 'Você precisa estar logado para avaliar.'
    loading.value = false
    return
  }

  const { error: insertError } = await supabase
    .from('reviews')
    .insert({
      space_id: props.spaceId,
      user_id: userId,
      rating: Number(rating.value),
      comment: comment.value
    })

  if (insertError) {
    error.value = insertError.message
  } else {
    success.value = 'Avaliação enviada com sucesso!'
    rating.value = ''
    comment.value = ''
  }
  loading.value = false
}

onMounted(() => {
  checkCanReview()
})
</script>