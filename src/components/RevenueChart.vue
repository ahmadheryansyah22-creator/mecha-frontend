<template>
  <div class="card animate-fadein">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-semibold flex items-center gap-2" :style="{ color: 'var(--text-primary)' }">
          <ChartBarIcon class="w-5 h-5" :style="{ color: 'var(--accent)' }" />
          Pendapatan & Order
        </h2>
        <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">7 hari terakhir</p>
      </div>
      <div class="flex gap-2">
        <button v-for="t in tabs" :key="t.value" @click="activeTab = t.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :style="activeTab === t.value
            ? { backgroundColor: 'var(--accent)', color: '#000' }
            : { backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }">
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div v-for="s in summary" :key="s.label" class="rounded-xl p-3 text-center"
        :style="{ backgroundColor: 'var(--bg-primary)' }">
        <p class="text-lg font-bold" :style="{ color: s.color }">{{ s.value }}</p>
        <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ s.label }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative" style="height:200px">
      <canvas ref="chartRef"></canvas>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mt-4 justify-center">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full" style="background:#f5c518"></div>
        <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Pendapatan</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full" style="background:#3b82f6"></div>
        <span class="text-xs" :style="{ color: 'var(--text-muted)' }">Order</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

Chart.register(...registerables)

const props = defineProps({ orders: { type: Array, default: () => [] } })
const chartRef = ref(null)
const activeTab = ref('revenue')
let chartInstance = null

const tabs = [
  { label: 'Pendapatan', value: 'revenue' },
  { label: 'Order', value: 'orders' },
]

// Generate 7 hari terakhir
const last7Days = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
    })
  }
  return days
})

const chartData = computed(() => {
  return last7Days.value.map(day => {
    const dayOrders = props.orders.filter(o => o.created_at?.slice(0, 10) === day.date)
    return {
      label: day.label,
      revenue: dayOrders.filter(o => o.status === 'completed' || o.status === 'selesai')
        .reduce((s, o) => s + (o.total_price || 0), 0),
      orders: dayOrders.length
    }
  })
})

const summary = computed(() => {
  const total = props.orders.filter(o => o.status === 'completed' || o.status === 'selesai')
    .reduce((s, o) => s + (o.total_price || 0), 0)
  const week = chartData.value.reduce((s, d) => s + d.orders, 0)
  const avg = week > 0 ? Math.round(total / week) : 0
  return [
    { label: 'Total Minggu Ini', value: 'Rp ' + new Intl.NumberFormat('id-ID').format(total), color: '#f5c518' },
    { label: 'Total Order', value: week, color: '#3b82f6' },
    { label: 'Rata-rata/Order', value: 'Rp ' + new Intl.NumberFormat('id-ID').format(avg), color: '#22c55e' },
  ]
})

const buildChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  const isRevenue = activeTab.value === 'revenue'
  const data = chartData.value
  const isDark = document.documentElement.classList.contains('dark')
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#8b8ba7' : '#6a6a8a'

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: data.map(d => d.label),
      datasets: [
        {
          label: isRevenue ? 'Pendapatan' : 'Order',
          data: data.map(d => isRevenue ? d.revenue : d.orders),
          backgroundColor: isRevenue
            ? data.map((_, i) => i === data.length - 1 ? '#f5c518' : 'rgba(245,197,24,0.4)')
            : data.map((_, i) => i === data.length - 1 ? '#3b82f6' : 'rgba(59,130,246,0.4)'),
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          titleColor: isDark ? '#ffffff' : '#0a0a1a',
          bodyColor: isDark ? '#8b8ba7' : '#3a3a5a',
          borderColor: isDark ? '#1e1e2e' : '#e0e0ec',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => isRevenue
              ? ' Rp ' + new Intl.NumberFormat('id-ID').format(ctx.raw)
              : ` ${ctx.raw} Order`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: (v) => isRevenue ? 'Rp ' + new Intl.NumberFormat('id-ID').format(v) : v
          }
        }
      }
    }
  })
}

watch([activeTab, () => props.orders], buildChart, { deep: true })
onMounted(() => setTimeout(buildChart, 100))
onUnmounted(() => { if (chartInstance) chartInstance.destroy() })
</script>
