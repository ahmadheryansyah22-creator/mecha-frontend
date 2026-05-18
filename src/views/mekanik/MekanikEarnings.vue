<template>
  <div class="animate-fadein">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
          <BanknotesIcon class="w-7 h-7" :style="{ color: 'var(--accent)' }" />
          Penghasilan Saya
        </h1>
        <p class="mt-1 text-sm" :style="{ color: 'var(--text-secondary)' }">Riwayat fee dari order yang telah diselesaikan</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="stat-card">
        <p class="text-sm mb-1" :style="{ color: `var(--text-secondary)` }">Total Penghasilan</p>
        <p class="text-3xl font-bold" :style="{ color: `var(--text-primary)` }">Rp {{ formatRupiah(totalEarnings) }}</p>
        <p class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">dari {{ completedOrders.length }} order selesai</p>
      </div>
      <div class="stat-card">
        <p class="text-sm mb-1" :style="{ color: 'var(--text-secondary)' }">Order Diterima</p>
        <p class="text-3xl font-bold" :style="{ color: 'var(--text-primary)' }">{{ orders.length }}</p>
        <p class="text-xs mt-1" :style="{ color: 'var(--text-muted)' }">sedang berjalan</p>
      </div>
      <div class="stat-card">
        <p class="text-sm mb-1" :style="{ color: 'var(--text-secondary)' }">Rata-rata Fee</p>
        <p class="text-3xl font-bold" :style="{ color: 'var(--text-primary)' }">Rp {{ formatRupiah(avgFee) }}</p>
        <p class="text-xs mt-1" :style="{ color: 'var(--text-muted)' }">per order</p>
      </div>
    </div>

    <div class="card">
      <h2 class="font-semibold mb-6 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
        <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Riwayat Penghasilan
      </h2>
      <div v-if="loading" class="text-center py-12">
        <div class="w-6 h-6 border-2 rounded-full animate-spin mx-auto" :style="{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }"></div>
      </div>
      <div v-else-if="completedOrders.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <BanknotesIcon class="w-12 h-12 opacity-20" :style="{ color: 'var(--text-muted)' }" />
        <p :style="{ color: 'var(--text-muted)' }">Belum ada penghasilan</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="order in completedOrders" :key="order.id"
          class="flex items-center gap-4 px-4 py-3 rounded-xl"
          :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, #22c55e, #16a34a);">
            <CheckCircleIcon class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" :style="{ color: 'var(--text-primary)' }">Order #{{ order.id }}</p>
            <p class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ order.created_at?.slice(0,10) }} · {{ order.vehicle?.license_plate || '-' }}</p>
          </div>
          <p class="text-sm font-bold shrink-0" :style="{ color: 'var(--accent)' }">Rp {{ formatRupiah(order.mechanic_fee) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { BanknotesIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const orders = ref([])
const loading = ref(true)

const completedOrders = computed(() => orders.value.filter(o => o.status === 'selesai'))
const totalEarnings = computed(() => completedOrders.value.reduce((sum, o) => sum + (o.mechanic_fee || 0), 0))
const avgFee = computed(() => completedOrders.value.length ? Math.round(totalEarnings.value / completedOrders.value.length) : 0)
const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
})
</script>
