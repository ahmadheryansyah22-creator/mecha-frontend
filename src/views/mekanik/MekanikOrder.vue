<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <ClipboardDocumentListIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
        Order Masuk
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Order dari bengkel yang menghubungi Anda</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-3 p-4 rounded-2xl"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <component :is="stat.icon" class="w-5 h-5" :style="{ color: `var(--accent)` }" />
        </div>
        <div>
          <p class="text-lg font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
          <p class="text-xs" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
        :style="activeFilter === f.value ? { backgroundColor: `var(--accent)`, color: `#000` } : { border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
        {{ f.label }}
      </button>
    </div>

    <div class="rounded-2xl p-6" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
      <SkeletonLoader v-if="loading" type="list" :count="4" />
      <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <ClipboardDocumentListIcon class="w-12 h-12 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-muted)` }">Tidak ada order</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id" class="p-5 rounded-2xl"
          :style="{ border: `1px solid var(--border-color)`, backgroundColor: `var(--bg-primary)` }">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <p class="font-semibold" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</p>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="priorityClass(order.priority)">{{ order.priority }}</span>
              </div>
              <p class="text-sm" :style="{ color: `var(--text-muted)` }">{{ order.bengkel?.name || '-' }}</p>
            </div>
            <span class="text-xs px-3 py-1 rounded-full font-medium" :class="mechStatusClass(order.mechanic_status)">
              {{ mechStatusLabel(order.mechanic_status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4 text-sm" :style="{ color: `var(--text-secondary)` }">
            <p>Ã°Å¸Å¡â€” {{ order.vehicle?.license_plate || '-' }}</p>
            <p>Ã°Å¸â€œâ€¦ {{ order.created_at?.slice(0,10) }}</p>
            <p>Ã°Å¸â€œâ€¹ {{ order.status }}</p>
            <p class="font-semibold" :style="{ color: `var(--accent)` }">
              Ã°Å¸â€™Â° Fee: Rp {{ order.mechanic_fee ? Number(order.mechanic_fee).toLocaleString('id-ID') : 'Belum ditentukan' }}
            </p>
          </div>

          <p class="text-sm mb-4 p-3 rounded-xl" :style="{ backgroundColor: `var(--bg-secondary)`, color: `var(--text-secondary)` }">
            {{ order.description }}
          </p>

          <!-- Aksi terima/tolak hanya kalau masih waiting -->
          <div v-if="order.mechanic_status === 'waiting'" class="flex gap-3">
            <button @click="respondOrder(order.id, 'rejected')"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
              :style="{ border: `1px solid rgba(248,113,113,0.4)`, color: `#f87171` }">
              Ã¢Å“â€¢ Tolak
            </button>
            <button @click="respondOrder(order.id, 'accepted')"
              class="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
              Ã¢Å“â€œ Terima
            </button>
          </div>
          <div v-else-if="order.mechanic_status === 'accepted' && order.status !== 'completed'" class="flex gap-3">
            <button @click="selesaikanOrder(order.id)"
              class="w-full py-2 rounded-xl text-sm font-semibold"
              :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
              Ã¢Å“â€œ Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, XCircleIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

const orders = ref([])
const loading = ref(true)
const activeFilter = ref('semua')

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Menunggu', value: 'waiting' },
  { label: 'Diterima', value: 'accepted' },
  { label: 'Ditolak', value: 'rejected' },
]

const stats = computed(() => [
  { label: 'Total Order', value: orders.value.length, icon: ClipboardDocumentListIcon },
  { label: 'Menunggu', value: orders.value.filter(o => o.mechanic_status === 'waiting').length, icon: ClockIcon },
  { label: 'Diterima', value: orders.value.filter(o => o.mechanic_status === 'accepted').length, icon: CheckCircleIcon },
  { label: 'Total Fee', value: 'Rp ' + orders.value.filter(o => o.mechanic_status === 'accepted').reduce((s, o) => s + Number(o.mechanic_fee || 0), 0).toLocaleString('id-ID'), icon: BanknotesIcon },
])

const filteredOrders = computed(() =>
  activeFilter.value === 'semua' ? orders.value : orders.value.filter(o => o.mechanic_status === activeFilter.value)
)

const mechStatusClass = (s) => ({ waiting: 'bg-yellow-500/20 text-yellow-400', accepted: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400' }[s] || 'bg-gray-500/20 text-gray-400')
const mechStatusLabel = (s) => ({ waiting: 'Menunggu Konfirmasi', accepted: 'Diterima', rejected: 'Ditolak' }[s] || s)
const priorityClass = (p) => ({ low: 'bg-gray-500/20 text-gray-400', medium: 'bg-blue-500/20 text-blue-400', high: 'bg-orange-500/20 text-orange-400', urgent: 'bg-red-500/20 text-red-400' }[p] || '')

const respondOrder = async (id, status) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/api/orders/${id}`, { mechanic_status: status }, { headers: { Authorization: `Bearer ${token}` } })
    const order = orders.value.find(o => o.id === id)
    if (order) order.mechanic_status = status
  } catch (e) { alert('Gagal update') }
}

const selesaikanOrder = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/api/orders/${id}`, { status: 'completed' }, { headers: { Authorization: `Bearer ${token}` } })
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = 'completed'
  } catch (e) { alert('Gagal update') }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
})
</script>
