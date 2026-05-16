<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">Cari Bengkel & Mekanik</h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Temukan bengkel atau mekanik panggilan terpercaya</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-3 mb-6">
      <button
        v-for="t in types" :key="t.value"
        @click="activeType = t.value"
        class="px-5 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
        :style="activeType === t.value
          ? { backgroundColor: `var(--accent)`, color: `#000` }
          : { backgroundColor: `var(--bg-card)`, color: `var(--text-secondary)`, border: `1px solid var(--border-color)` }"
      >
        <component :is="t.icon" class="w-4 h-4" />
        {{ t.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input v-model="search" type="text" placeholder="Cari nama bengkel atau kota..." class="input-field" />
    </div>

    <!-- List Bengkel -->
    <div v-if="activeType === 'bengkel'">
      <div v-if="loading" class="text-center py-12" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="filteredBengkels.length === 0" class="text-center py-12">
        <BuildingStorefrontIcon class="w-14 h-14 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-secondary)` }">Tidak ada bengkel ditemukan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="b in filteredBengkels" :key="b.id" class="card hover:border-yellow-400/50 transition-all cursor-pointer">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
              <BuildingStorefrontIcon class="w-6 h-6" :style="{ color: `var(--accent)` }" />
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="b.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
              {{ b.status }}
            </span>
          </div>
          <h3 class="font-semibold mb-1" :style="{ color: `var(--text-primary)` }">{{ b.name }}</h3>
          <p class="text-sm mb-1 flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
            <MapPinIcon class="w-3 h-3" /> {{ b.city }}, {{ b.province }}
          </p>
          <p class="text-sm mb-4 flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
            <PhoneIcon class="w-3 h-3" /> {{ b.phone }}
          </p>
          <div class="flex items-center justify-between">
            <p class="text-xs" :style="{ color: `var(--text-muted)` }">Pemilik: {{ b.owner_name }}</p>
            <button @click="pilihBengkel(b)" class="btn-primary px-4 py-2 rounded-lg text-sm">Pilih Bengkel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- List Mekanik -->
    <div v-if="activeType === 'mekanik'">
      <div v-if="loading" class="text-center py-12" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="filteredMechanics.length === 0" class="text-center py-12">
        <WrenchScrewdriverIcon class="w-14 h-14 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-secondary)` }">Tidak ada mekanik ditemukan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="m in filteredMechanics" :key="m.id" class="card hover:border-yellow-400/50 transition-all">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
              <span class="text-black font-bold text-xl">{{ m.name[0] }}</span>
            </div>
            <div>
              <h3 class="font-semibold" :style="{ color: `var(--text-primary)` }">{{ m.name }}</h3>
              <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ m.expertise || 'Mekanik Umum' }}</p>
              <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ m.experience_years || 0 }} tahun pengalaman</p>
            </div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm flex items-center gap-1" :style="{ color: `var(--text-secondary)` }">
              <BuildingStorefrontIcon class="w-3 h-3" /> {{ m.bengkel?.name || 'Mekanik Panggilan' }}
            </p>
            <span class="text-xs px-2 py-1 rounded-full" :class="m.status === 'aktif' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'">
              {{ m.status }}
            </span>
          </div>
          <button @click="pilihMekanik(m)" class="w-full btn-primary py-2 rounded-lg text-sm">Panggil Mekanik</button>
        </div>
      </div>
    </div>

    <!-- Modal Order -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-lg" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-2" :style="{ color: `var(--text-primary)` }">Buat Order Servis</h2>
        <p class="text-sm mb-6 flex items-center gap-2" :style="{ color: `var(--text-secondary)` }">
          <BuildingStorefrontIcon v-if="selectedBengkel" class="w-4 h-4" />
          <WrenchScrewdriverIcon v-else class="w-4 h-4" />
          {{ selectedBengkel ? selectedBengkel.name : selectedMekanik?.name }}
        </p>

        <div v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">{{ error }}</div>

        <div>
          <div class="mb-4">
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Plat Nomor Kendaraan</label>
            <input v-model="orderForm.license_plate" type="text" placeholder="B 1234 XYZ" class="input-field" />
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Merek</label>
              <input v-model="orderForm.brand" type="text" placeholder="Toyota" class="input-field" />
            </div>
            <div>
              <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Model</label>
              <input v-model="orderForm.model" type="text" placeholder="Avanza" class="input-field" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Keluhan Kendaraan</label>
            <textarea v-model="orderForm.description" class="input-field" rows="3" placeholder="Jelaskan keluhan kendaraan kamu..."></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Prioritas</label>
            <select v-model="orderForm.priority" class="input-field">
              <option value="low">Normal</option>
              <option value="medium">Segera</option>
              <option value="high">Mendesak</option>
              <option value="urgent">Darurat</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 py-3 rounded-lg text-sm transition-all"
              :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
            <button @click="buatOrder" :disabled="submitting" class="flex-1 btn-primary py-3 rounded-lg">
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
import {
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/vue/24/outline'

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

const filteredBengkels = computed(() =>
  bengkels.value.filter(b =>
    b.name.toLowerCase().includes(search.value.toLowerCase()) ||
    b.city.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredMechanics = computed(() =>
  mechanics.value.filter(m =>
    m.name.toLowerCase().includes(search.value.toLowerCase()) ||
    (m.expertise || '').toLowerCase().includes(search.value.toLowerCase())
  )
)

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
      bengkel_id: bengkelId,
      license_plate: orderForm.value.license_plate,
      owner_name: user.name,
      owner_phone: user.phone || '-',
      vehicle_type: 'Mobil',
      brand: orderForm.value.brand,
      model: orderForm.value.model,
      year: new Date().getFullYear(),
      status: 'aktif'
    })
    const vehicleId = vehicleRes.data.data.id
    await axios.post('/api/orders', {
      bengkel_id: bengkelId,
      vehicle_id: vehicleId,
      mechanic_id: mekanikId,
      order_number: 'ORD-' + Date.now(),
      description: orderForm.value.description,
      total_price: 0,
      final_price: 0,
      status: 'pending',
      priority: orderForm.value.priority
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
    bengkels.value = bRes.data.data.data || []
    mechanics.value = mRes.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})
</script>
