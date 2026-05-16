<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }"><BuildingStorefrontIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Bengkel</h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola data bengkel</p>
      </div>
      <button @click="showModal = true" class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusIcon class="w-4 h-4" /> Tambah Bengkel
      </button>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="bengkels.length === 0" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Belum ada data bengkel</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr :style="{ borderBottom: `1px solid var(--border-color)` }">
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Nama</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Kota</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Telepon</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Status</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bengkels" :key="b.id" :style="{ borderBottom: `1px solid var(--border-color)` }">
              <td class="py-3 text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ b.name }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ b.city }}, {{ b.province }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ b.phone }}</td>
              <td class="py-3">
                <span class="text-xs px-2 py-1 rounded-full" :class="b.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">{{ b.status }}</span>
              </td>
              <td class="py-3">
                <button @click="deleteBengkel(b.id)" class="text-sm text-red-400 hover:text-red-300">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-lg" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-6" :style="{ color: `var(--text-primary)` }">Tambah Bengkel</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Bengkel</label>
            <input v-model="form.name" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Telepon</label>
            <input v-model="form.phone" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Email</label>
            <input v-model="form.email" type="email" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Kota</label>
            <input v-model="form.city" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Provinsi</label>
            <input v-model="form.province" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Pemilik</label>
            <input v-model="form.owner_name" type="text" class="input-field" />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Alamat</label>
          <input v-model="form.address" type="text" class="input-field" />
        </div>
        <div class="mb-6">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Status</label>
          <select v-model="form.status" class="input-field">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 py-3 rounded-lg text-sm transition-all" :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="storeBengkel" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
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
const bengkels = ref([])
const form = ref({ name: '', phone: '', email: '', city: '', province: '', owner_name: '', address: '', status: 'aktif' })

const fetchBengkels = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/bengkels')
    bengkels.value = res.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const storeBengkel = async () => {
  try {
    await axios.post('/api/bengkels', form.value)
    showModal.value = false
    fetchBengkels()
  } catch (err) { console.error(err) }
}

const deleteBengkel = async (id) => {
  if (!confirm('Hapus bengkel ini?')) return
  try {
    await axios.delete(`/api/bengkels/${id}`)
    fetchBengkels()
  } catch (err) { console.error(err) }
}

onMounted(fetchBengkels)
</script>
