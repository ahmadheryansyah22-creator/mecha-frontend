<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <HomeIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
        Dashboard Mekanik
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Selamat datang, {{ userName }}!</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <component :is="stat.icon" class="w-6 h-6" :style="{ color: `var(--accent)` }" />
        </div>
        <div>
          <p class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
        </div>
      </div>
    </div>
    <div class="card">
      <h2 class="font-semibold mb-4" :style="{ color: `var(--text-primary)` }">Order Terbaru</h2>
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="orders.length === 0" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Belum ada order</div>
      <div v-else class="space-y-3">
        <div v-for="order in orders.slice(0, 5)" :key="order.id" class="flex items-center justify-between p-3 rounded-xl"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <div>
            <p class="font-medium text-sm" :style="{ color: `var(--text-primary)` }">#{{ order.id }} - {{ order.customer_name || 'Customer' }}</p>
            <p class="text-xs mt-1" :style="{ color: `var(--text-muted)` }">{{ order.created_at?.slice(0,10) }}</p>
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusClass(order.status)">{{ order.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"
import { HomeIcon, ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon, TruckIcon } from "@heroicons/vue/24/outline"

const user = JSON.parse(localStorage.getItem("user") || "{}")
const userName = computed(() => user.name || "Mekanik")
const orders = ref([])
const loading = ref(true)

const stats = computed(() => [
  { label: "Total Order", value: orders.value.length, icon: ClipboardDocumentListIcon },
  { label: "Sedang Dikerjakan", value: orders.value.filter(o => o.status === "proses").length, icon: ClockIcon },
  { label: "Selesai", value: orders.value.filter(o => o.status === "selesai").length, icon: CheckCircleIcon },
  { label: "Kendaraan", value: new Set(orders.value.map(o => o.vehicle_id)).size, icon: TruckIcon },
])

const statusClass = (status) => {
  const map = { proses: "bg-yellow-500/20 text-yellow-400", selesai: "bg-green-500/20 text-green-400", pending: "bg-blue-500/20 text-blue-400", batal: "bg-red-500/20 text-red-400" }
  return map[status] || "bg-gray-500/20 text-gray-400"
}

onMounted(async () => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) { orders.value = [] }
  finally { loading.value = false }
})
</script>
