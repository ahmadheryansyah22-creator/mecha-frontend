const fs = require('fs');

const content = `<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Stok Sparepart</h1>
        <p class="text-gray-400 mt-1">Kelola stok sparepart bengkel</p>
      </div>
      <button @click="showModal = true" class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
        <span>+</span> Tambah Sparepart
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <ArchiveBoxIcon class="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-white">{{ totalParts }}</p>
            <p class="text-gray-400 text-sm">Total Sparepart</p>
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
            <p class="text-gray-400 text-sm">Stok Menipis</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <BanknotesIcon class="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-400">Rp {{ formatRupiah(totalValue) }}</p>
            <p class="text-gray-400 text-sm">Total Nilai Stok</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 mb-6">
      <button
        v-for="f in filters" :key="f.value"
        @click="activeFilter = f.value"
        :class="activeFilter === f.value ? 'bg-yellow-400 text-black' : 'bg-[#1a1a1a] text-gray-400 border border-gray-700'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
      >
        <component :is="f.icon" class="w-4 h-4" />{{ f.label }}
      </button>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center py-8 text-gray-500">Memuat data...</div>
      <div v-else-if="filteredParts.length === 0" class="text-center py-8 text-gray-500">Belum ada data sparepart</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-800">
              <th class="text-left text-gray-400 text-sm pb-3">Nama</th>
              <th class="text-left text-gray-400 text-sm pb-3">Kategori</th>
              <th class="text-left text-gray-400 text-sm pb-3">Harga</th>
              <th class="text-left text-gray-400 text-sm pb-3">Stok</th>
              <th class="text-left text-gray-400 text-sm pb-3">Min. Stok</th>
              <th class="text-left text-gray-400 text-sm pb-3">Status</th>
              <th class="text-left text-gray-400 text-sm pb-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in filteredParts" :key="part.id"
              class="border-b border-gray-800/50 hover:bg-gray-800/20"
              :class="part.stock <= part.min_stock ? 'bg-red-500/5' : ''">
              <td class="py-3">
                <p class="text-white text-sm font-medium">{{ part.name }}</p>
                <p class="text-gray-500 text-xs">{{ part.code || '-' }} • {{ part.brand || '-' }}</p>
              </td>
              <td class="py-3 text-gray-400 text-sm">{{ part.category || '-' }}</td>
              <td class="py-3 text-yellow-400 text-sm font-medium">Rp {{ formatRupiah(part.price) }}</td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <span class="font-bold" :class="part.stock <= part.min_stock ? 'text-red-400' : 'text-white'">{{ part.stock }}</span>
                  <span class="text-gray-500 text-xs">{{ part.unit }}</span>
                  <ExclamationTriangleIcon v-if="part.stock <= part.min_stock" class="w-4 h-4 text-red-400" />
                </div>
              </td>
              <td class="py-3 text-gray-400 text-sm">{{ part.min_stock }}</td>
              <td class="py-3">
                <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(part.status)">{{ part.status }}</span>
              </td>
              <td class="py-3">
                <div class="flex gap-2">
                  <button @click="openUpdateStock(part)" class="text-yellow-400 hover:text-yellow-300 text-sm">Ubah Stok</button>
                  <button @click="deletePart(part.id)" class="text-red-400 hover:text-red-300 text-sm">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 w-full max-w-lg">
        <h2 class="text-lg font-semibold text-white mb-6">Tambah Sparepart</h2>
        <form @submit.prevent="storePart">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block text-gray-400 text-sm mb-2">Nama Sparepart</label><input v-model="form.name" type="text" class="input-field" required /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Kode</label><input v-model="form.code" type="text" class="input-field" /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Kategori</label>
              <select v-model="form.category" class="input-field">
                <option value="mesin">Mesin</option><option value="rem">Rem</option>
                <option value="kelistrikan">Kelistrikan</option><option value="bodi">Bodi</option>
                <option value="oli">Oli & Cairan</option><option value="ban">Ban & Velg</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div><label class="block text-gray-400 text-sm mb-2">Merek</label><input v-model="form.brand" type="text" class="input-field" /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Harga (Rp)</label><input v-model="form.price" type="number" class="input-field" required /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Stok Awal</label><input v-model="form.stock" type="number" class="input-field" required /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Min. Stok</label><input v-model="form.min_stock" type="number" class="input-field" /></div>
            <div><label class="block text-gray-400 text-sm mb-2">Satuan</label>
              <select v-model="form.unit" class="input-field">
                <option value="pcs">Pcs</option><option value="liter">Liter</option>
                <option value="set">Set</option><option value="meter">Meter</option>
              </select>
            </div>
            <div class="col-span-2"><label class="block text-gray-400 text-sm mb-2">Bengkel</label>
              <select v-model="form.bengkel_id" class="input-field" required>
                <option v-for="b in bengkels" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400">Batal</button>
            <button type="submit" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showStockModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 w-full max-w-sm">
        <h2 class="text-lg font-semibold text-white mb-2">Ubah Stok</h2>
        <p class="text-gray-400 text-sm mb-6">{{ selectedPart?.name }}</p>
        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-2">Stok Sekarang: <span class="text-white font-bold">{{ selectedPart?.stock }}</span></label>
          <div class="flex items-center gap-3">
            <button @click="stockChange--" class="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg font-bold text-lg">-</button>
            <input v-model="stockChange" type="number" class="input-field text-center font-bold text-xl" />
            <button @click="stockChange++" class="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg font-bold text-lg">+</button>
          </div>
          <p class="text-gray-500 text-xs mt-2">Stok baru: <span class="text-yellow-400 font-bold">{{ (selectedPart?.stock || 0) + parseInt(stockChange || 0) }}</span></p>
        </div>
        <div class="flex gap-3">
          <button @click="showStockModal = false" class="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400">Batal</button>
          <button @click="updateStock" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ArchiveBoxIcon, ExclamationTriangleIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const showModal = ref(false)
const showStockModal = ref(false)
const spareParts = ref([])
const bengkels = ref([])
const selectedPart = ref(null)
const stockChange = ref(0)
const activeFilter = ref('semua')

const filters = [
  { value: 'semua', label: 'Semua', icon: ArchiveBoxIcon },
  { value: 'tersedia', label: 'Tersedia', icon: CheckCircleIcon },
  { value: 'menipis', label: 'Stok Menipis', icon: ExclamationTriangleIcon },
  { value: 'habis', label: 'Habis', icon: XCircleIcon },
]

const form = ref({ bengkel_id: '', name: '', code: '', category: 'mesin', brand: '', price: '', stock: '', min_stock: 5, unit: 'pcs' })

const totalParts = computed(() => spareParts.value.length)
const lowStockParts = computed(() => spareParts.value.filter(p => p.stock <= p.min_stock).length)
const totalValue = computed(() => spareParts.value.reduce((sum, p) => sum + (p.price * p.stock), 0))

const filteredParts = computed(() => {
  if (activeFilter.value === 'semua') return spareParts.value
  if (activeFilter.value === 'menipis') return spareParts.value.filter(p => p.stock <= p.min_stock && p.stock > 0)
  return spareParts.value.filter(p => p.status === activeFilter.value)
})

const statusClass = (s) => ({ tersedia: 'bg-green-500/20 text-green-400', habis: 'bg-red-500/20 text-red-400', discontinue: 'bg-gray-500/20 text-gray-400' }[s] || 'bg-gray-500/20 text-gray-400')
const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const openUpdateStock = (part) => { selectedPart.value = part; stockChange.value = 0; showStockModal.value = true }

const updateStock = async () => {
  try {
    const newStock = (selectedPart.value.stock || 0) + parseInt(stockChange.value || 0)
    await axios.put(\`/api/spare-parts/\${selectedPart.value.id}\`, { stock: newStock })
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
  } catch (err) { console.error(err) } finally { loading.value = false }
}

const storePart = async () => {
  try { await axios.post('/api/spare-parts', form.value); showModal.value = false; fetchParts() }
  catch (err) { console.error(err) }
}

const deletePart = async (id) => {
  if (!confirm('Hapus sparepart ini?')) return
  try { await axios.delete(\`/api/spare-parts/\${id}\`); fetchParts() }
  catch (err) { console.error(err) }
}

onMounted(fetchParts)
</script>`;

fs.writeFileSync('src/views/SparePartView.vue', content, 'utf8');
console.log('✅ SparePartView.vue berhasil diupdate!');
