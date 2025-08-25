import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: [],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchReviews(spaceId) {
      this.loading = true
      this.error = ''
      const { data, error } = await supabase
        .from('reviews')
        .select('id, space_id, user_id, rating, comment, created_at')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false })
      if (error) {
        this.error = error.message
      } else {
        this.reviews = data || []
      }
      this.loading = false
    },
    async addReview({ spaceId, userId, rating, comment }) {
      this.loading = true
      this.error = ''
      const { error } = await supabase
        .from('reviews')
        .insert({
          space_id: spaceId,
          user_id: userId,
          rating,
          comment,
        })
      if (error) {
        this.error = error.message
      } else {
        await this.fetchReviews(spaceId)
      }
      this.loading = false
    }
  }
})