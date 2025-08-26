<template>
    <nav class="fixed top-0 left-0 w-full bg-white z-50 shadow px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-semibold">
            <router-link to="/">AlugaJá</router-link>
        </h1>

        <!-- Menu desktop -->
        <div class="hidden md:flex items-center space-x-6">
            <router-link to="/" class="text-sm">Início</router-link>
            <template v-if="!isLoggedIn">
                <router-link to="/login" class="text-sm">Login</router-link>
                <router-link to="/signup" class="text-sm">Cadastro</router-link>
            </template>
            <template v-else>
                <router-link to="/meus-agendamentos" class="text-sm">Meus Agendamentos</router-link>
                <router-link to="/profile" class="text-sm">Meu perfil</router-link>
                <router-link
                    v-if="isAdvertiser"
                    to="/add-space"
                    class="text-sm"
                >Cadastrar Área</router-link>
                <router-link
                    v-if="isAdvertiser"
                    to="/my-spaces"
                    class="text-sm"
                >Meus Espaços</router-link>
                <button @click="logout" class="text-sm">Deslogar</button>
            </template>
        </div>

        <!-- Menu mobile -->
        <button @click="open = !open" class="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <!-- Overlay para fechar ao clicar fora -->
        <div v-if="open" class="fixed inset-0 z-40 md:hidden" @click="open = false"></div>

        <transition name="fade">
            <div v-if="open" class="absolute right-4 top-14 bg-white border rounded shadow p-2 space-y-2 z-50 md:hidden">
                <router-link to="/" class="block text-sm" @click="open = false">Início</router-link>
                <template v-if="!isLoggedIn">
                    <router-link to="/login" class="block text-sm" @click="open = false">Login</router-link>
                    <router-link to="/signup" class="block text-sm" @click="open = false">Cadastro</router-link>
                </template>
                <template v-else>
                    <router-link to="/meus-agendamentos" class="block text-sm" @click="open = false">Meus Agendamentos</router-link>
                    <router-link to="/profile" class="block text-sm" @click="open = false">Meu perfil</router-link>
                    <router-link
                        v-if="isAdvertiser"
                        to="/add-space"
                        class="block text-sm"
                        @click="open = false"
                    >Cadastrar Área</router-link>
                    <router-link
                        v-if="isAdvertiser"
                        to="/my-spaces"
                        class="block text-sm"
                        @click="open = false"
                    >Meus Espaços</router-link>
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
const isLoggedIn = ref(false)
const isAdvertiser = ref(false)
const router = useRouter()
const userStore = useUserStore()

async function checkAuth() {
    const { data } = await supabase.auth.getUser()
    isLoggedIn.value = !!data.user

    if (data.user) {
        // Busca o perfil do usuário
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()
        isAdvertiser.value = profile?.role === 'anunciante' || profile?.role === 'anunciante_locatario'
    } else {
        isAdvertiser.value = false
    }
}

onMounted(() => {
    checkAuth()
    supabase.auth.onAuthStateChange(() => {
        checkAuth()
    })
})

async function logout() {
    await supabase.auth.signOut()
    isLoggedIn.value = false
    isAdvertiser.value = false
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