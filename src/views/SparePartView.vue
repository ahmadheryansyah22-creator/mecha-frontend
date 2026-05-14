<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">Stok Sparepart</h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola stok sparepart bengkel</p>
      </div>
      <button @click="showModal = true" class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusIcon class="w-4 h-4" /> Tambah Sparepart
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <CubeIcon class="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ totalParts }}</p>
            <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Total Sparepart</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-red-400">{{ lowStockParts }}</p>
            <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Stok Menipis</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <BanknotesIcon class="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p class="text-2xl font-bold" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(totalValue) }}</p>
            <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Total Nilai Stok</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-3 mb-6">
      <button
        v-for="f in filters" :key="f.value"
        @click="activeFilter = f.value"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        :style="activeFilter === f.value
          ? { backgroundColor: `var(--accent)`, color: `#000` }
          : { backgroundColor: `var(--bg-card)`, color: `var(--text-secondary)`, border: `1px solid var(--border-color)` }"
      >
        <component :is="f.icon" class="w-4 h-4" />
        {{ f.label }}
      </button>
    </div>

    <!-- Table -->
    <div class="card">
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="filteredParts.length === 0" class="text-center py-8" :style="{ color: `var(--text-muted)` }">
        Belum ada data sparepart
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr :style="{ borderBottom: `1px solid var(--border-color)` }">
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Nama</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Kategori</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Harga</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Stok</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Min. Stok</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Status</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="part in filteredParts" :key="part.id"
              :style="{ borderBottom: `1px solid var(--border-color)` }"
              class="transition-all"
            >
              <td class="py-3">
                <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ part.name }}</p>
                <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ part.code || '-' }} • {{ part.brand || '-' }}</p>
              </td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ part.category || '-' }}</td>
              <td class="py-3 text-sm font-medium" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(part.price) }}</td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm" :class="part.stock <= part.min_stock ? 'text-red-400' : ''" :style="part.stock > part.min_stock ? { color: `var(--text-primary)` } : {}">
                    {{ part.stock }}
                  </span>
                  <span class="text-xs" :style="{ color: `var(--text-muted)` }">{{ part.unit }}</span>
                  <ExclamationTriangleIcon v-if="part.stock <= part.min_stock" class="w-4 h-4 text-red-400" />
                </div>
              </td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ part.min_stock }}</td>
              <td class="py-3">
                <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(part.status)">{{ part.status }}</span>
              </td>
              <td class="py-3">
                <div class="flex gap-2">
                  <button @click="openUpdateStock(part)" class="text-sm font-medium" :style="{ color: `var(--accent)` }">Ubah Stok</button>
                  <button @click="deletePart(part.id)" class="text-sm font-medium text-red-400">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-lg" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-6" :style="{ color: `var(--text-primary)` }">Tambah Sparepart</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Sparepart</label>
            <input v-model="form.name" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Kode</label>
            <input v-model="form.code" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Kategori</label>
            <select v-model="form.category" class="input-field">
              <option value="mesin">Mesin</option>
              <option value="rem">Rem</option>
              <option value="kelistrikan">Kelistrikan</option>
              <option value="bodi">Bodi</option>
              <option value="oli">Oli & Cairan</option>
              <option value="ban">Ban & Velg</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Merek</label>
            <input v-model="form.brand" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Harga (Rp)</label>
            <input v-model="form.price" type="number" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Stok Awal</label>
            <input v-model="form.stock" type="number" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Min. Stok</label>
            <input v-model="form.min_stock" type="number" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Satuan</label>
            <select v-model="form.unit" class="input-field">
              <option value="pcs">Pcs</option>
              <option value="liter">Liter</option>
              <option value="set">Set</option>
              <option value="meter">Meter</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Bengkel</label>
            <select v-model="form.bengkel_id" class="input-field">
              <option v-for="b in bengkels" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 py-3 rounded-lg text-sm transition-all"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="storePart" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Modal Update Stok -->
    <div v-if="showStockModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-sm" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-2" :style="{ color: `var(--text-primary)` }">Ubah Stok</h2>
        <p class="text-sm mb-6" :style="{ color: `var(--text-secondary)` }">{{ selectedPart?.name }}</p>
        <div class="mb-6">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">
            Stok Sekarang: <span class="font-bold" :style="{ color: `var(--text-primary)` }">{{ selectedPart?.stock }}</span>
          </label>
          <div class="flex items-center gap-3">
            <button @click="stockChange--" class="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg font-bold text-lg">-</button>
            <input v-model="stockChange" type="number" class="input-field text-center font-bold text-xl" />
            <button @click="stockChange++" class="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg font-bold text-lg">+</button>
          </div>
          <p class="text-xs mt-2" :style="{ color: `var(--text-muted)` }">
            Stok baru: <span class="font-bold" :style="{ color: `var(--accent)` }">{{ (selectedPart?.stock || 0) + parseInt(stockChange || 0) }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="showStockModal = false" class="flex-1 py-3 rounded-lg text-sm"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="updateStock" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  CubeIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const showModal = ref(false)
const showStockModal = ref(false)
const spareParts = ref([])
const bengkels = ref([])
const selectedPart = ref(null)
const stockChange = ref(0)
const activeFilter = ref('semua')

const filters = [
  { value: 'semua', icon: CubeIcon, label: 'Semua' },
  { value: 'tersedia', icon: CheckCircleIcon, label: 'Tersedia' },
  { value: 'menipis', icon: ExclamationTriangleIcon, label: 'Stok Menipis' },
  { value: 'habis', icon: XCircleIcon, label: 'Habis' },
]

const form = ref({
  bengkel_id: '', name: '', code: '', category: 'mesin',
  brand: '', price: '', stock: '', min_stock: 5, unit: 'pcs'
})

const totalParts = computed(() => spareParts.value.length)
const lowStockParts = computed(() => spareParts.value.filter(p => p.stock <= p.min_stock).length)
const totalValue = computed(() => spareParts.value.reduce((sum, p) => sum + (p.price * p.stock), 0))

const filteredParts = computed(() => {
  if (activeFilter.value === 'semua') return spareParts.value
  if (activeFilter.value === 'menipis') return spareParts.value.filter(p => p.stock <= p.min_stock && p.stock > 0)
  return spareParts.value.filter(p => p.status === activeFilter.value)
})

const statusClass = (s) => ({
  tersedia: 'bg-green-500/20 text-green-400',
  habis: 'bg-red-500/20 text-red-400',
  discontinue: 'bg-gray-500/20 text-gray-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const openUpdateStock = (part) => {
  selectedPart.value = part
  stockChange.value = 0
  showStockModal.value = true
}

const updateStock = async () => {
  try {
    const newStock = (selectedPart.value.stock || 0) + parseInt(stockChange.value || 0)
    await axios.put(`/api/spare-parts/${selectedPart.value.id}`, { stock: newStock })
    showStockModal.value = false
    fetchParts()
  } catch (err) { console.error(err) }
}

const fetchParts = async () => {
  loading.value = true
  try {
    const [pRes, bRes] = await Promise.all([axios.get('/api/spare-parts'), axios.get('/api/bengkels')])
    spareParts.value = pRes.data.data.data || []
    bengkels.value = bRes.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const storePart = async () => {
  try {
    await axios.post('/api/spare-parts', form.value)
    showModal.value = false
    fetchParts()
  } catch (err) { console.error(err) }
}

const deletePart = async (id) => {
  if (!confirm('Hapus sparepart ini?')) return
  try {
    await axios.delete(`/api/spare-parts/${id}`)
    fetchParts()
  } catch (err) { console.error(err) }
}

onMounted(fetchParts)
</script>
