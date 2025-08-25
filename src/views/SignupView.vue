<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">Cadastro</h2>
      <form @submit.prevent="signup">
        <input
          v-model="fullName"
          type="text"
          placeholder="Nome completo"
          class="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          v-model="email"
          type="email"
          placeholder="E-mail"
          class="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Senha"
          class="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          :disabled="loading"
        >
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { supabase } from '../supabase'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function signup() {
  loading.value = true
  error.value = ''
  const { error: signupError, data } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value
      }
    }
  })
  if (signupError) {
    error.value = signupError.message
  } else {
    Toastify({
      text: 'Cadastro realizado! Verifique seu e-mail para confirmar.',
      duration: 3000,
      gravity: 'top',
      position: 'center',
      backgroundColor: '#22c55e',
    }).showToast()
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  }
  loading.value = false
}
</script>