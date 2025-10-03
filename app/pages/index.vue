<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label
                for="search"
                class="text-sm font-semibold"
              >Search</label>
              <UInput
                id="search"
                v-model="search"
                size="xl"
                placeholder="Search by make or model"
              >
                <template
                  v-if="search?.length"
                  #trailing
                >
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-x"
                    aria-label="Clear input"
                    @click="search = ''"
                  />
                </template>
              </UInput>
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <label
                  for="make"
                  class="text-sm font-semibold"
                >Make</label>
                <UButton
                  v-if="selectedMake"
                  label="Clear"
                  color="neutral"
                  variant="link"
                  size="xs"
                  trailing-icon="i-lucide-x"
                  aria-label="Clear year"
                  class="p-0"
                  @click="selectedMake = ''"
                />
              </div>
              <USelect
                id="make"
                v-model="selectedMake"
                size="xl"
                placeholder="Select Make"
                :items="makes"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                }"
              />
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <label
                  for="year"
                  class="text-sm font-semibold"
                >Year</label>
                <UButton
                  v-if="selectedYear"
                  label="Clear"
                  color="neutral"
                  variant="link"
                  size="xs"
                  trailing-icon="i-lucide-x"
                  aria-label="Clear year"
                  class="p-0"
                  @click="selectedYear = undefined"
                />
              </div>

              <USelect
                id="year"
                v-model="selectedYear"
                size="xl"
                placeholder="Select Year"
                :items="years"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                }"
              />
            </div>
          </div>
        </UPageAside>
      </template>

      <UPageBody>
        <UPageList>
          <UPageCard
            v-for="car in filteredCars"
            :key="car.id"
            :to="`/car/${car.id}`"
            :title="`${car.make} ${car.model}`"
            :description="car.year.toString()"
            variant="ghost"
          />
        </UPageList>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import type { CarResponse } from '~~/types/car'
import { useCarStore } from '~/stores/cars'

const store = useCarStore()
const route = useRoute()
const router = useRouter()

const search = ref(route.query.q?.toString() || '')
const selectedMake = ref(route.query.make?.toString() || '')
const selectedYear = ref<number | undefined>(route.query.year ? Number(route.query.year) : undefined)

await callOnce('cars', () => store.fetchCars(), { mode: 'navigation' })

watch([search, selectedMake, selectedYear], () => {
  const query: any = {}
  if (search.value) query.q = search.value
  if (selectedMake.value) query.make = selectedMake.value
  if (selectedYear.value) query.year = selectedYear.value
  router.replace({ query })
})

const makes = computed<string[]>(() => Array.from(new Set(store.cars.map((c: CarResponse) => c.make))))
const years = computed(() => Array.from<number>(new Set(store.cars.map((c: CarResponse) => c.year).sort((a, b) => b - a))))

const filteredCars = computed(() => {
  return store.cars.filter((c: CarResponse) => {
    const matchSearch = c.make.toLowerCase().includes(search.value.toLowerCase())
      || c.model.toLowerCase().includes(search.value.toLowerCase())
    const matchMake = !selectedMake.value || c.make === selectedMake.value
    const matchYear = !selectedYear.value || c.year === selectedYear.value
    return matchSearch && matchMake && matchYear
  })
})
</script>
