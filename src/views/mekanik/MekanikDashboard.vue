<template>
  <div class="animate-fadein">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
          <HomeIcon class="w-7 h-7" :style="{ color: 'var(--accent)' }" />
          Dashboard Mekanik
        </h1>
        <p class="mt-1 text-sm" :style="{ color: 'var(--text-secondary)' }">
          Selamat {{ greeting }}, {{ userName }}! Siap bekerja hari ini?
        </p>
      </div>
      <div class="text-right hidden md:block">
        <p class="font-semibold text-sm" :style="{ color: 'var(--text-primary)' }">{{ currentDate }}</p>
        <p class="text-2xl font-bold mt-1 tabular-nums" :style="{ color: 'var(--accent)' }">{{ currentTime }}</p>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label"
        class="card flex items-center gap-4 hover:scale-[1.02] transition-all duration-300">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" :style="{ background: stat.gradient }">
          <component :is="stat.icon" class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ stat.value }}</p>
          <p class="text-xs" :style="{ color: 'var(--text-secondary)' }">{{ stat.label }}</p>
        </div>
        <span class="ml-auto text-xs px-2 py-1 rounded-full font-medium shrink-0"
          :style="{ backgroundColor: stat.badgeBg, color: stat.badgeColor }">{{ stat.badge }}</span>
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
          <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Est. Pendapatan</span>
          <span class="text-sm font-bold" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(estPendapatan) }}</span>
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

      <!-- Ringkasan -->
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Ringkasan
        </h2>
        <div class="space-y-3">
          <div v-for="info in ringkasan" :key="info.label"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="flex items-center gap-2">
              <component :is="info.icon" class="w-4 h-4" :style="{ color: info.color }" />
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
        <button @click="$router.push('/portal-mekanik/order')"
          class="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-all"
          :style="{ color: 'var(--accent)' }">
          Lihat semua <ChevronRightIcon class="w-3 h-3" />
        </button>
      </div>
      <div v-if="loading" class="text-center py-8">
        <div class="w-6 h-6 border-2 rounded-full animate-spin mx-auto"
          :style="{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }"></div>
      </div>
      <div v-else-if="orders.length === 0" class="text-center py-10">
        <ClipboardDocumentListIcon class="w-12 h-12 mx-auto mb-3 opacity-20" :style="{ color: 'var(--text-muted)' }" />
        <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Belum ada order</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="order in orders.slice(0,5)" :key="order.id"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:opacity-80"
          :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <ClipboardDocumentListIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">#{{ order.id }} - {{ order.vehicle?.license_plate || 'Kendaraan' }}</p>
            <p class="text-xs truncate" :style="{ color: 'var(--text-muted)' }">{{ order.created_at?.slice(0,10) }}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium shrink-0" :class="statusClass(order.status)">{{ order.status }}</span>
        </div>
      </div>
    </div>
  <!-- Tips & Checklist -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <FireIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Tips Mekanik Profesional
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
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Checklist Hari Ini
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
import axios from 'axios'
import {
  HomeIcon, ClipboardDocumentListIcon, TruckIcon, CheckCircleIcon,
  BanknotesIcon, ChevronRightIcon, ChartPieIcon, WrenchIcon,
  CpuChipIcon, UserIcon, CalendarDaysIcon, ClockIcon, FireIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])
const currentTime = ref('')
const currentDate = ref('')
let timer = null

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name?.split(' ')[0] || 'Mekanik')
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

// Filter order bulan ini
const ordersBulanIni = computed(() => {
  const now = new Date()
  return orders.value.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
})

const totalBulanIni = computed(() => ordersBulanIni.value.length)
const selesaiBulanIni = computed(() => ordersBulanIni.value.filter(o => o.status === 'selesai').length)
const prosesBulanIni = computed(() => ordersBulanIni.value.filter(o => o.status === 'proses').length)
const estPendapatan = computed(() => ordersBulanIni.value.filter(o => o.status === 'selesai').reduce((s, o) => s + (o.total_price || 0), 0))

const bulananStats = computed(() => [
  { label: 'Total Order Masuk', display: totalBulanIni.value, pct: Math.min(totalBulanIni.value * 10, 100), color: '#f59e0b' },
  { label: 'Order Selesai', display: selesaiBulanIni.value, pct: totalBulanIni.value ? Math.round(selesaiBulanIni.value / totalBulanIni.value * 100) : 0, color: '#22c55e' },
  { label: 'Sedang Dikerjakan', display: prosesBulanIni.value, pct: Math.min(prosesBulanIni.value * 10, 100), color: '#3b82f6' },
  { label: 'Tingkat Selesai', display: (totalBulanIni.value ? Math.round(selesaiBulanIni.value / totalBulanIni.value * 100) : 0) + '%', pct: totalBulanIni.value ? Math.round(selesaiBulanIni.value / totalBulanIni.value * 100) : 0, color: '#a855f7' },
])

const stats = computed(() => [
  { label: 'Total Order', value: orders.value.length, badge: 'Semua', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', badgeBg: '#f59e0b20', badgeColor: '#f59e0b' },
  { label: 'Dikerjakan', value: orders.value.filter(o => o.status === 'proses').length, badge: 'Aktif', icon: WrenchIcon, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', badgeBg: '#3b82f620', badgeColor: '#3b82f6' },
  { label: 'Selesai', value: orders.value.filter(o => o.status === 'selesai').length, badge: 'Done', icon: CheckCircleIcon, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', badgeBg: '#22c55e20', badgeColor: '#22c55e' },
  { label: 'Kendaraan', value: new Set(orders.value.map(o => o.vehicle_id)).size, badge: 'Unik', icon: TruckIcon, gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', badgeBg: '#a855f720', badgeColor: '#a855f7' },
])

const orderStatus = computed(() => [
  { label: 'Pending', value: orders.value.filter(o => o.status === 'pending').length, color: '#f59e0b' },
  { label: 'Dikerjakan', value: orders.value.filter(o => o.status === 'proses').length, color: '#3b82f6' },
  { label: 'Selesai', value: orders.value.filter(o => o.status === 'selesai').length, color: '#22c55e' },
  { label: 'Batal', value: orders.value.filter(o => o.status === 'batal').length, color: '#ef4444' },
])

const ringkasan = computed(() => [
  { label: 'Status Kerja', value: 'Aktif', bg: '#22c55e20', color: '#22c55e', icon: CheckCircleIcon },
  { label: 'Order Hari Ini', value: orders.value.filter(o => o.created_at?.slice(0,10) === new Date().toISOString().slice(0,10)).length, bg: '#f59e0b20', color: '#f59e0b', icon: ClockIcon },
  { label: 'Bulan Ini', value: totalBulanIni.value, bg: '#3b82f620', color: '#3b82f6', icon: CalendarDaysIcon },
  { label: 'Role', value: 'Mekanik', bg: '#a855f720', color: '#a855f7', icon: UserIcon },
])

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const statusClass = (s) => {
  const m = { proses: 'bg-yellow-500/20 text-yellow-400', selesai: 'bg-green-500/20 text-green-400', pending: 'bg-blue-500/20 text-blue-400', batal: 'bg-red-500/20 text-red-400' }
  return m[s] || 'bg-gray-500/20 text-gray-400'
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
})

const tips = [
  { title: 'Gunakan timer pengerjaan', desc: 'Catat waktu kerja untuk estimasi order berikutnya', icon: ClockIcon, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Foto kondisi kendaraan', desc: 'Dokumentasi sebelum & sesudah servis untuk transparansi', icon: TruckIcon, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { title: 'Update status order', desc: 'Selalu update status agar customer tidak khawatir', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg,#22c55e,#16a34a)' },
]
const checklist = ref([
  { label: 'Cek order masuk hari ini', done: false },
  { label: 'Siapkan tools & sparepart', done: false },
  { label: 'Update status order aktif', done: false },
  { label: 'Catat hasil diagnosa', done: false },
  { label: 'Konfirmasi selesai ke customer', done: false },
])
onUnmounted(() => clearInterval(timer))
</script>
