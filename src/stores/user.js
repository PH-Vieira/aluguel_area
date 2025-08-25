import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAdvertiser: false,
    userId: null,
  }),
  actions: {
    async checkAdvertiser() {
      const { data: userData } = await supabase.auth.getUser()
      this.userId = userData.user?.id
      if (!this.userId) {
        this.isAdvertiser = false
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', this.userId)
        .single()
      this.isAdvertiser = data?.role === 'anunciante' || data?.role === 'anunciante_locatario'
    }
  }
})