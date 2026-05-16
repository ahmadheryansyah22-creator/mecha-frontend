<template>
  <div class="animate-fadein">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Order Saya
        </h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Pantau status servis kendaraan kamu</p>
      </div>
      <div class="flex gap-2">
        <span class="text-xs px-3 py-1.5 rounded-full font-medium" style="background:#f59e0b20;color:#f59e0b">
          {{ orders.length }} Order
        </span>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
        class="px-4 py-2 rounded-xl text-xs font-medium transition-all"
        :style="activeFilter === f.value
          ? { backgroundColor: `var(--accent)`, color: `#000` }
          : { border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
        {{ f.label }}
        <span class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
          :style="activeFilter === f.value ? { backgroundColor: `rgba(0,0,0,0.2)` } : { backgroundColor: `var(--bg-primary)` }">
          {{ filterCount(f.value) }}
        </span>
      </button>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
        :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
      <p class="text-sm" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-16 card">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style="background:linear-gradient(135deg,#f59e0b30,#d97706)">
        <ClipboardDocumentListIcon class="w-8 h-8" style="color:#f59e0b" />
      </div>
      <p class="font-semibold mb-1" :style="{ color: `var(--text-primary)` }">Belum ada order</p>
      <p class="text-sm mb-4" :style="{ color: `var(--text-muted)` }">Kamu belum pernah melakukan order servis</p>
      <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
        <BuildingStorefrontIcon class="w-4 h-4" /> Cari Bengkel Sekarang
      </RouterLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in filteredOrders" :key="order.id"
        class="card hover:scale-[1.005] transition-all duration-300">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style="background:linear-gradient(135deg,#f59e0b,#d97706)">
              <ClipboardDocumentListIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-sm" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</h3>
              <p class="text-xs mt-0.5" :style="{ color: `var(--text-muted)` }">{{ order.bengkel?.name || 'Bengkel' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full font-medium" :class="priorityClass(order.priority)">
              {{ priorityLabel(order.priority) }}
            </span>
            <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusClass(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex justify-between text-xs mb-2" :style="{ color: `var(--text-muted)` }">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: progressStep >= 1 ? `var(--accent)` : `var(--border-color)` }"></span>
              Pending
            </span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: progressStep >= 2 ? `var(--accent)` : `var(--border-color)` }"></span>
              Diproses
            </span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: progressStep >= 3 ? `var(--accent)` : `var(--border-color)` }"></span>
              Selesai
            </span>
          </div>
          <div class="w-full rounded-full h-2" :style="{ backgroundColor: `var(--border-color)` }">
            <div class="h-2 rounded-full transition-all duration-700"
              :style="{ width: progressWidth(order.status), background: `linear-gradient(90deg, var(--accent), #d97706)` }"></div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Kendaraan</p>
            <p class="text-sm font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.vehicle?.license_plate || '-' }}</p>
            <p class="text-xs mt-0.5" :style="{ color: `var(--text-secondary)` }">{{ order.vehicle?.brand }} {{ order.vehicle?.model }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Mekanik</p>
            <p class="text-sm font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.mechanic?.name || 'Belum ditentukan' }}</p>
            <p class="text-xs mt-0.5" :style="{ color: `var(--text-secondary)` }">{{ order.mechanic?.expertise || '-' }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Tanggal Order</p>
            <p class="text-sm font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.created_at?.slice(0,10) || '-' }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Total Biaya</p>
            <p class="text-sm font-bold" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
          </div>
        </div>

        <!-- Keluhan -->
        <div class="rounded-xl p-3 mb-4" :style="{ backgroundColor: `var(--bg-primary)` }">
          <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Keluhan</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ order.description || '-' }}</p>
        </div>

        <!-- Aksi -->
        <div class="flex gap-3">
          <button v-if="order.status === 'completed'"
            class="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <StarIcon class="w-4 h-4" /> Beri Rating
          </button>
          <button v-if="order.status === 'pending'"
            @click="batalOrder(order.id)"
            class="text-sm px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
            style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3)">
            Batalkan Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ClipboardDocumentListIcon, StarIcon, BuildingStorefrontIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])
const activeFilter = ref('semua')
const progressStep = 1

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'in_progress' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

const filteredOrders = computed(() =>
  activeFilter.value === 'semua' ? orders.value : orders.value.filter(o => o.status === activeFilter.value)
)

const filterCount = (v) => v === 'semua' ? orders.value.length : orders.value.filter(o => o.status === v).length

const statusClass = (s) => ({ pending: 'bg-yellow-500/20 text-yellow-400', in_progress: 'bg-blue-500/20 text-blue-400', completed: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400' }[s] || 'bg-gray-500/20 text-gray-400')
const statusLabel = (s) => ({ pending: 'Menunggu', in_progress: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }[s] || s)
const priorityClass = (p) => ({ low: 'bg-gray-500/20 text-gray-400', medium: 'bg-blue-500/20 text-blue-400', high: 'bg-orange-500/20 text-orange-400', urgent: 'bg-red-500/20 text-red-400' }[p] || '')
const priorityLabel = (p) => ({ low: 'Normal', medium: 'Segera', high: 'Mendesak', urgent: 'Darurat' }[p] || p)
const progressWidth = (s) => ({ pending: '15%', in_progress: '60%', completed: '100%', cancelled: '5%' }[s] || '0%')
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
    orders.value = res.data.data?.data || res.data.data || []
  } catch (err) { orders.value = [] }
  finally { loading.value = false }
}

onMounted(fetchOrders)
</script>
