<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
          <WrenchScrewdriverIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
          Mekanik
        </h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola data mekanik bengkel</p>
      </div>
      <button @click="showModal = true"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
        :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
        <PlusIcon class="w-4 h-4" /> Tambah Mekanik
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 p-4 rounded-2xl"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <component :is="stat.icon" class="w-5 h-5" :style="{ color: `var(--accent)` }" />
        </div>
        <div>
          <p class="text-xl font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
          <p class="text-xs" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="rounded-2xl p-6" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <WrenchScrewdriverIcon class="w-12 h-12 animate-pulse" :style="{ color: `var(--accent)` }" />
        <p :style="{ color: `var(--text-muted)` }">Memuat data mekanik...</p>
      </div>
      <div v-else-if="mechanics.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <WrenchScrewdriverIcon class="w-12 h-12 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-muted)` }">Belum ada data mekanik</p>
        <button @click="showModal = true" class="mt-2 px-4 py-2 rounded-xl text-sm font-semibold"
          :style="{ backgroundColor: `var(--accent)`, color: `#000` }">Tambah Mekanik Pertama</button>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color)">
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Nama</th>
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Bengkel</th>
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Keahlian</th>
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Pengalaman</th>
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Status</th>
              <th class="text-left text-xs font-semibold pb-4 uppercase tracking-wider" :style="{ color: `var(--text-muted)` }">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in mechanics" :key="m.id" style="border-bottom: 1px solid var(--border-color)">
              <td class="py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
                    {{ (m.name || 'M')[0].toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ m.name }}</p>
                    <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ m.email || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 text-sm" :style="{ color: `var(--text-secondary)` }">{{ m.bengkel?.name || '-' }}</td>
              <td class="py-4 text-sm" :style="{ color: `var(--text-secondary)` }">{{ m.expertise || '-' }}</td>
              <td class="py-4 text-sm" :style="{ color: `var(--text-secondary)` }">{{ m.experience_years || 0 }} thn</td>
              <td class="py-4">
                <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusClass(m.status)">{{ m.status }}</span>
              </td>
              <td class="py-4">
                <button @click="deleteMechanic(m.id)"
                  class="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                  :style="{ color: `#f87171`, border: `1px solid rgba(248,113,113,0.3)` }">
                  <TrashIcon class="w-3 h-3" /> Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 px-4"
      style="background-color: rgba(0,0,0,0.75)">
      <div class="rounded-2xl p-8 w-full max-w-lg"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold" :style="{ color: `var(--text-primary)` }">Tambah Mekanik</h2>
          <button @click="showModal = false" :style="{ color: `var(--text-muted)` }">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="field in fields" :key="field.key">
            <label class="block text-xs mb-2 font-medium" :style="{ color: `var(--text-secondary)` }">{{ field.label }}</label>
            <select v-if="field.type === 'select-bengkel'" v-model="form.bengkel_id"
              class="w-full px-4 py-2 rounded-xl text-sm outline-none"
              :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }">
              <option value="">-- Pilih Bengkel --</option>
              <option v-for="b in bengkels" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
            <select v-else-if="field.type === 'select-status'" v-model="form.status"
              class="w-full px-4 py-2 rounded-xl text-sm outline-none"
              :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }">
              <option value="aktif">Aktif</option>
              <option value="cuti">Cuti</option>
              <option value="resigned">Resigned</option>
            </select>
            <input v-else v-model="form[field.key]" :type="field.type" :placeholder="field.placeholder"
              class="w-full px-4 py-2 rounded-xl text-sm outline-none"
              :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showModal = false"
            class="flex-1 py-3 rounded-xl text-sm font-medium"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="storeMechanic"
            class="flex-1 py-3 rounded-xl text-sm font-semibold"
            :style="{ backgroundColor: `var(--accent)`, color: `#000` }">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { PlusIcon, WrenchScrewdriverIcon, TrashIcon, XMarkIcon, UserGroupIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const showModal = ref(false)
const mechanics = ref([])
const bengkels = ref([])
const form = ref({ name: '', email: '', phone: '', bengkel_id: '', expertise: '', experience_years: '', join_date: '', status: 'aktif' })

const fields = [
  { key: 'name', label: 'Nama', type: 'text', placeholder: 'Nama mekanik' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
  { key: 'phone', label: 'Telepon', type: 'text', placeholder: '08xx' },
  { key: 'bengkel_id', label: 'Bengkel', type: 'select-bengkel' },
  { key: 'expertise', label: 'Keahlian', type: 'text', placeholder: 'Mesin, Listrik...' },
  { key: 'experience_years', label: 'Pengalaman (tahun)', type: 'number', placeholder: '0' },
  { key: 'join_date', label: 'Tanggal Bergabung', type: 'date' },
  { key: 'status', label: 'Status', type: 'select-status' },
]

const stats = computed(() => [
  { label: 'Total Mekanik', value: mechanics.value.length, icon: UserGroupIcon },
  { label: 'Aktif', value: mechanics.value.filter(m => m.status === 'aktif').length, icon: CheckCircleIcon },
  { label: 'Cuti / Resign', value: mechanics.value.filter(m => m.status !== 'aktif').length, icon: ClockIcon },
])

const statusClass = (s) => ({ aktif: 'bg-green-500/20 text-green-400', cuti: 'bg-yellow-500/20 text-yellow-400', resigned: 'bg-red-500/20 text-red-400' }[s] || 'bg-gray-500/20 text-gray-400')

const fetchMechanics = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    const [mRes, bRes] = await Promise.all([
      axios.get('/api/mechanics', { headers }),
      axios.get('/api/bengkels', { headers })
    ])
    mechanics.value = mRes.data.data?.data || mRes.data.data || []
    bengkels.value = bRes.data.data?.data || bRes.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const storeMechanic = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.post('/api/mechanics', form.value, { headers: { Authorization: `Bearer ${token}` } })
    showModal.value = false
    form.value = { name: '', email: '', phone: '', bengkel_id: '', expertise: '', experience_years: '', join_date: '', status: 'aktif' }
    fetchMechanics()
  } catch (err) { console.error(err) }
}

const deleteMechanic = async (id) => {
  if (!confirm('Hapus mekanik ini?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`/api/mechanics/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    fetchMechanics()
  } catch (err) { console.error(err) }
}

onMounted(fetchMechanics)
</script>
