<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">Dashboard</h1>
      <p class="mt-1" :style="{ color: 'var(--text-secondary)' }">Selamat datang di MECHA Bengkel Management</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center" :style="{ backgroundColor: stat.bg }">
            <component :is="stat.icon" class="w-5 h-5" :style="{ color: stat.color }" />
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :style="{ backgroundColor: stat.bg, color: stat.color }">{{ stat.badge }}</span>
        </div>
        <p class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ stat.value }}</p>
        <p class="text-sm mt-1" :style="{ color: 'var(--text-secondary)' }">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Order Terbaru -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-semibold" :style="{ color: 'var(--text-primary)' }">Order Terbaru</h2>
        <RouterLink to="/order" class="text-sm font-medium" :style="{ color: 'var(--accent)' }">Lihat semua →</RouterLink>
      </div>
      <div v-if="loading" class="text-center py-8" :style="{ color: 'var(--text-muted)' }">Memuat data...</div>
      <div v-else-if="orders.length === 0" class="text-center py-8" :style="{ color: 'var(--text-muted)' }">Belum ada order</div>
      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id" class="flex items-center gap-4 p-3 rounded-xl" :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" :style="{ backgroundColor: 'var(--accent) + 20' }">
            <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium" :style="{ color: 'var(--text-primary)' }">Order #{{ order.id }}</p>
            <p class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ order.status }}</p>
          </div>
          <p class="text-sm font-semibold" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(order.total_price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  BuildingStorefrontIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])

const stats = ref([
  { label: 'Total Bengkel', value: 0, badge: 'Aktif', icon: BuildingStorefrontIcon, bg: '#22c55e20', color: '#22c55e' },
  { label: 'Total Kendaraan', value: 0, badge: 'Terdaftar', icon: TruckIcon, bg: '#3b82f620', color: '#3b82f6' },
  { label: 'Total Order', value: 0, badge: 'Bulan ini', icon: ClipboardDocumentListIcon, bg: '#f59e0b20', color: '#f59e0b' },
  { label: 'Total Transaksi', value: 'Rp 0', badge: 'Bulan ini', icon: BanknotesIcon, bg: '#a855f720', color: '#a855f7' },
])

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

onMounted(async () => {
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
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>