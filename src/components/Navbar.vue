<template>
    <nav class="fixed top-0 left-0 w-full bg-white z-50 shadow px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
            <h1 class="text-lg font-semibold mr-4">
                <router-link to="/">AlugaJá</router-link>
            </h1>
        </div>

        <!-- Menu desktop: só aparece em telas lg+ -->
        <div class="hidden lg:flex flex-wrap items-center space-x-4">
            <router-link to="/" class="text-sm whitespace-nowrap">Início</router-link>
            <template v-if="!userStore.userId">
                <router-link to="/login" class="text-sm whitespace-nowrap">Login</router-link>
                <router-link to="/signup" class="text-sm whitespace-nowrap">Cadastro</router-link>
            </template>
            <template v-else>
                <router-link to="/meus-agendamentos" class="text-sm whitespace-nowrap">Meus Agendamentos</router-link>
                <router-link to="/profile" class="text-sm whitespace-nowrap">Meu perfil</router-link>
                <router-link v-if="userStore.isAdvertiser" to="/add-space" class="text-sm whitespace-nowrap">Cadastrar Área</router-link>
                <router-link v-if="userStore.isAdvertiser" to="/my-spaces" class="text-sm whitespace-nowrap">Meus Espaços</router-link>
                <router-link v-if="userStore.isAdvertiser" to="/my-spaces-history" class="text-sm whitespace-nowrap">Histórico de Agendamentos</router-link>
                <button @click="logout" class="text-sm whitespace-nowrap">Deslogar</button>
            </template>
        </div>

        <!-- Botão mobile: aparece em telas menores que lg, alinhado à direita -->
        <button @click="open = !open" class="lg:hidden ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <!-- Overlay para fechar ao clicar fora -->
        <div v-if="open" class="fixed inset-0 z-40 lg:hidden" @click="open = false"></div>

        <!-- Menu mobile: aparece em telas menores que lg -->
        <transition name="fade">
            <div v-if="open"
                class="absolute right-2 top-14 bg-white border rounded shadow p-2 space-y-2 z-50 lg:hidden w-80">
                <router-link to="/" class="block text-sm" @click="open = false">Início</router-link>
                <template v-if="!userStore.userId">
                    <router-link to="/login" class="block text-sm" @click="open = false">Login</router-link>
                    <router-link to="/signup" class="block text-sm" @click="open = false">Cadastro</router-link>
                </template>
                <template v-else>
                    <router-link to="/meus-agendamentos" class="block text-sm" @click="open = false">Meus
                        Agendamentos</router-link>
                    <router-link to="/profile" class="block text-sm" @click="open = false">Meu perfil</router-link>
                    <router-link v-if="userStore.isAdvertiser" to="/add-space" class="block text-sm"
                        @click="open = false">Cadastrar Área</router-link>
                    <router-link v-if="userStore.isAdvertiser" to="/my-spaces" class="block text-sm" @click="open = false">Meus
                        Espaços</router-link>
                    <router-link v-if="userStore.isAdvertiser" to="/my-spaces-history" class="block text-sm" @click="open = false">Histórico de Agendamentos</router-link>
                    <button @click="logout" class="block text-sm w-full text-left">Deslogar</button>
                </template>
            </div>
        </transition>
    </nav>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const open = ref(false)
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
    userStore.checkAdvertiser()
    supabase.auth.onAuthStateChange(() => {
        userStore.checkAdvertiser()
    })
})

async function logout() {
    await supabase.auth.signOut()
    userStore.logout()
    router.push('/login')
    open.value = false
}
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}
</style>