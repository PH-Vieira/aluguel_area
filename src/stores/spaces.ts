import { defineStore } from 'pinia'
import type { Space } from '@/types/space'

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    spaces: [
      { id: 1, name: 'Churrasqueira Central', img: 'https://placehold.co/400x200' },
      { id: 2, name: 'Quadra Poliesportiva', img: 'https://placehold.co/400x200' },
      { id: 3, name: 'Salão de Festas', img: 'https://placehold.co/400x200' },
      { id: 4, name: 'Auditório Empresarial', img: 'https://placehold.co/400x200' },
      { id: 5, name: 'Estúdio Criativo', img: 'https://placehold.co/400x200' },
      { id: 6, name: 'Espaço Kids', img: 'https://placehold.co/400x200' },
      { id: 7, name: 'Coworking Aconchegante', img: 'https://placehold.co/400x200' },
      { id: 8, name: 'Sala de Reunião', img: 'https://placehold.co/400x200' },
    ] as Space[],
  }),
})