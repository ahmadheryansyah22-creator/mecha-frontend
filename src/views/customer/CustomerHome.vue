<template>
  <div class="animate-fadein">

    <!-- Hero Banner -->
    <div class="relative rounded-3xl overflow-hidden mb-8 p-8 md:p-12"
      :style="{ background: `linear-gradient(135deg, var(--accent)25, var(--bg-secondary))`, border: `1px solid var(--accent)40` }">
      <div class="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
        :style="{ backgroundColor: `var(--accent)` }"></div>
      <div class="absolute bottom-0 right-24 w-32 h-32 rounded-full opacity-10 translate-y-1/2"
        :style="{ backgroundColor: `var(--accent)` }"></div>

      <div class="relative z-10 flex items-start justify-between">
        <div class="max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            :style="{ backgroundColor: `var(--accent)20`, color: `var(--accent)`, border: `1px solid var(--accent)40` }">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: `var(--accent)` }"></span>
            {{ greeting }}, {{ userName }}!
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-3 leading-tight" :style="{ color: `var(--text-primary)` }">
            Kendaraan Masalah? <br>
            <span :style="{ color: `var(--accent)` }">MECHA Siap Membantu!</span>
          </h1>
          <p class="text-sm md:text-base mb-6" :style="{ color: `var(--text-secondary)` }">
            Temukan bengkel terdekat atau gunakan AI Diagnostic untuk analisa kendaraanmu secara instan.
          </p>
          <div class="flex gap-3 flex-wrap">
            <RouterLink to="/customer/bengkel"
              class="btn-primary px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm hover:scale-105 transition-transform">
              <BuildingStorefrontIcon class="w-4 h-4" /> Cari Bengkel
            </RouterLink>
            <RouterLink to="/customer/ai-diagnostic"
              class="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm transition-all hover:scale-105"
              :style="{ border: `1px solid var(--accent)`, color: `var(--accent)` }">
              <CpuChipIcon class="w-4 h-4" /> AI Diagnostic
            </RouterLink>
          </div>
        </div>
        <div class="hidden md:block text-right shrink-0">
          <p class="font-semibold text-sm" :style="{ color: `var(--text-primary)` }">{{ currentDate }}</p>
          <p class="text-2xl font-bold mt-1 tabular-nums" :style="{ color: `var(--accent)` }">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div v-for="(stat, i) in stats" :key="stat.label"
        class="card flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 cursor-default">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          :style="{ background: stat.gradient }">
          <component :is="stat.icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
          <p class="text-xs" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
        </div>
        <div class="ml-auto">
          <span class="text-xs px-2 py-1 rounded-full font-medium" :style="{ backgroundColor: stat.badgeBg, color: stat.badgeColor }">
            {{ stat.badge }}
          </span>
        </div>
      </div>
    </div>

    <!-- Fitur & Status Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="f in fitur" :key="f.title"
          class="card text-center hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          @click="$router.push(f.path)">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
            :style="{ background: f.gradient }">
            <component :is="f.icon" class="w-7 h-7 text-white" />
          </div>
          <h3 class="font-semibold text-sm mb-1" :style="{ color: `var(--text-primary)` }">{{ f.title }}</h3>
          <p class="text-xs leading-relaxed" :style="{ color: `var(--text-secondary)` }">{{ f.desc }}</p>
        </div>
      </div>

      <div class="card">
        <h2 class="font-semibold text-sm mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ChartPieIcon class="w-4 h-4" :style="{ color: `var(--accent)` }" /> Status Order
        </h2>
        <div class="space-y-3">
          <div v-for="s in orderStatus" :key="s.label" class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: s.color }"></div>
            <span class="text-xs flex-1" :style="{ color: `var(--text-secondary)` }">{{ s.label }}</span>
            <span class="text-xs font-bold" :style="{ color: `var(--text-primary)` }">{{ s.value }}</span>
          </div>
        </div>
        <div class="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
          <div v-for="s in orderStatus.filter(x => x.value > 0)" :key="s.label"
            class="transition-all duration-500"
            :style="{ backgroundColor: s.color, flex: s.value }">
          </div>
        </div>
        <RouterLink to="/customer/order"
          class="mt-4 w-full flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-xl transition-all hover:opacity-80"
          :style="{ backgroundColor: `var(--bg-primary)`, color: `var(--accent)` }">
          Lihat Semua Order <ChevronRightIcon class="w-3 h-3" />
        </RouterLink>
      </div>
    </div>

    <!-- Order Terakhir -->
    <div class="card">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-semibold flex items-center gap-2 text-sm" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: `var(--accent)` }" /> Order Terakhir
        </h2>
        <RouterLink to="/customer/order"
          class="text-xs font-medium flex items-center gap-1 hover:opacity-70 transition-all"
          :style="{ color: `var(--accent)` }">
          Lihat semua <ChevronRightIcon class="w-3 h-3" />
        </RouterLink>
      </div>

      <div v-if="loading" class="text-center py-10">
        <div class="w-7 h-7 border-2 rounded-full animate-spin mx-auto mb-2"
          :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style="background: linear-gradient(135deg, #f59e0b30, #d97706);">
          <TruckIcon class="w-8 h-8" style="color: #f59e0b;" />
        </div>
        <p class="font-semibold mb-1" :style="{ color: `var(--text-primary)` }">Belum ada order servis</p>
        <p class="text-xs mb-4" :style="{ color: `var(--text-muted)` }">Mulai cari bengkel terpercaya sekarang</p>
        <RouterLink to="/customer/bengkel" class="btn-primary px-5 py-2 rounded-xl inline-flex items-center gap-2 text-sm">
          <BuildingStorefrontIcon class="w-4 h-4" /> Cari Bengkel
        </RouterLink>
      </div>

      <div v-else class="space-y-2">
        <div v-for="order in orders" :key="order.id"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:opacity-80"
          :style="{ backgroundColor: `var(--bg-primary)` }">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <ClipboardDocumentListIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</p>
            <p class="text-xs mt-0.5 truncate" :style="{ color: `var(--text-muted)` }">
              {{ order.vehicle?.license_plate }} &bull; {{ order.bengkel?.name }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-xs px-2 py-1 rounded-full font-medium" :class="statusClass(order.status)">{{ order.status }}</span>
            <p class="text-xs font-semibold mt-1" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
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
  BuildingStorefrontIcon, MapPinIcon, TruckIcon,
  ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon,
  ChevronRightIcon, CpuChipIcon, WrenchScrewdriverIcon, ChartPieIcon,
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

const stats = computed(() => [
  { label: 'Total Order', value: orders.value.length, badge: 'Semua', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', badgeBg: '#f59e0b20', badgeColor: '#f59e0b' },
  { label: 'Selesai', value: orders.value.filter(o => o.status === 'completed').length, badge: 'Done', icon: CheckCircleIcon, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', badgeBg: '#22c55e20', badgeColor: '#22c55e' },
  { label: 'Dikerjakan', value: orders.value.filter(o => o.status === 'in_progress').length, badge: 'Aktif', icon: ClockIcon, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', badgeBg: '#3b82f620', badgeColor: '#3b82f6' },
])

const orderStatus = computed(() => [
  { label: 'Pending', value: orders.value.filter(o => o.status === 'pending').length, color: '#f59e0b' },
  { label: 'Dikerjakan', value: orders.value.filter(o => o.status === 'in_progress').length, color: '#3b82f6' },
  { label: 'Selesai', value: orders.value.filter(o => o.status === 'completed').length, color: '#22c55e' },
  { label: 'Batal', value: orders.value.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
])

const fitur = [
  { icon: MapPinIcon, title: 'Cari Bengkel', desc: 'Temukan bengkel terpercaya di sekitar kamu', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', path: '/customer/bengkel' },
  { icon: WrenchScrewdriverIcon, title: 'Mekanik Panggilan', desc: 'Mekanik datang langsung ke lokasi kamu', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', path: '/customer/order' },
  { icon: CpuChipIcon, title: 'AI Diagnostic', desc: 'Analisa keluhan kendaraan dengan AI', gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', path: '/customer/ai-diagnostic' },
]

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const res = await axios.get('/api/orders')
    orders.value = res.data.data?.data?.slice(0, 3) || res.data.data?.slice(0, 3) || []
  } catch (err) { orders.value = [] }
  finally { loading.value = false }
})

onUnmounted(() => clearInterval(timer))
</script>
