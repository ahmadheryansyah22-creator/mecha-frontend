<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <BanknotesIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
        Penghasilan Saya
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Riwayat fee dari order yang telah diselesaikan</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-5 rounded-2xl" :style="{ backgroundColor: `var(--accent)`, color: '#000' }">
        <p class="text-sm font-medium opacity-70">Total Penghasilan</p>
        <p class="text-2xl font-bold mt-1">Rp {{ totalEarnings.toLocaleString('id-ID') }}</p>
        <p class="text-xs mt-1 opacity-60">dari {{ completedOrders.length }} order selesai</p>
      </div>
      <div class="p-5 rounded-2xl" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Order Diterima</p>
        <p class="text-2xl font-bold mt-1" :style="{ color: `var(--text-primary)` }">{{ acceptedOrders.length }}</p>
        <p class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">sedang berjalan</p>
      </div>
      <div class="p-5 rounded-2xl" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Rata-rata Fee</p>
        <p class="text-2xl font-bold mt-1" :style="{ color: `var(--text-primary)` }">
          Rp {{ completedOrders.length ? Math.round(totalEarnings / completedOrders.length).toLocaleString('id-ID') : 0 }}
        </p>
        <p class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">per order</p>
      </div>
    </div>

    <!-- Riwayat -->
    <div class="rounded-2xl p-6" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
      <h2 class="font-semibold mb-4" :style="{ color: `var(--text-primary)` }">Riwayat Penghasilan</h2>
      <div v-if="loading" class="text-center py-12" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="completedOrders.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <BanknotesIcon class="w-12 h-12 opacity-30" :style="{ color: `var(--text-muted)` }" />
        <p :style="{ color: `var(--text-muted)` }">Belum ada penghasilan</p>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Selesaikan order untuk mendapatkan fee</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="order in completedOrders" :key="order.id"
          class="flex items-center justify-between p-4 rounded-xl"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :style="{ backgroundColor: `var(--accent)` + `20` }">
              <CheckCircleIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
            </div>
            <div>
              <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</p>
              <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ order.bengkel?.name || '-' }} · {{ order.completed_at?.slice(0,10) || order.updated_at?.slice(0,10) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold" :style="{ color: `var(--accent)` }">
              + Rp {{ Number(order.mechanic_fee || 0).toLocaleString('id-ID') }}
            </p>
            <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Selesai</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { BanknotesIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const orders = ref([])
const loading = ref(true)

const completedOrders = computed(() => orders.value.filter(o => o.status === 'completed' && o.mechanic_status === 'accepted'))
const acceptedOrders = computed(() => orders.value.filter(o => o.mechanic_status === 'accepted' && o.status !== 'completed'))
const totalEarnings = computed(() => completedOrders.value.reduce((s, o) => s + Number(o.mechanic_fee || 0), 0))

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
})
</script>
