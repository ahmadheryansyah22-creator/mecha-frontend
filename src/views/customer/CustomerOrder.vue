<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">Order Saya</h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Pantau status servis kendaraan kamu</p>
    </div>

    <div v-if="loading" class="text-center py-12" :style="{ color: `var(--text-muted)` }">Memuat data...</div>

    <div v-else-if="orders.length === 0" class="text-center py-16">
      <ClipboardDocumentListIcon class="w-16 h-16 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
      <p class="font-semibold text-lg mb-2" :style="{ color: `var(--text-primary)` }">Belum ada order</p>
      <p class="mb-6" :style="{ color: `var(--text-secondary)` }">Kamu belum pernah melakukan order servis</p>
      <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-3 rounded-xl">Cari Bengkel Sekarang</RouterLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="card">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</h3>
            <p class="text-sm mt-1" :style="{ color: `var(--text-secondary)` }">{{ order.bengkel?.name || 'Bengkel' }}</p>
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusClass(order.status)">
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-xs mb-2" :style="{ color: `var(--text-muted)` }">
            <span>Pending</span><span>Diproses</span><span>Selesai</span>
          </div>
          <div class="w-full rounded-full h-2" :style="{ backgroundColor: `var(--border-color)` }">
            <div class="h-2 rounded-full transition-all" :style="{ width: progressWidth(order.status), backgroundColor: `var(--accent)` }"></div>
          </div>
        </div>

        <!-- Detail -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Kendaraan</p>
            <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ order.vehicle?.license_plate || '-' }}</p>
            <p class="text-xs" :style="{ color: `var(--text-secondary)` }">{{ order.vehicle?.brand }} {{ order.vehicle?.model }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Mekanik</p>
            <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ order.mechanic?.name || 'Belum ditentukan' }}</p>
            <p class="text-xs" :style="{ color: `var(--text-secondary)` }">{{ order.mechanic?.expertise || '-' }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Prioritas</p>
            <span class="text-xs px-2 py-1 rounded-full" :class="priorityClass(order.priority)">{{ priorityLabel(order.priority) }}</span>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Total Biaya</p>
            <p class="text-sm font-bold" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
          </div>
        </div>

        <!-- Keluhan -->
        <div class="rounded-xl p-3 mb-4" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Keluhan</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ order.description }}</p>
        </div>

        <!-- Aksi -->
        <div class="flex gap-3" v-if="order.status === 'completed'">
          <button class="flex-1 btn-primary py-2 rounded-lg text-sm flex items-center justify-center gap-2">
            <StarIcon class="w-4 h-4" /> Beri Rating
          </button>
        </div>
        <div v-if="order.status === 'pending'">
          <button @click="batalOrder(order.id)" class="text-sm text-red-400 hover:text-red-300 transition-all">Batalkan Order</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ClipboardDocumentListIcon, StarIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const statusLabel = (s) => ({
  pending: 'Menunggu',
  in_progress: 'Sedang Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}[s] || s)

const priorityClass = (p) => ({
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400',
}[p] || 'bg-gray-500/20 text-gray-400')

const priorityLabel = (p) => ({ low: 'Normal', medium: 'Segera', high: 'Mendesak', urgent: 'Darurat' }[p] || p)
const progressWidth = (s) => ({ pending: '15%', in_progress: '60%', completed: '100%', cancelled: '0%' }[s] || '0%')
const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const batalOrder = async (id) => {
  if (!confirm('Batalkan order ini?')) return
  try {
    await axios.put(`/api/orders/${id}`, { status: 'cancelled' })
    fetchOrders()
  } catch (err) { console.error(err) }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/orders')
    orders.value = res.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

onMounted(fetchOrders)
</script>
