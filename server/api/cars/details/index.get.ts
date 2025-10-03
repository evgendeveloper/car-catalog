import type { CarResponse } from '~~/types/car'

interface CarDetailsResponse {
  Trims: Array<{
    model_id: string
    model_make_id: string
    model_name: string
    model_trim: string
    model_year: string
    model_body: string
    model_engine_position: string
  }>
}

export default defineEventHandler(async (event) => {
  try {
    const car: CarResponse = getQuery(event)
    const url = 'https://www.carqueryapi.com/api/0.3/'
    const params = {
      cmd: 'getTrims',
      make: car.make.toLowerCase(),
      model: car.model.toLowerCase(),
      year: car.year,
    }
    const data = await $fetch<CarDetailsResponse>(url, { params })

    if (!data || !data.Trims || data.Trims.length === 0) {
      return { details: null }
    }

    return { details: data.Trims[0] }
  }
  catch (error) {
    console.error('Error fetching car details:', error)
    return { error }
  }
})
