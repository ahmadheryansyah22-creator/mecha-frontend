<template>
  <div class="animate-fadein">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Order Saya
        </h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Pantau status servis kendaraan kamu</p>
      </div>
      <span class="text-xs px-3 py-1.5 rounded-full font-medium" style="background:#f59e0b20;color:#f59e0b">
        {{ orders.length }} Order
      </span>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
        class="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
        :style="activeFilter === f.value
          ? { backgroundColor: `var(--accent)`, color: `#000` }
          : { border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
        {{ f.label }}
        <span class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
          :style="activeFilter === f.value ? { backgroundColor: `rgba(0,0,0,0.15)` } : { backgroundColor: `var(--bg-primary)` }">
          {{ filterCount(f.value) }}
        </span>
      </button>
    </div>

    <!-- Skeleton Loading -->
    <SkeletonLoader v-if="loading" type="list" :count="3" />

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-16 card animate-fadein">
      <div class="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
        style="background:linear-gradient(135deg,#f59e0b20,#d97706)">
        <ClipboardDocumentListIcon class="w-10 h-10" style="color:#f59e0b" />
      </div>
      <p class="font-semibold text-lg mb-2" :style="{ color: `var(--text-primary)` }">Belum ada order</p>
      <p class="text-sm mb-5" :style="{ color: `var(--text-muted)` }">Yuk servis kendaraan kamu sekarang!</p>
      <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
        <BuildingStorefrontIcon class="w-4 h-4" /> Cari Bengkel
      </RouterLink>
    </div>

    <!-- Order List -->
    <div v-else class="space-y-5">
      <div v-for="(order, idx) in filteredOrders" :key="order.id"
        class="card hover:scale-[1.005] transition-all duration-300"
        :style="{ animationDelay: `${idx * 80}ms` }"
        :class="`animate-fadein-delay-${Math.min(idx+1,3)}`">

        <!-- Header -->
        <div class="flex items-start justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style="background:linear-gradient(135deg,#f59e0b,#d97706)">
              <ClipboardDocumentListIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</h3>
              <p class="text-xs mt-0.5" :style="{ color: `var(--text-muted)` }">
                {{ order.bengkel?.name || 'Bengkel' }} • {{ order.created_at?.slice(0,10) }}
              </p>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-semibold" :class="statusClass(order.status)">
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <!-- STATUS TRACKER (GoJek style) -->
        <div class="mb-5 px-2">
          <div class="relative flex items-center justify-between">
            <!-- Garis penghubung -->
            <div class="absolute top-5 left-0 right-0 h-0.5 z-0" :style="{ backgroundColor: `var(--border-color)` }"></div>
            <!-- Garis progress -->
            <div class="absolute top-5 left-0 h-0.5 z-0 transition-all duration-700"
              :style="{ width: progressWidth(order.status), background: `linear-gradient(90deg, var(--accent), #d97706)` }"></div>

            <!-- Steps -->
            <div v-for="(step, i) in steps" :key="step.key"
              class="relative z-10 flex flex-col items-center gap-2" style="width:60px">
              <div class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2"
                :style="stepDone(order.status, i)
                  ? { background: `linear-gradient(135deg, var(--accent), #d97706)`, borderColor: `var(--accent)`, transform: `scale(1.1)` }
                  : stepCurrent(order.status, i)
                  ? { backgroundColor: `var(--bg-primary)`, borderColor: `var(--accent)` }
                  : { backgroundColor: `var(--bg-primary)`, borderColor: `var(--border-color)` }">
                <component :is="step.icon" class="w-4 h-4 transition-all"
                  :style="stepDone(order.status, i) || stepCurrent(order.status, i)
                    ? { color: stepDone(order.status, i) ? `#000` : `var(--accent)` }
                    : { color: `var(--text-muted)` }" />
                <!-- Pulse animasi untuk step aktif -->
                <div v-if="stepCurrent(order.status, i) && order.status !== 'cancelled'"
                  class="absolute inset-0 rounded-full animate-ping opacity-30"
                  :style="{ backgroundColor: `var(--accent)` }"></div>
              </div>
              <span class="text-xs text-center leading-tight font-medium"
                :style="stepDone(order.status, i) || stepCurrent(order.status, i)
                  ? { color: `var(--accent)` }
                  : { color: `var(--text-muted)` }">
                {{ step.label }}
              </span>
            </div>
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
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Keluhan</p>
            <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ order.description || '-' }}</p>
          </div>
          <div class="rounded-xl p-3" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Total Biaya</p>
            <p class="text-sm font-bold" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
          </div>
        </div>

        <!-- Aksi -->
        <div class="flex gap-3 pt-3" :style="{ borderTop: `1px solid var(--border-color)` }">
          <button v-if="order.status === 'completed'"
            class="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <StarIcon class="w-4 h-4" /> Beri Rating
          </button>
          <button v-if="order.status === 'pending'" @click="batalOrder(order.id)"
            class="text-sm px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
            style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3)">
            Batalkan Order
          </button>
          <p v-if="order.status === 'in_progress'" class="text-xs flex items-center gap-1.5 py-2"
            :style="{ color: `var(--text-muted)` }">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Mekanik sedang mengerjakan kendaraan kamu...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  ClipboardDocumentListIcon, StarIcon, BuildingStorefrontIcon,
  ClockIcon, WrenchScrewdriverIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/vue/24/outline'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const loading = ref(true)
const orders = ref([])
const activeFilter = ref('semua')

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'in_progress' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

const steps = [
  { key: 'pending', icon: ClockIcon, label: 'Menunggu' },
  { key: 'in_progress', icon: WrenchScrewdriverIcon, label: 'Dikerjakan' },
  { key: 'completed', icon: CheckCircleIcon, label: 'Selesai' },
]

const stepIndex = (status) => ({ pending: 0, in_progress: 1, completed: 2, cancelled: -1 }[status] ?? 0)
const stepDone = (status, i) => status !== 'cancelled' && stepIndex(status) > i
const stepCurrent = (status, i) => status !== 'cancelled' && stepIndex(status) === i
const progressWidth = (s) => ({ pending: '0%', in_progress: '50%', completed: '100%', cancelled: '0%' }[s] || '0%')

const filteredOrders = computed(() =>
  activeFilter.value === 'semua' ? orders.value : orders.value.filter(o => o.status === activeFilter.value)
)
const filterCount = (v) => v === 'semua' ? orders.value.length : orders.value.filter(o => o.status === v).length
const statusClass = (s) => ({ pending: 'bg-yellow-500/20 text-yellow-400', in_progress: 'bg-blue-500/20 text-blue-400', completed: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400' }[s] || 'bg-gray-500/20 text-gray-400')
const statusLabel = (s) => ({ pending: 'Menunggu', in_progress: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }[s] || s)
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
  } catch { orders.value = [] }
  finally { loading.value = false }
}

onMounted(fetchOrders)
</script>
