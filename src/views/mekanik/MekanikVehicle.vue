<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <TruckIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
        Kendaraan Customer
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Data kendaraan yang ditangani mekanik</p>
    </div>
    <div class="card">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <TruckIcon class="w-12 h-12" :style="{ color: `var(--accent)` }" />
        <p :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>
      <div v-else-if="vehicles.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <TruckIcon class="w-12 h-12 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-muted)` }">Belum ada data kendaraan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="v in vehicles" :key="v.id" class="p-4 rounded-xl" :style="{ border: `1px solid var(--border-color)`, backgroundColor: `var(--bg-primary)` }">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
              <TruckIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
            </div>
            <div>
              <p class="font-semibold text-sm" :style="{ color: `var(--text-primary)` }">{{ v.brand }} {{ v.model }}</p>
              <p class="text-xs font-medium" :style="{ color: `var(--accent)` }">{{ v.license_plate }}</p>
            </div>
          </div>
          <div class="text-xs space-y-1" :style="{ color: `var(--text-secondary)` }">
            <p>Tahun: {{ v.year || '-' }}</p>
            <p>Warna: {{ v.color || '-' }}</p>
            <p>Pemilik: {{ v.customer?.name || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { TruckIcon } from "@heroicons/vue/24/outline"

const vehicles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } })
    vehicles.value = res.data.data?.data || res.data.data || []
  } catch (e) { vehicles.value = [] }
  finally { loading.value = false }
})
</script>
