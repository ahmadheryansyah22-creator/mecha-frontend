<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <Squares2X2Icon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
          Dashboard
        </h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">{{ greeting }}, {{ userName }}! Berikut ringkasan bengkel kamu hari ini.</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ currentDate }}</p>
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card hover:scale-[1.02] transition-transform cursor-default">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{ backgroundColor: stat.bg }">
            <component :is="stat.icon" class="w-6 h-6" :style="{ color: stat.color }" />
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :style="{ backgroundColor: stat.bg, color: stat.color }">{{ stat.badge }}</span>
        </div>
        <p class="text-3xl font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
        <p class="text-sm mt-1" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Quick Actions -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <BoltIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Aksi Cepat
        </h2>
        <div class="space-y-2">
          <RouterLink v-for="action in quickActions" :key="action.path" :to="action.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-80"
            :style="{ backgroundColor: `var(--bg-primary)` }">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: action.bg }">
              <component :is="action.icon" class="w-4 h-4" :style="{ color: action.color }" />
            </div>
            <span class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ action.label }}</span>
            <ChevronRightIcon class="w-4 h-4 ml-auto" :style="{ color: `var(--text-muted)` }" />
          </RouterLink>
        </div>
      </div>

      <!-- Status Order -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ChartPieIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Status Order
        </h2>
        <div class="space-y-3">
          <div v-for="s in orderStatus" :key="s.label" class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: s.color }"></div>
            <span class="text-sm flex-1" :style="{ color: `var(--text-secondary)` }">{{ s.label }}</span>
            <span class="text-sm font-bold" :style="{ color: `var(--text-primary)` }">{{ s.value }}</span>
          </div>
          <div v-if="orders.length === 0" class="text-center py-4">
            <ChartPieIcon class="w-10 h-10 mx-auto mb-2" :style="{ color: `var(--text-muted)` }" />
            <p class="text-sm" :style="{ color: `var(--text-muted)` }">Belum ada data order</p>
          </div>
        </div>
      </div>

      <!-- Info Bengkel -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <InformationCircleIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Info Sistem
        </h2>
        <div class="space-y-3">
          <div v-for="info in systemInfo" :key="info.label" class="flex items-center justify-between p-3 rounded-xl" :style="{ backgroundColor: `var(--bg-primary)` }">
            <span class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ info.label }}</span>
            <span class="text-sm font-semibold px-2 py-0.5 rounded-lg" :style="{ backgroundColor: info.bg, color: info.color }">{{ info.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Terbaru -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-semibold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Order Terbaru
        </h2>
        <RouterLink to="/order" class="text-sm font-medium flex items-center gap-1" :style="{ color: `var(--accent)` }">
          Lihat semua <ChevronRightIcon class="w-4 h-4" />
        </RouterLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <ClipboardDocumentListIcon class="w-16 h-16 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium mb-1" :style="{ color: `var(--text-primary)` }">Belum ada order</p>
        <p class="text-sm mb-4" :style="{ color: `var(--text-muted)` }">Order baru akan muncul di sini</p>
        <RouterLink to="/order" class="btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
          <PlusIcon class="w-4 h-4" /> Buat Order Baru
        </RouterLink>
      </div>

      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id"
          class="flex items-center gap-4 p-4 rounded-xl transition-all hover:opacity-80"
          :style="{ backgroundColor: `var(--bg-primary)` }">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `#f59e0b20` }">
            <ClipboardDocumentListIcon class="w-5 h-5" style="color: #f59e0b" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate" :style="{ color: `var(--text-primary)` }">Order #{{ order.order_number || order.id }}</p>
            <p class="text-xs truncate" :style="{ color: `var(--text-muted)` }">{{ order.description || '-' }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.total_price) }}</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" :style="getStatusStyle(order.status)">{{ order.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import {
  Squares2X2Icon, BuildingStorefrontIcon, TruckIcon,
  ClipboardDocumentListIcon, BanknotesIcon, BoltIcon,
  ChevronRightIcon, ChartPieIcon, InformationCircleIcon,
  PlusIcon, WrenchIcon, CubeIcon, UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { InformationCircleIcon as InformationCircleIconSolid } from '@heroicons/vue/24/solid'

const loading = ref(true)
const orders = ref([])
const currentTime = ref('')
const currentDate = ref('')
let timer = null

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name || 'Admin')
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

const stats = ref([
  { label: 'Total Bengkel', value: 0, badge: 'Aktif', icon: BuildingStorefrontIcon, bg: '#22c55e20', color: '#22c55e' },
  { label: 'Total Kendaraan', value: 0, badge: 'Terdaftar', icon: TruckIcon, bg: '#3b82f620', color: '#3b82f6' },
  { label: 'Total Order', value: 0, badge: 'Bulan ini', icon: ClipboardDocumentListIcon, bg: '#f59e0b20', color: '#f59e0b' },
  { label: 'Total Transaksi', value: 'Rp 0', badge: 'Bulan ini', icon: BanknotesIcon, bg: '#a855f720', color: '#a855f7' },
])

const quickActions = [
  { label: 'Tambah Order', path: '/order', icon: ClipboardDocumentListIcon, bg: '#f59e0b20', color: '#f59e0b' },
  { label: 'Daftar Mekanik', path: '/daftar-mekanik', icon: WrenchIcon, bg: '#3b82f620', color: '#3b82f6' },
  { label: 'Stok Sparepart', path: '/sparepart', icon: CubeIcon, bg: '#22c55e20', color: '#22c55e' },
  { label: 'Data Kendaraan', path: '/kendaraan', icon: TruckIcon, bg: '#a855f720', color: '#a855f7' },
]

const orderStatus = ref([
  { label: 'Pending', value: 0, color: '#f59e0b' },
  { label: 'Sedang Dikerjakan', value: 0, color: '#3b82f6' },
  { label: 'Selesai', value: 0, color: '#22c55e' },
  { label: 'Dibatalkan', value: 0, color: '#ef4444' },
])

const systemInfo = ref([
  { label: 'Versi MECHA', value: 'v1.0.0', bg: '#22c55e20', color: '#22c55e' },
  { label: 'Status Server', value: 'Online', bg: '#22c55e20', color: '#22c55e' },
  { label: 'Database', value: 'Connected', bg: '#3b82f620', color: '#3b82f6' },
])

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const getStatusStyle = (status) => {
  const map = {
    pending: { backgroundColor: '#f59e0b20', color: '#f59e0b' },
    in_progress: { backgroundColor: '#3b82f620', color: '#3b82f6' },
    completed: { backgroundColor: '#22c55e20', color: '#22c55e' },
    cancelled: { backgroundColor: '#ef444420', color: '#ef4444' },
  }
  return map[status] || { backgroundColor: '#6b728020', color: '#6b7280' }
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const [bRes, vRes, oRes] = await Promise.all([
      axios.get('/api/bengkels'),
      axios.get('/api/vehicles'),
      axios.get('/api/orders'),
    ])
    stats.value[0].value = bRes.data.data?.total || 0
    stats.value[1].value = vRes.data.data?.total || 0
    stats.value[2].value = oRes.data.data?.total || 0
    const allOrders = oRes.data.data?.data || []
    orders.value = allOrders.slice(0, 5)
    orderStatus.value[0].value = allOrders.filter(o => o.status === 'pending').length
    orderStatus.value[1].value = allOrders.filter(o => o.status === 'in_progress').length
    orderStatus.value[2].value = allOrders.filter(o => o.status === 'completed').length
    orderStatus.value[3].value = allOrders.filter(o => o.status === 'cancelled').length
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => clearInterval(timer))
</script>