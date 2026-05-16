<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <HomeIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" />
          Dashboard Mekanik
        </h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">{{ greeting }}, {{ userName }}! Siap bekerja hari ini?</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ currentDate }}</p>
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ currentTime }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card hover:scale-[1.02] transition-transform cursor-default">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{ backgroundColor: stat.bg }">
            <component :is="stat.icon" class="w-6 h-6" :style="{ color: stat.color }" />
          </div>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :style="{ backgroundColor: stat.bg, color: stat.color }">{{ stat.badge }}</span>
        </div>
        <p class="text-3xl font-bold" :style="{ color: `var(--text-primary)` }">{{ stat.value }}</p>
        <p class="text-sm mt-1" :style="{ color: `var(--text-secondary)` }">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <BoltIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Aksi Cepat
        </h2>
        <div class="space-y-2">
          <RouterLink v-for="action in quickActions" :key="action.path" :to="action.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-80"
            :style="{ backgroundColor: `var(--bg-primary)` }">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: action.bg }">
              <component :is="action.icon" class="w-4 h-4" :style="{ color: action.color }" />
            </div>
            <span class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ action.label }}</span>
            <ChevronRightIcon class="w-4 h-4 ml-auto" :style="{ color: `var(--text-muted)` }" />
          </RouterLink>
        </div>
      </div>

      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ChartPieIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Status Order
        </h2>
        <div class="space-y-3">
          <div v-for="s in orderStatus" :key="s.label" class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: s.color }"></div>
            <span class="text-sm flex-1" :style="{ color: `var(--text-secondary)` }">{{ s.label }}</span>
            <span class="text-sm font-bold" :style="{ color: `var(--text-primary)` }">{{ s.value }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <BanknotesIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Ringkasan Penghasilan
        </h2>
        <div class="space-y-3">
          <div class="p-4 rounded-xl" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Total Order Selesai</p>
            <p class="text-2xl font-bold" :style="{ color: `var(--accent)` }">{{ orders.filter(o => o.status === 'completed').length }}</p>
          </div>
          <div class="p-4 rounded-xl" :style="{ backgroundColor: `var(--bg-primary)` }">
            <p class="text-xs mb-1" :style="{ color: `var(--text-muted)` }">Order Bulan Ini</p>
            <p class="text-2xl font-bold" style="color: #3b82f6;">{{ ordersThisMonth }}</p>
          </div>
          <RouterLink to="/portal-mekanik/penghasilan"
            class="flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium"
            :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
            <BanknotesIcon class="w-4 h-4" /> Lihat Detail
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-semibold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <ClipboardDocumentListIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" />
          Order Terbaru
        </h2>
        <RouterLink to="/portal-mekanik/order" class="text-sm font-medium flex items-center gap-1" :style="{ color: `var(--accent)` }">
          Lihat semua <ChevronRightIcon class="w-4 h-4" />
        </RouterLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" :style="{ borderColor: `var(--accent)`, borderTopColor: `transparent` }"></div>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Memuat data...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-12">
        <ClipboardDocumentListIcon class="w-16 h-16 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p class="font-medium mb-1" :style="{ color: `var(--text-primary)` }">Belum ada order</p>
        <p class="text-sm" :style="{ color: `var(--text-muted)` }">Order baru akan muncul di sini</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="order in orders.slice(0, 5)" :key="order.id"
          class="flex items-center gap-4 p-4 rounded-xl"
          :style="{ backgroundColor: `var(--bg-primary)` }">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: #f59e0b20;">
            <ClipboardDocumentListIcon class="w-5 h-5" style="color: #f59e0b;" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate" :style="{ color: `var(--text-primary)` }">#{{ order.order_number || order.id }}</p>
            <p class="text-xs truncate" :style="{ color: `var(--text-muted)` }">{{ order.created_at?.slice(0,10) }}</p>
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-medium shrink-0" :style="getStatusStyle(order.status)">{{ order.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { RouterLink } from "vue-router"
import axios from "axios"
import {
  HomeIcon, ClipboardDocumentListIcon, CheckCircleIcon,
  ClockIcon, TruckIcon, BoltIcon, ChevronRightIcon,
  ChartPieIcon, BanknotesIcon,
} from "@heroicons/vue/24/outline"

const user = JSON.parse(localStorage.getItem("user") || "{}")
const userName = computed(() => user.name || "Mekanik")
const orders = ref([])
const loading = ref(true)
const currentTime = ref("")
const currentDate = ref("")
let timer = null

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return "Selamat pagi"
  if (h < 15) return "Selamat siang"
  if (h < 18) return "Selamat sore"
  return "Selamat malam"
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString("id-ID")
  currentDate.value = now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

const stats = computed(() => [
  { label: "Total Order", value: orders.value.length, badge: "Semua", icon: ClipboardDocumentListIcon, bg: "#f59e0b20", color: "#f59e0b" },
  { label: "Sedang Dikerjakan", value: orders.value.filter(o => o.status === "in_progress").length, badge: "Aktif", icon: ClockIcon, bg: "#3b82f620", color: "#3b82f6" },
  { label: "Selesai", value: orders.value.filter(o => o.status === "completed").length, badge: "Done", icon: CheckCircleIcon, bg: "#22c55e20", color: "#22c55e" },
  { label: "Kendaraan", value: new Set(orders.value.map(o => o.vehicle_id)).size, badge: "Unik", icon: TruckIcon, bg: "#a855f720", color: "#a855f7" },
])

const orderStatus = computed(() => [
  { label: "Pending", value: orders.value.filter(o => o.status === "pending").length, color: "#f59e0b" },
  { label: "Sedang Dikerjakan", value: orders.value.filter(o => o.status === "in_progress").length, color: "#3b82f6" },
  { label: "Selesai", value: orders.value.filter(o => o.status === "completed").length, color: "#22c55e" },
  { label: "Dibatalkan", value: orders.value.filter(o => o.status === "cancelled").length, color: "#ef4444" },
])

const ordersThisMonth = computed(() => {
  const now = new Date()
  return orders.value.filter(o => {
    if (!o.created_at) return false
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
})

const quickActions = [
  { label: "Lihat Order Masuk", path: "/portal-mekanik/order", icon: ClipboardDocumentListIcon, bg: "#f59e0b20", color: "#f59e0b" },
  { label: "Data Kendaraan", path: "/portal-mekanik/kendaraan", icon: TruckIcon, bg: "#3b82f620", color: "#3b82f6" },
  { label: "Penghasilan Saya", path: "/portal-mekanik/penghasilan", icon: BanknotesIcon, bg: "#22c55e20", color: "#22c55e" },
]

const getStatusStyle = (status) => {
  const map = {
    pending: { backgroundColor: "#f59e0b20", color: "#f59e0b" },
    in_progress: { backgroundColor: "#3b82f620", color: "#3b82f6" },
    completed: { backgroundColor: "#22c55e20", color: "#22c55e" },
    cancelled: { backgroundColor: "#ef444420", color: "#ef4444" },
  }
  return map[status] || { backgroundColor: "#6b728020", color: "#6b7280" }
}

onMounted(async () => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  try {
    const token = localStorage.getItem("token")
    const res = await axios.get("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
    orders.value = res.data.data?.data || res.data.data || []
  } catch (e) {
    orders.value = []
  } finally {
    loading.value = false
  }
})

onUnmounted(() => clearInterval(timer))
</script>