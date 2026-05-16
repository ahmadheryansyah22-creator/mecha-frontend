<template>
  <div class="animate-fadein">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
          <TruckIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Kendaraan Customer
        </h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Data kendaraan yang ditangani mekanik</p>
      </div>
      <span class="text-xs px-3 py-1.5 rounded-full font-medium" style="background:#3b82f620;color:#3b82f6">
        {{ vehicles.length }} Kendaraan
      </span>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" :style="{ color: `var(--text-muted)` }" />
      <input v-model="search" type="text" placeholder="Cari plat nomor atau merek..." class="input-field" style="padding-left:2.5rem !important" />
    </div>

    <div class="card">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-8 h-8 border-2 rounded-full animate-spin" :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>
      <div v-else-if="filteredVehicles.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <TruckIcon class="w-12 h-12 opacity-20" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium" :style="{ color: `var(--text-primary)` }">Belum ada data kendaraan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="v in filteredVehicles" :key="v.id"
          class="p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group"
          :style="{ border: `1px solid var(--border-color)`, backgroundColor: `var(--bg-primary)` }">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style="background:linear-gradient(135deg,#3b82f6,#2563eb)">
              <TruckIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="font-semibold text-sm" :style="{ color: `var(--text-primary)` }">{{ v.brand }} {{ v.model }}</p>
              <p class="text-xs font-bold mt-0.5" :style="{ color: `var(--accent)` }">{{ v.license_plate }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs" :style="{ color: `var(--text-secondary)` }">
            <div class="flex items-center gap-1">
              <span :style="{ color: `var(--text-muted)` }">Tahun:</span> {{ v.year || '-' }}
            </div>
            <div class="flex items-center gap-1">
              <span :style="{ color: `var(--text-muted)` }">Warna:</span> {{ v.color || '-' }}
            </div>
            <div class="col-span-2 flex items-center gap-1 pt-1" :style="{ borderTop: `1px solid var(--border-color)` }">
              <span :style="{ color: `var(--text-muted)` }">Pemilik:</span>
              <span class="font-medium" :style="{ color: `var(--text-primary)` }">{{ v.customer?.name || v.owner_name || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { TruckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const vehicles = ref([])
const loading = ref(true)
const search = ref('')

const filteredVehicles = computed(() =>
  vehicles.value.filter(v =>
    v.license_plate?.toLowerCase().includes(search.value.toLowerCase()) ||
    v.brand?.toLowerCase().includes(search.value.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/vehicles', { headers: { Authorization: `Bearer ${token}` } })
    vehicles.value = res.data.data?.data || res.data.data || []
  } catch (e) { vehicles.value = [] }
  finally { loading.value = false }
})
</script>
