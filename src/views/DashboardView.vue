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
        <p class="text-2xl font-bold mt-1 tabular-nums" :style="{ color: 'var(--accent)' }">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="stat-card hover:scale-[1.02] transition-all duration-300">
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

    <!-- Grid Tengah -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      <!-- Statistik Bulan Ini -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <CalendarDaysIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" />
          Statistik Bulan Ini
          <span class="ml-auto text-xs px-2 py-0.5 rounded-full" :style="{ backgroundColor: 'var(--accent)20', color: 'var(--accent)' }">{{ currentMonth }}</span>
        </h2>
        <div class="space-y-3">
          <div v-for="s in bulananStats" :key="s.label">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs" :style="{ color: 'var(--text-secondary)' }">{{ s.label }}</span>
              <span class="text-xs font-bold" :style="{ color: s.color }">{{ s.display }}</span>
            </div>
            <div class="h-1.5 rounded-full overflow-hidden" :style="{ backgroundColor: 'var(--bg-primary)' }">
              <div class="h-full rounded-full transition-all duration-700"
                :style="{ width: s.pct + '%', backgroundColor: s.color }"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 flex items-center justify-between" :style="{ borderTop: '1px solid var(--border-color)' }">
          <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Total Transaksi Bulan Ini</span>
          <span class="text-sm font-bold" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(totalTransaksiBulan) }}</span>
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
        <div class="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
          <div v-for="s in orderStatus" :key="s.label"
            class="rounded-full transition-all duration-500"
            :style="{ backgroundColor: s.color, flex: Math.max(s.value, 0.5) }">
          </div>
        </div>
      </div>

      <!-- Ringkasan Bengkel -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <BuildingStorefrontIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Ringkasan Bengkel
        </h2>
        <div class="space-y-3">
          <div v-for="info in ringkasanBengkel" :key="info.label"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="flex items-center gap-2">
              <component :is="info.icon" class="w-4 h-4 shrink-0" :style="{ color: info.color }" />
              <span class="text-xs" :style="{ color: 'var(--text-secondary)' }">{{ info.label }}</span>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :style="{ backgroundColor: info.bg, color: info.color }">{{ info.value }}</span>
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
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <ClipboardDocumentListIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">#{{ order.id }}</p>
            <p class="text-xs truncate" :style="{ color: 'var(--text-muted)' }">{{ order.created_at?.slice(0,10) }}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-xs px-2 py-1 rounded-full font-medium" :class="statusClass(order.status)">{{ order.status }}</span>
            <p class="text-xs font-semibold mt-1" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(order.total_price) }}</p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Tips & Checklist -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <BoltIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Tips Kelola Bengkel
        </h2>
        <div class="space-y-3">
          <div v-for="tip in tips" :key="tip.title" class="flex items-start gap-3 p-3 rounded-xl" :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :style="{ background: tip.gradient }">
              <component :is="tip.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium" :style="{ color: 'var(--text-primary)' }">{{ tip.title }}</p>
              <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ tip.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Checklist Harian
        </h2>
        <div class="space-y-2">
          <div v-for="(item, i) in checklist" :key="i" @click="item.done = !item.done"
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-all"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              :style="item.done ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border-color)' }">
              <CheckCircleIcon v-if="item.done" class="w-3 h-3 text-black" />
            </div>
            <span class="text-sm flex-1" :style="{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }">{{ item.label }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" :style="item.done ? { backgroundColor: '#22c55e20', color: '#22c55e' } : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }">{{ item.done ? 'Selesai' : 'Belum' }}</span>
          </div>
        </div>
        <div class="mt-3 pt-3" :style="{ borderTop: '1px solid var(--border-color)' }">
          <div class="flex justify-between text-xs mb-1.5">
            <span :style="{ color: 'var(--text-muted)' }">Progress</span>
            <span class="font-bold" :style="{ color: 'var(--accent)' }">{{ checklist.filter(c => c.done).length }}/{{ checklist.length }}</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden" :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: (checklist.filter(c => c.done).length / checklist.length * 100) + '%', backgroundColor: 'var(--accent)' }"></div>
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
  Squares2X2Icon,
  BoltIcon,
  CpuChipIcon, BuildingStorefrontIcon, TruckIcon,
  ClipboardDocumentListIcon, BanknotesIcon, ChevronRightIcon,
  ChartPieIcon, WrenchIcon, CubeIcon, CalendarDaysIcon,
  CheckCircleIcon, ClockIcon, UserGroupIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])
const allOrders = ref([])
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

const currentMonth = computed(() => new Date().toLocaleDateString('id-ID', { month: 'long' }))

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID')
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const ordersBulanIni = computed(() => {
  const now = new Date()
  return allOrders.value.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
})

const totalTransaksiBulan = computed(() =>
  ordersBulanIni.value.filter(o => o.status === 'selesai' || o.status === 'completed')
    .reduce((s, o) => s + (o.total_price || 0), 0)
)

const bulananStats = computed(() => {
  const total = ordersBulanIni.value.length
  const selesai = ordersBulanIni.value.filter(o => o.status === 'selesai' || o.status === 'completed').length
  const proses = ordersBulanIni.value.filter(o => o.status === 'proses' || o.status === 'in_progress').length
  return [
    { label: 'Order Masuk', display: total, pct: Math.min(total * 5, 100), color: '#f59e0b' },
    { label: 'Order Selesai', display: selesai, pct: total ? Math.round(selesai / total * 100) : 0, color: '#22c55e' },
    { label: 'Sedang Dikerjakan', display: proses, pct: Math.min(proses * 10, 100), color: '#3b82f6' },
    { label: 'Tingkat Selesai', display: (total ? Math.round(selesai / total * 100) : 0) + '%', pct: total ? Math.round(selesai / total * 100) : 0, color: '#a855f7' },
  ]
})

const stats = ref([
  { label: 'Total Bengkel', value: 0, badge: 'Aktif', icon: BuildingStorefrontIcon, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', badgeBg: '#22c55e20', badgeColor: '#22c55e' },
  { label: 'Total Kendaraan', value: 0, badge: 'Terdaftar', icon: TruckIcon, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', badgeBg: '#3b82f620', badgeColor: '#3b82f6' },
  { label: 'Total Order', value: 0, badge: 'Bulan ini', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', badgeBg: '#f59e0b20', badgeColor: '#f59e0b' },
  { label: 'Total Transaksi', value: 'Rp 0', badge: 'Bulan ini', icon: BanknotesIcon, gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', badgeBg: '#a855f720', badgeColor: '#a855f7' },
])

const orderStatus = computed(() => [
  { label: 'Pending', value: allOrders.value.filter(o => o.status === 'pending').length, color: '#f59e0b' },
  { label: 'Dikerjakan', value: allOrders.value.filter(o => o.status === 'proses' || o.status === 'in_progress').length, color: '#3b82f6' },
  { label: 'Selesai', value: allOrders.value.filter(o => o.status === 'selesai' || o.status === 'completed').length, color: '#22c55e' },
  { label: 'Dibatalkan', value: allOrders.value.filter(o => o.status === 'batal' || o.status === 'cancelled').length, color: '#ef4444' },
])

const ringkasanBengkel = computed(() => [
  { label: 'Order Hari Ini', value: allOrders.value.filter(o => o.created_at?.slice(0,10) === new Date().toISOString().slice(0,10)).length, bg: '#f59e0b20', color: '#f59e0b', icon: ClipboardDocumentListIcon },
  { label: 'Menunggu Dikerjakan', value: allOrders.value.filter(o => o.status === 'pending').length, bg: '#3b82f620', color: '#3b82f6', icon: ClockIcon },
  { label: 'Selesai Hari Ini', value: allOrders.value.filter(o => (o.status === 'selesai' || o.status === 'completed') && o.updated_at?.slice(0,10) === new Date().toISOString().slice(0,10)).length, bg: '#22c55e20', color: '#22c55e', icon: CheckCircleIcon },
  { label: 'Total Mekanik', value: stats.value[0].mekanikCount || 0, bg: '#a855f720', color: '#a855f7', icon: UserGroupIcon },
])

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  proses: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  selesai: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/20 text-green-400',
  batal: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-red-500/20 text-red-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)


const tips = [
  { title: 'Respon order cepat', desc: 'Respon dalam 5 menit meningkatkan kepuasan customer', icon: BoltIcon, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Update stok rutin', desc: 'Cek stok sparepart minimal seminggu sekali', icon: CubeIcon, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { title: 'Gunakan AI Diagnostic', desc: 'Analisa keluhan lebih akurat dengan bantuan AI', icon: CpuChipIcon, gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
]
const checklist = ref([
  { label: 'Cek order masuk hari ini', done: false },
  { label: 'Update status order berjalan', done: false },
  { label: 'Cek stok sparepart menipis', done: false },
  { label: 'Konfirmasi jadwal mekanik', done: false },
  { label: 'Review transaksi kemarin', done: false },
])

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const [bRes, vRes, oRes, mRes] = await Promise.all([
      axios.get('/api/bengkels'),
      axios.get('/api/vehicles'),
      axios.get('/api/orders'),
      axios.get('/api/mechanics'),
    ])
    stats.value[0].value = bRes.data.data?.total || bRes.data.data?.length || 0
    stats.value[1].value = vRes.data.data?.total || vRes.data.data?.length || 0
    stats.value[2].value = oRes.data.data?.total || 0

    allOrders.value = oRes.data.data?.data || oRes.data.data || []
    orders.value = allOrders.value.slice(0, 5)

    const totalTrx = allOrders.value.filter(o => o.status === 'selesai' || o.status === 'completed').reduce((s, o) => s + (parseFloat(o.final_price) || parseFloat(o.total_price) || 0), 0)
    stats.value[3].value = 'Rp ' + formatRupiah(totalTrx)
    stats.value[0].mekanikCount = mRes.data.data?.total || mRes.data.data?.length || 0
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => clearInterval(timer))
</script>
