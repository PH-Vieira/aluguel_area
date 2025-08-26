<template>
    <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col h-full">
        <img :src="img" alt="Espaço" class="w-full h-48 object-cover rounded-md mb-3" />
        <h3 class="text-lg font-semibold mb-1">{{ name }}</h3>
        <p v-if="price !== undefined" class="text-blue-700 font-semibold mb-2">R$ {{ price }}</p>
        <router-link :to="`/espaco/${id}`" class="mt-auto text-blue-600 underline block font-medium hover:text-blue-800">
            Ver detalhes
        </router-link>

        <!-- Lista de reviews -->
        <div v-if="reviews && reviews.length" class="mt-4">
            <h4 class="font-semibold mb-2 text-sm text-gray-700">Avaliações:</h4>
            <ul class="space-y-2">
                <li v-for="r in reviews" :key="r.id" class="border rounded p-2 bg-gray-50">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-yellow-500 font-bold">Nota: {{ r.rating }}/5</span>
                        <span class="text-xs text-gray-500">{{ formatDate(r.created_at) }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ r.comment }}</p>
                </li>
            </ul>
        </div>
        <div v-else class="mt-4 text-xs text-gray-400">Ainda não há avaliações.</div>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
    id: Number,
    name: String,
    img: String,
    price: Number
})

const reviews = ref([])

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
}

async function fetchReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('space_id', props.id)
        .order('created_at', { ascending: false })
    if (!error && data) {
        reviews.value = data
    }
}

onMounted(() => {
    fetchReviews()
})
</script>
