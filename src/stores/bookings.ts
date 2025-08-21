import { defineStore } from 'pinia'
import type { Booking } from '@/types/booking'

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [] as Booking[],
    }),
})