<template>
  <div>
    <!-- Hero + Greeting -->
    <div class="rounded-3xl p-10 mb-8" :style="{ background: `linear-gradient(135deg, var(--accent)20, transparent)`, border: `1px solid var(--accent)30` }">
      <div class="flex items-start justify-between">
        <div class="max-w-2xl">
          <p class="text-sm mb-2 font-medium" :style="{ color: `var(--accent)` }">{{ greeting }}, {{ userName }}! ðŸ‘‹</p>
          <h1 class="text-4xl font-bold mb-4" :style="{ color: `var(--text-primary)` }">
            Kendaraan Rusak? <br>
            <span :style="{ color: `var(--accent)` }">MECHA Siap Membantu!</span>
          </h1>
          <p class="text-lg mb-8" :style="{ color: `var(--text-secondary)` }">Temukan bengkel terdekat atau panggil mekanik langsung ke lokasi kamu. Cepat, terpercaya, dan transparan.</p>
          <div class="flex gap-4 flex-wrap">
            <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <BuildingStorefrontIcon class="w-5 h-5" /> Cari Bengkel
            </RouterLink>
            <RouterLink to="/customer/ai-diagnostic" class="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
              :style="{ border: `1px solid var(--accent)`, color: `var(--accent)` }">
              <CpuChipIcon class="w-5 h-5" /> AI Diagnostic
            </RouterLink>
          </div>
        </div>
        <div class="hidden md:block text-right">
          <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ currentDate }}</p>
          <p class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background-color: #f59e0b20;">
          <ClipboardDocumentListIcon class="w-6 h-6" style="color: #f59e0b;" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ orders.length }}</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Total Order</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background-color: #22c55e20;">
          <CheckCircleIcon class="w-6 h-6" style="color: #22c55e;" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ orders.filter(o => o.status === 'completed').length }}</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Order Selesai</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background-color: #3b82f620;">
          <ClockIcon class="w-6 h-6" style="color: #3b82f6;" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ orders.filter(o => o.status === 'in_progress').length }}</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Sedang Dikerjakan</p>
        </div>
      </div>
    </div>

    <!-- Fitur -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="f in fitur" :key="f.title" class="card text-center hover:scale-[1.02] transition-transform">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" :style="{ backgroundColor: f.bg }">
          <component :is="f.icon" class="w-7 h-7" :style="{ color: f.color }" />
        </div>
        <h3 class="font-semibold mb-2" :style="{ color: `var(--text-primary)` }">{{ f.title }}</h3>
        <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ f.desc }}</p>
      </div>
    </div>

    <!-- Order Terakhir -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Order Terakhir Saya
        </h2>
        <RouterLink to="/customer/order" class="text-sm flex items-center gap-1 hover:opacity-80" :style="{ color: `var(--accent)` }">
          Lihat semua <ChevronRightIcon class="w-4 h-4" />
        </RouterLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <TruckIcon class="w-16 h-16 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium mb-2" :style="{ color: `var(--text-primary)` }">Belum ada order servis</p>
        <p class="text-sm mb-4" :style="{ color: `var(--text-muted)` }">Mulai cari bengkel terpercaya sekarang</p>
        <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-2 rounded-xl inline-flex items-center gap-2">
          <BuildingStorefrontIcon class="w-4 h-4" /> Cari Bengkel
        </RouterLink>
      </div>

      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id"
          class="rounded-xl p-4 flex items-center gap-4"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: #f59e0b20;">
            <ClipboardDocumentListIcon class="w-5 h-5" style="color: #f59e0b;" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</p>
            <p class="text-xs mt-1 truncate" :style="{ color: `var(--text-secondary)` }">{{ order.vehicle?.license_plate }} â€¢ {{ order.bengkel?.name }}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(order.status)">{{ order.status }}</span>
            <p class="text-sm font-medium mt-1" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import {
  BuildingStorefrontIcon, MapPinIcon, CubeIcon, TruckIcon,
  ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon,
  ChevronRightIcon, CpuChipIcon, WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])
const currentTime = ref('')
const currentDate = ref('')
let timer = null

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name?.split(' ')[0] || 'Customer')
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID')
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const fitur = [
  { icon: MapPinIcon, title: 'Bengkel Terdekat', desc: 'Temukan bengkel terpercaya di sekitar lokasi kamu dengan mudah', bg: '#22c55e20', color: '#22c55e' },
  { icon: WrenchScrewdriverIcon, title: 'Mekanik Panggilan', desc: 'Mekanik profesional datang langsung ke lokasi kendaraan kamu', bg: '#f59e0b20', color: '#f59e0b' },
  { icon: CubeIcon, title: 'Sparepart Lengkap', desc: 'Sparepart yang digunakan akan ditentukan mekanik sesuai kebutuhan kendaraan kamu', bg: '#3b82f620', color: '#3b82f6' },
]

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v)

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const res = await axios.get('/api/orders')
    orders.value = res.data.data.data?.slice(0, 3) || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})

onUnmounted(() => clearInterval(timer))
</script>