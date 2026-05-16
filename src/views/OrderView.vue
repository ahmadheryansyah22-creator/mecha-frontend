<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
          Order Servis
        </h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola order dan assign mekanik</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-3 p-4 rounded-2xl"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          :style="{ backgroundColor: `var(--accent)` + `20` }">
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

    <!-- Order List -->
    <div class="rounded-2xl p-6" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <ClipboardDocumentListIcon class="w-12 h-12 animate-pulse" :style="{ color: `var(--accent)` }" />
        <p :style="{ color: `var(--text-muted)` }">Memuat order...</p>
      </div>
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
              <p class="text-sm" :style="{ color: `var(--text-muted)` }">{{ order.vehicle?.license_plate || '-' }} · {{ order.created_at?.slice(0,10) }}</p>
            </div>
            <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusClass(order.status)">{{ order.status }}</span>
          </div>

          <p class="text-sm mb-4 p-3 rounded-xl" :style="{ backgroundColor: `var(--bg-secondary)`, color: `var(--text-secondary)` }">
            {{ order.description }}
          </p>

          <!-- Info Mekanik -->
          <div class="p-3 rounded-xl mb-4" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <WrenchScrewdriverIcon class="w-4 h-4" :style="{ color: `var(--accent)` }" />
                <span class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">
                  {{ order.mechanic ? order.mechanic.name : 'Belum ada mekanik' }}
                </span>
              </div>
              <span v-if="order.mechanic_status" class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="mechStatusClass(order.mechanic_status)">
                {{ mechStatusLabel(order.mechanic_status) }}
              </span>
            </div>
            <p v-if="order.mechanic_fee" class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">
              Fee: Rp {{ Number(order.mechanic_fee).toLocaleString('id-ID') }}
            </p>
          </div>

          <!-- Tombol Assign -->
          <button @click="openAssign(order)"
            class="w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
            <UserPlusIcon class="w-4 h-4" />
            {{ order.mechanic ? 'Ganti Mekanik' : 'Assign Mekanik' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Assign -->
    <div v-if="showAssignModal" class="fixed inset-0 flex items-center justify-center z-50 px-4"
      style="background-color: rgba(0,0,0,0.75)">
      <div class="rounded-2xl p-8 w-full max-w-md"
        :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold" :style="{ color: `var(--text-primary)` }">Assign Mekanik</h2>
          <button @click="showAssignModal = false" :style="{ color: `var(--text-muted)` }">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <p class="text-sm mb-4" :style="{ color: `var(--text-secondary)` }">
          Order: <span class="font-semibold" :style="{ color: `var(--text-primary)` }">{{ selectedOrder?.order_number }}</span>
        </p>

        <div class="mb-4">
          <label class="block text-xs mb-2 font-medium" :style="{ color: `var(--text-secondary)` }">Pilih Mekanik</label>
          <select v-model="assignForm.mechanic_id" class="w-full px-4 py-2 rounded-xl text-sm outline-none"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }">
            <option value="">-- Pilih Mekanik --</option>
            <option v-for="m in mechanics" :key="m.id" :value="m.id">
              {{ m.name }} {{ m.expertise ? `· ${m.expertise}` : '' }}
            </option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-xs mb-2 font-medium" :style="{ color: `var(--text-secondary)` }">Fee Mekanik (Rp)</label>
          <input v-model="assignForm.mechanic_fee" type="number" placeholder="Contoh: 150000"
            class="w-full px-4 py-2 rounded-xl text-sm outline-none"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
        </div>

        <div class="flex gap-3">
          <button @click="showAssignModal = false"
            class="flex-1 py-3 rounded-xl text-sm font-medium"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="submitAssign"
            class="flex-1 py-3 rounded-xl text-sm font-semibold"
            :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
            {{ assigning ? 'Menyimpan...' : 'Assign' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  ClipboardDocumentListIcon, WrenchScrewdriverIcon, UserPlusIcon, XMarkIcon,
  ClockIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon
} from '@heroicons/vue/24/outline'

const orders = ref([])
const mechanics = ref([])
const loading = ref(true)
const showAssignModal = ref(false)
const assigning = ref(false)
const selectedOrder = ref(null)
const activeFilter = ref('semua')
const assignForm = ref({ mechanic_id: '', mechanic_fee: '' })

const filters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Pending', value: 'pending' },
  { label: 'Berjalan', value: 'in_progress' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

const stats = computed(() => [
  { label: 'Total Order', value: orders.value.length, icon: ClipboardDocumentListIcon },
  { label: 'Pending', value: orders.value.filter(o => o.status === 'pending').length, icon: ClockIcon },
  { label: 'Berjalan', value: orders.value.filter(o => o.status === 'in_progress').length, icon: ExclamationCircleIcon },
  { label: 'Selesai', value: orders.value.filter(o => o.status === 'completed').length, icon: CheckCircleIcon },
])

const filteredOrders = computed(() =>
  activeFilter.value === 'semua' ? orders.value : orders.value.filter(o => o.status === activeFilter.value)
)

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
}[s] || 'bg-gray-500/20 text-gray-400')

const priorityClass = (p) => ({
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400'
}[p] || '')

const mechStatusClass = (s) => ({
  waiting: 'bg-yellow-500/20 text-yellow-400',
  accepted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400'
}[s] || '')

const mechStatusLabel = (s) => ({
  waiting: 'Menunggu konfirmasi mekanik',
  accepted: 'Diterima mekanik',
  rejected: 'Ditolak mekanik'
}[s] || s)

const openAssign = (order) => {
  selectedOrder.value = order
  assignForm.value = {
    mechanic_id: order.mechanic_id || '',
    mechanic_fee: order.mechanic_fee || ''
  }
  showAssignModal.value = true
}

const submitAssign = async () => {
  if (!assignForm.value.mechanic_id) return alert('Pilih mekanik dulu!')
  assigning.value = true
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/api/orders/${selectedOrder.value.id}`, {
      mechanic_id: assignForm.value.mechanic_id,
      mechanic_fee: assignForm.value.mechanic_fee,
      mechanic_status: 'waiting'
    }, { headers: { Authorization: `Bearer ${token}` } })
    showAssignModal.value = false
    await fetchOrders()
  } catch (e) { alert('Gagal assign mekanik') }
  finally { assigning.value = false }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await fetchOrders()
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/mechanics', { headers: { Authorization: `Bearer ${token}` } })
    mechanics.value = res.data.data?.data || res.data.data || []
  } catch (e) { mechanics.value = [] }
})
</script>
