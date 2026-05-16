<template>
  <div class="animate-fadein">
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <MapPinIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Cari Bengkel & Mekanik
      </h1>
      <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Temukan bengkel atau mekanik panggilan terpercaya</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-5">
      <button v-for="t in types" :key="t.value" @click="activeType = t.value"
        class="px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
        :style="activeType === t.value
          ? { background: `linear-gradient(135deg, var(--accent), #d97706)`, color: `#000` }
          : { backgroundColor: `var(--bg-secondary)`, color: `var(--text-secondary)`, border: `1px solid var(--border-color)` }">
        <component :is="t.icon" class="w-4 h-4" />{{ t.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6" style="position:relative">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" :style="{ color: `var(--text-muted)` }" />
      <input v-model="search" type="text"
        :placeholder="activeType === 'bengkel' ? 'Cari nama bengkel atau kota...' : 'Cari nama atau keahlian mekanik...'"
        class="input-field" style="padding-left: 2.25rem;" />
    </div>

    <!-- Bengkel List -->
    <div v-if="activeType === 'bengkel'">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="i in 4" :key="i" class="card animate-pulse">
          <div class="h-4 rounded mb-3" :style="{ backgroundColor: `var(--border-color)` }"></div>
          <div class="h-3 rounded w-2/3 mb-2" :style="{ backgroundColor: `var(--border-color)` }"></div>
          <div class="h-3 rounded w-1/2" :style="{ backgroundColor: `var(--border-color)` }"></div>
        </div>
      </div>
      <div v-else-if="filteredBengkels.length === 0" class="text-center py-16 card">
        <BuildingStorefrontIcon class="w-14 h-14 mx-auto mb-4 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium" :style="{ color: `var(--text-primary)` }">Tidak ada bengkel ditemukan</p>
        <p class="text-sm mt-1" :style="{ color: `var(--text-muted)` }">Coba kata kunci lain</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="b in filteredBengkels" :key="b.id"
          class="card hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style="background:linear-gradient(135deg,#f59e0b,#d97706)">
              <BuildingStorefrontIcon class="w-6 h-6 text-white" />
            </div>
            <span class="text-xs px-2 py-1 rounded-full font-medium"
              :class="b.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
              {{ b.status }}
            </span>
          </div>
          <h3 class="font-semibold mb-1" :style="{ color: `var(--text-primary)` }">{{ b.name }}</h3>
          <p class="text-xs mb-1 flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
            <MapPinIcon class="w-3 h-3 shrink-0" /> {{ b.city }}, {{ b.province }}
          </p>
          <p class="text-xs mb-2 flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
            <PhoneIcon class="w-3 h-3 shrink-0" /> {{ b.phone }}
          </p>
          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs px-2 py-1 rounded-full flex items-center gap-1" style="background:#f5c51820;color:#f5c518">
              ⭐ 4.8
            </span>
            <span class="text-xs px-2 py-1 rounded-full" style="background:#22c55e20;color:#22c55e">
              Buka 24 Jam
            </span>
          </div>
          <div class="flex items-center justify-between pt-3" :style="{ borderTop: `1px solid var(--border-color)` }">
            <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ b.owner_name }}</p>
            <button @click="pilihBengkel(b)"
              class="btn-primary px-4 py-2 rounded-xl text-xs font-semibold hover:scale-105 transition-transform">
              Pilih Bengkel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mekanik List -->
    <div v-if="activeType === 'mekanik'">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="i in 4" :key="i" class="card animate-pulse">
          <div class="flex gap-3 mb-3">
            <div class="w-14 h-14 rounded-2xl" :style="{ backgroundColor: `var(--border-color)` }"></div>
            <div class="flex-1">
              <div class="h-4 rounded mb-2" :style="{ backgroundColor: `var(--border-color)` }"></div>
              <div class="h-3 rounded w-2/3" :style="{ backgroundColor: `var(--border-color)` }"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="filteredMechanics.length === 0" class="text-center py-16 card">
        <WrenchScrewdriverIcon class="w-14 h-14 mx-auto mb-4 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium" :style="{ color: `var(--text-primary)` }">Tidak ada mekanik ditemukan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="m in filteredMechanics" :key="m.id"
          class="card hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style="background:linear-gradient(135deg,#f59e0b,#d97706)">
              <span class="text-black font-bold text-xl">{{ m.name?.[0] }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold truncate" :style="{ color: `var(--text-primary)` }">{{ m.name }}</h3>
              <p class="text-xs mt-0.5" :style="{ color: `var(--text-secondary)` }">{{ m.expertise || 'Mekanik Umum' }}</p>
              <p class="text-xs mt-0.5" :style="{ color: `var(--text-muted)` }">{{ m.experience_years || 0 }} tahun pengalaman</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full shrink-0"
              :class="m.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'">
              {{ m.status }}
            </span>
          </div>
          <p class="text-xs mb-4 flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
            <BuildingStorefrontIcon class="w-3 h-3 shrink-0" /> {{ m.bengkel?.name || 'Mekanik Panggilan' }}
          </p>
          <button @click="pilihMekanik(m)"
            class="w-full btn-primary py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.02] transition-transform">
            Panggil Mekanik
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Order -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-6 w-full max-w-lg animate-fadein"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="text-lg font-semibold" :style="{ color: `var(--text-primary)` }">Buat Order Servis</h2>
            <p class="text-xs mt-1 flex items-center gap-1" :style="{ color: `var(--text-muted)` }">
              <BuildingStorefrontIcon v-if="selectedBengkel" class="w-3 h-3" />
              <WrenchScrewdriverIcon v-else class="w-3 h-3" />
              {{ selectedBengkel ? selectedBengkel.name : selectedMekanik?.name }}
            </p>
          </div>
          <button @click="showModal = false"
            class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all"
            :style="{ color: `var(--text-muted)` }">âœ•</button>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-xl text-xs flex items-center gap-2"
          style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#ef4444">
          âš ï¸ {{ error }}
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium mb-1.5" :style="{ color: `var(--text-secondary)` }">Plat Nomor</label>
            <input v-model="orderForm.license_plate" type="text" placeholder="B 1234 XYZ" class="input-field text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium mb-1.5" :style="{ color: `var(--text-secondary)` }">Merek</label>
              <input v-model="orderForm.brand" type="text" placeholder="Toyota" class="input-field text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" :style="{ color: `var(--text-secondary)` }">Model</label>
              <input v-model="orderForm.model" type="text" placeholder="Avanza" class="input-field text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium mb-1.5" :style="{ color: `var(--text-secondary)` }">Keluhan Kendaraan</label>
            <textarea v-model="orderForm.description" class="input-field text-sm" rows="3"
              placeholder="Jelaskan keluhan kendaraan kamu..."></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium mb-1.5" :style="{ color: `var(--text-secondary)` }">Prioritas</label>
            <select v-model="orderForm.priority" class="input-field text-sm">
              <option value="low">Normal</option>
              <option value="medium">Segera</option>
              <option value="high">Mendesak</option>
              <option value="urgent">Darurat</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="showModal = false"
              class="flex-1 py-2.5 rounded-xl text-sm transition-all"
              :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
            <button @click="buatOrder" :disabled="submitting"
              class="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-50">
              {{ submitting ? 'Memproses...' : 'Buat Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { BuildingStorefrontIcon, WrenchScrewdriverIcon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(true)
const showModal = ref(false)
const submitting = ref(false)
const error = ref('')
const search = ref('')
const activeType = ref('bengkel')
const bengkels = ref([])
const mechanics = ref([])
const selectedBengkel = ref(null)
const selectedMekanik = ref(null)

const types = [
  { value: 'bengkel', icon: BuildingStorefrontIcon, label: 'Bengkel' },
  { value: 'mekanik', icon: WrenchScrewdriverIcon, label: 'Mekanik Panggilan' },
]

const orderForm = ref({ license_plate: '', brand: '', model: '', description: '', priority: 'medium' })

const filteredBengkels = computed(() => bengkels.value.filter(b =>
  b.name?.toLowerCase().includes(search.value.toLowerCase()) ||
  b.city?.toLowerCase().includes(search.value.toLowerCase())
))

const filteredMechanics = computed(() => mechanics.value.filter(m =>
  m.name?.toLowerCase().includes(search.value.toLowerCase()) ||
  (m.expertise || '').toLowerCase().includes(search.value.toLowerCase())
))

const pilihBengkel = (b) => { selectedBengkel.value = b; selectedMekanik.value = null; showModal.value = true }
const pilihMekanik = (m) => { selectedMekanik.value = m; selectedBengkel.value = null; showModal.value = true }

const buatOrder = async () => {
  submitting.value = true
  error.value = ''
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const bengkelId = selectedBengkel.value?.id || selectedMekanik.value?.bengkel_id
    const mekanikId = selectedMekanik.value?.id || null
    const vehicleRes = await axios.post('/api/vehicles', {
      bengkel_id: bengkelId, license_plate: orderForm.value.license_plate,
      owner_name: user.name, owner_phone: user.phone || '-',
      vehicle_type: 'Mobil', brand: orderForm.value.brand,
      model: orderForm.value.model, year: new Date().getFullYear(), status: 'aktif'
    })
    const vehicleId = vehicleRes.data.data.id
    await axios.post('/api/orders', {
      bengkel_id: bengkelId, vehicle_id: vehicleId, mechanic_id: mekanikId,
      order_number: 'ORD-' + Date.now(), description: orderForm.value.description,
      total_price: 0, final_price: 0, status: 'pending', priority: orderForm.value.priority
    })
    showModal.value = false
    router.push('/customer/order')
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal membuat order'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const [bRes, mRes] = await Promise.all([axios.get('/api/bengkels'), axios.get('/api/mechanics')])
    bengkels.value = bRes.data.data?.data || bRes.data.data || []
    mechanics.value = mRes.data.data?.data || mRes.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})
</script>


