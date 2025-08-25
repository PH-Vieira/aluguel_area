import { defineStore } from 'pinia'

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [],
    }),
})