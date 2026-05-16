<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }"><TruckIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Kendaraan</h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola data kendaraan pelanggan</p>
      </div>
      <button @click="showModal = true" class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusIcon class="w-4 h-4" /> Tambah Kendaraan
      </button>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="vehicles.length === 0" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Belum ada data kendaraan</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr :style="{ borderBottom: `1px solid var(--border-color)` }">
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Plat Nomor</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Pemilik</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Kendaraan</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Tahun</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Status</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vehicles" :key="v.id" :style="{ borderBottom: `1px solid var(--border-color)` }">
              <td class="py-3 text-sm font-bold" :style="{ color: `var(--accent)` }">{{ v.license_plate }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-primary)` }">{{ v.owner_name }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ v.brand }} {{ v.model }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ v.year }}</td>
              <td class="py-3">
                <span class="text-xs px-2 py-1 rounded-full" :class="v.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">{{ v.status }}</span>
              </td>
              <td class="py-3">
                <button @click="deleteVehicle(v.id)" class="text-sm text-red-400 hover:text-red-300">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-lg" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-6" :style="{ color: `var(--text-primary)` }">Tambah Kendaraan</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Plat Nomor</label><input v-model="form.license_plate" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Pemilik</label><input v-model="form.owner_name" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">No. HP Pemilik</label><input v-model="form.owner_phone" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Jenis Kendaraan</label><input v-model="form.vehicle_type" type="text" placeholder="Mobil/Motor" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Merek</label><input v-model="form.brand" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Model</label><input v-model="form.model" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Tahun</label><input v-model="form.year" type="number" class="input-field" /></div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Bengkel</label>
            <select v-model="form.bengkel_id" class="input-field">
              <option v-for="b in bengkels" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 py-3 rounded-lg text-sm" :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="storeVehicle" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { PlusIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const showModal = ref(false)
const vehicles = ref([])
const bengkels = ref([])
const form = ref({ license_plate: '', owner_name: '', owner_phone: '', vehicle_type: '', brand: '', model: '', year: '', bengkel_id: '', status: 'aktif' })

const fetchVehicles = async () => {
  loading.value = true
  try {
    const [vRes, bRes] = await Promise.all([axios.get('/api/vehicles'), axios.get('/api/bengkels')])
    vehicles.value = vRes.data.data.data || []
    bengkels.value = bRes.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const storeVehicle = async () => {
  try {
    await axios.post('/api/vehicles', form.value)
    showModal.value = false
    fetchVehicles()
  } catch (err) { console.error(err) }
}

const deleteVehicle = async (id) => {
  if (!confirm('Hapus kendaraan ini?')) return
  try {
    await axios.delete(`/api/vehicles/${id}`)
    fetchVehicles()
  } catch (err) { console.error(err) }
}

onMounted(fetchVehicles)
</script>
