<template>
  <UContainer>
    <UPage>
      <div class="pt-4">
        <UButton
          to="/"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="outline"
        >
          Back
        </UButton>
      </div>

      <UPageHeader
        v-if="car"
        :title="`${car.make} ${car.model}`"
        :description="String(car.year)"
      />
      <UPageBody>
        <div v-if="car">
          <div
            class="flex flex-col-reverse md:grid md:grid-cols-3 gap-8"
          >
            <div
              v-if="status === 'pending'"
              class="flex flex-col gap-4"
            >
              <USkeleton
                v-for="n in 12"
                :key="n"
                :class="{ 'w-3/4': n % 3 === 0, 'w-1/2': n % 3 === 1, 'w-full': n % 3 === 2 }"
                class="h-10"
              />
            </div>
            <div v-else-if="error">
              <UAlert
                :title="error"
                color="error"
                variant="soft"
              />
            </div>
            <div
              v-else
              class="flex flex-col gap-4"
            >
              <div
                v-for="line in carDetails"
                :key="line.title"
              >
                <div class="font-mono text-sm font-medium tracking-widest text-gray-500 uppercase sm:text-xs dark:text-gray-400">
                  {{ line.title.replaceAll('_', ' ') }}:
                </div>
                <div class="text-sm font-semibold">
                  {{ line.value }}
                </div>
              </div>
            </div>
            <div class="col-span-2">
              <USkeleton
                v-if="status === 'pending'"
                class="h-128 w-full max-w-full rounded-xl"
              />
              <NuxtImg
                v-else-if="carImage?.imageUrl"
                :src="carImage.imageUrl"
                :alt="`${car.make} ${car.model}, ${car.year}`"
                loading="lazy"
                placeholder
                class="w-full max-w-full rounded-xl shadow"
              />
            </div>
          </div>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import { useCarStore } from '~/stores/cars'
import type { CarResponse, CarImageResponse, CarDetailsResponse } from '~~/types/car'

const route = useRoute()
const store = useCarStore()
const car = computed(() => store.cars.find((c: CarResponse) => c.id === Number(route.params.id)))

const error = ref<string | null>(null)

if (!car.value) await callOnce('cars', () => store.fetchCars(), { mode: 'navigation' })

const { data: carImage } = await useFetch<CarImageResponse>('/api/cars/image', {
  params: {
    make: car.value.make,
    model: car.value.model,
  },
  lazy: true,
})

const { data: carDetails, status, error: carDetailsError } = await useFetch('/api/cars/details', {
  params: {
    make: car.value.make,
    model: car.value.model,
    year: car.value.year,
  },
  lazy: true,
  transform: (data: CarDetailsResponse) => {
    if (!data?.details) {
      error.value = 'No details found'
      return null
    }

    const info = []
    const excludeKeys = ['model_id', 'model_make_id', 'model_name', 'model_year', 'make_display', 'model_make_display']

    for (const [key, value] of Object.entries(data?.details)) {
      if (value && !excludeKeys.includes(key)) {
        info.push({ title: key.replace('model_', '').replace('make_', '').replace(/_/g, ' '), value })
      }
    }

    return info
  },
})

if (carDetailsError.value) {
  error.value = carDetailsError.value.message
  console.error('Failed to fetch car details:', carDetailsError.value)
}
</script>
