import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/espaco/:id',
    name: 'SpaceDetails',
    component: () => import('@/views/SpaceDetailsView.vue'),
  },
  {
    path: '/espaco/:id/agendar',
    name: 'Schedule',
    component: () => import('@/views/ScheduleView.vue')
  },
  {
    path: '/meus-agendamento',
    name: 'MyBookings',
    component: () => import('@/views/MyBookingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router