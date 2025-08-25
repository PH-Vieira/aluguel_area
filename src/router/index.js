import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '../supabase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/espaco/:id',
    name: 'SpaceDetails',
    component: () => import('@/views/SpaceDetailsView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/espaco/:id/agendar',
    name: 'Schedule',
    component: () => import('@/views/ScheduleView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/meus-agendamentos',
    name: 'MyBookings',
    component: () => import('@/views/MyBookingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignupView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/add-space',
    name: 'AddSpace',
    component: () => import('@/views/AddSpaceView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-spaces',
    name: 'MySpaces',
    component: () => import('@/views/MySpacesView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegação
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const { data } = await supabase.auth.getUser()
  const isAuthenticated = !!data.user

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router