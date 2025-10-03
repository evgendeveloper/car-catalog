import { defineStore } from 'pinia'
import type { CarResponse } from '~~/types/car'

export const useCarStore = defineStore('cars', () => {
  const cars = ref<CarResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCars() {
    loading.value = true
    try {
      const data = await $fetch<CarResponse[]>('/api/cars')
      cars.value = data
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    }
    finally {
      loading.value = false
    }
  }

  return { cars, loading, error, fetchCars }
})
