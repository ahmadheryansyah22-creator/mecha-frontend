<template>
  <div class="animate-fadein">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
          <Squares2X2Icon class="w-7 h-7" :style="{ color: 'var(--accent)' }" />
          Dashboard
        </h1>
        <p class="mt-1 text-sm" :style="{ color: 'var(--text-secondary)' }">
          Selamat {{ greeting }}, {{ userName }}! Berikut ringkasan bengkel kamu hari ini.
        </p>
      </div>
      <div class="text-right hidden md:block">
        <p class="font-semibold text-sm" :style="{ color: 'var(--text-primary)' }">{{ currentDate }}</p>
        <p class="text-xs mt-1" :style="{ color: 'var(--text-muted)' }">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center" :style="{ background: stat.gradient }">
            <component :is="stat.icon" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :style="{ backgroundColor: stat.badgeBg, color: stat.badgeColor }">
            {{ stat.badge }}
          </span>
        </div>
        <p class="text-2xl font-bold mb-1" :style="{ color: 'var(--text-primary)' }">{{ stat.value }}</p>
        <p class="text-xs" :style="{ color: 'var(--text-secondary)' }">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Grid Bawah -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Aksi Cepat -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <BoltIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Aksi Cepat
        </h2>
        <div class="space-y-2">
          <RouterLink v-for="a in quickActions" :key="a.path" :to="a.path"
            class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:opacity-80 group"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ background: a.gradient }">
              <component :is="a.icon" class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-medium flex-1" :style="{ color: 'var(--text-primary)' }">{{ a.label }}</span>
            <ChevronRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" :style="{ color: 'var(--text-muted)' }" />
          </RouterLink>
        </div>
      </div>

      <!-- Status Order -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <ChartPieIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Status Order
        </h2>
        <div class="space-y-3">
          <div v-for="s in orderStatus" :key="s.label" class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: s.color }"></div>
            <span class="text-sm flex-1" :style="{ color: 'var(--text-secondary)' }">{{ s.label }}</span>
            <span class="text-sm font-bold" :style="{ color: 'var(--text-primary)' }">{{ s.value }}</span>
          </div>
        </div>
        <!-- Mini chart bar -->
        <div class="mt-4 flex gap-1 h-2">
          <div v-for="s in orderStatus" :key="s.label"
            class="rounded-full transition-all"
            :style="{ backgroundColor: s.color, flex: Math.max(s.value, 0.5) }">
          </div>
        </div>
      </div>

      <!-- Info Sistem -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <InformationCircleIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Info Sistem
        </h2>
        <div class="space-y-3">
          <div v-for="info in sysInfo" :key="info.label"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <span class="text-xs" :style="{ color: 'var(--text-secondary)' }">{{ info.label }}</span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :style="{ backgroundColor: info.bg, color: info.color }">
              {{ info.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Terbaru -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-semibold flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Order Terbaru
        </h2>
        <RouterLink to="/order" class="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-all" :style="{ color: 'var(--accent)' }">
          Lihat semua <ChevronRightIcon class="w-3 h-3" />
        </RouterLink>
      </div>
      <div v-if="loading" class="text-center py-8">
        <div class="w-6 h-6 border-2 rounded-full animate-spin mx-auto" :style="{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }"></div>
      </div>
      <div v-else-if="orders.length === 0" class="text-center py-10">
        <ClipboardDocumentListIcon class="w-12 h-12 mx-auto mb-3 opacity-20" :style="{ color: 'var(--text-muted)' }" />
        <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Belum ada order</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="order in orders" :key="order.id"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:opacity-80"
          :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <ClipboardDocumentListIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">#{{ order.id }}</p>
            <p class="text-xs truncate" :style="{ color: 'var(--text-muted)' }">{{ order.status }}</p>
          </div>
          <p class="text-sm font-semibold shrink-0" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(order.total_price) }}</p>
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
  WrenchIcon, CubeIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])
const currentTime = ref('')
const currentDate = ref('')
let timer = null

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name?.split(' ')[0] || 'Admin')
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'pagi'
  if (h < 15) return 'siang'
  if (h < 18) return 'sore'
  return 'malam'
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID')
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const stats = ref([
  { label: 'Total Bengkel', value: 0, badge: 'Aktif', icon: BuildingStorefrontIcon, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', badgeBg: '#22c55e20', badgeColor: '#22c55e' },
  { label: 'Total Kendaraan', value: 0, badge: 'Terdaftar', icon: TruckIcon, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', badgeBg: '#3b82f620', badgeColor: '#3b82f6' },
  { label: 'Total Order', value: 0, badge: 'Bulan ini', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', badgeBg: '#f59e0b20', badgeColor: '#f59e0b' },
  { label: 'Total Transaksi', value: 'Rp 0', badge: 'Bulan ini', icon: BanknotesIcon, gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', badgeBg: '#a855f720', badgeColor: '#a855f7' },
])

const orderStatus = ref([
  { label: 'Pending', value: 0, color: '#f59e0b' },
  { label: 'Dikerjakan', value: 0, color: '#3b82f6' },
  { label: 'Selesai', value: 0, color: '#22c55e' },
  { label: 'Dibatalkan', value: 0, color: '#ef4444' },
])

const quickActions = [
  { label: 'Tambah Order', path: '/order', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { label: 'Daftar Mekanik', path: '/mekanik', icon: WrenchIcon, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { label: 'Stok Sparepart', path: '/sparepart', icon: CubeIcon, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
]

const sysInfo = [
  { label: 'Versi MECHA', value: 'v1.0.0', bg: '#22c55e20', color: '#22c55e' },
  { label: 'Status Server', value: 'Online', bg: '#3b82f620', color: '#3b82f6' },
  { label: 'Database', value: 'Connected', bg: '#a855f720', color: '#a855f7' },
]

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

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
    orders.value = oRes.data.data?.data?.slice(0, 5) || []
    orderStatus.value[0].value = orders.value.filter(o => o.status === 'pending').length
    orderStatus.value[1].value = orders.value.filter(o => o.status === 'in_progress').length
    orderStatus.value[2].value = orders.value.filter(o => o.status === 'completed').length
    orderStatus.value[3].value = orders.value.filter(o => o.status === 'cancelled').length
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => clearInterval(timer))
</script>