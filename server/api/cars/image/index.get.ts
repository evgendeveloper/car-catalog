interface ImageResponse {
  results: Array<{
    urls: {
      raw: string
      full: string
      regular: string
      small: string
      thumb: string
      small_s3: string
    }
  }>
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const car = getQuery(event)
    const url = 'https://api.unsplash.com/search/photos'
    const params = {
      query: `${car.make} ${car.model}`,
      client_id: config.public.unsplashAccessKey,
    }
    const data = await $fetch<ImageResponse>(url, { params })
    const imageUrl = data?.results[0]?.urls?.regular || null
    return { imageUrl }
  }
  catch (error) {
    console.error('Error fetching car image:', error)
    return { imageUrl: null }
  }
})
