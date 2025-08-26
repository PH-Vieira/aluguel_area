<template>
    <div class="pt-16 px-4 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Histórico de Agendamentos das Minhas Áreas</h2>
        <div v-if="loading" class="text-center py-8">Carregando...</div>
        <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>
        <div v-else>
            <div v-if="history.length">
                <table class="w-full border rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2 text-left">Área</th>
                            <th class="p-2 text-left">Usuário</th>
                            <th class="p-2 text-left">Data</th>
                            <th class="p-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in history" :key="item.id" class="border-t">
                            <td class="p-2">{{ item.space_name }}</td>
                            <td class="p-2">{{ item.user_name }}</td>
                            <td class="p-2">{{ formatDate(item.date) }}</td>
                            <td class="p-2">
                                <button
                                    v-if="new Date(item.date) > new Date()"
                                    @click="cancelBooking(item.id)"
                                    class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                                >
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-center py-8 text-gray-400">Nenhum agendamento encontrado.</div>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const loading = ref(true)
const error = ref('')
const history = ref([])

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
}

async function fetchHistory() {
    loading.value = true
    error.value = ''
    history.value = []

    // Busca áreas do usuário logado
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('id, name')
        .eq('owner_id', userId)

    if (spacesError) {
        error.value = spacesError.message
        loading.value = false
        return
    }

    const spaceIds = (spacesData || []).map(s => s.id)
    if (!spaceIds.length) {
        loading.value = false
        return
    }

    // Busca todos os bookings dos espaços do usuário
    const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, space_id, user_id, date')
        .in('space_id', spaceIds)

    if (bookingsError) {
        error.value = bookingsError.message
        loading.value = false
        return
    }

    // Busca nomes dos usuários
    const userIds = [...new Set((bookingsData || []).map(b => b.user_id))]
    let usersMap = {}
    if (userIds.length) {
        const { data: usersData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds)
        usersMap = Object.fromEntries((usersData || []).map(u => [u.id, u.full_name]))
    }

    // Monta histórico e ordena por data (mais recente primeiro)
    history.value = (bookingsData || [])
        .map(b => {
            const space = spacesData.find(s => s.id === b.space_id)
            return {
                id: b.id,
                space_name: space ? space.name : 'Área',
                user_name: usersMap[b.user_id] || 'Usuário',
                date: b.date
            }
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    loading.value = false
}

async function cancelBooking(id) {
    const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
    if (deleteError) {
        error.value = 'Erro ao cancelar agendamento.'
    } else {
        // Atualiza a lista após cancelar
        fetchHistory()
    }
}

onMounted(() => {
    fetchHistory()
})
</script>