import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    spaces: [],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchSpaces() {
      this.loading = true
      this.error = ''
      const { data, error } = await supabase
        .from('spaces')
        .select('id, name, location, price, img, owner_id, description')
        .order('created_at', { ascending: false })
      if (error) {
        this.error = error.message
      } else {
        this.spaces = data || []
      }
      this.loading = false
    }
  }
})