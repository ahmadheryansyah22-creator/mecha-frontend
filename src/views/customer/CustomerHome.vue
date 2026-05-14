<template>
  <div>
    <!-- Hero -->
    <div class="rounded-3xl p-10 mb-10" :style="{ background: `linear-gradient(135deg, var(--accent)20, transparent)`, border: `1px solid var(--accent)30` }">
      <div class="max-w-2xl">
        <h1 class="text-4xl font-bold mb-4" :style="{ color: `var(--text-primary)` }">
          Kendaraan Rusak? <br>
          <span :style="{ color: `var(--accent)` }">MECHA Siap Membantu!</span>
        </h1>
        <p class="text-lg mb-8" :style="{ color: `var(--text-secondary)` }">Temukan bengkel terdekat atau panggil mekanik langsung ke lokasi kamu. Cepat, terpercaya, dan transparan.</p>
        <div class="flex gap-4">
          <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <BuildingStorefrontIcon class="w-5 h-5" /> Cari Bengkel
          </RouterLink>
          <RouterLink to="/customer/bengkel?type=mekanik" class="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
            :style="{ border: `1px solid var(--accent)`, color: `var(--accent)` }">
            <WrenchScrewdriverIcon class="w-5 h-5" /> Panggil Mekanik
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Fitur -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div v-for="f in fitur" :key="f.title" class="card text-center">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <component :is="f.icon" class="w-7 h-7" :style="{ color: `var(--accent)` }" />
        </div>
        <h3 class="font-semibold mb-2" :style="{ color: `var(--text-primary)` }">{{ f.title }}</h3>
        <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ f.desc }}</p>
      </div>
    </div>

    <!-- Order Terakhir -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold" :style="{ color: `var(--text-primary)` }">Order Terakhir Saya</h2>
        <RouterLink to="/customer/order" class="text-sm hover:opacity-80" :style="{ color: `var(--accent)` }">Lihat semua →</RouterLink>
      </div>
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="orders.length === 0" class="text-center py-8">
        <TruckIcon class="w-16 h-16 mx-auto mb-4" :style="{ color: `var(--text-muted)` }" />
        <p class="mb-4" :style="{ color: `var(--text-secondary)` }">Belum ada order servis</p>
        <RouterLink to="/customer/bengkel" class="btn-primary px-6 py-2 rounded-xl inline-block">Mulai Sekarang</RouterLink>
      </div>
      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id" class="rounded-xl p-4 flex items-center justify-between"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <div>
            <p class="font-medium text-sm" :style="{ color: `var(--text-primary)` }">{{ order.order_number }}</p>
            <p class="text-xs mt-1" :style="{ color: `var(--text-secondary)` }">{{ order.vehicle?.license_plate }} • {{ order.bengkel?.name }}</p>
          </div>
          <div class="text-right">
            <span class="text-xs px-2 py-1 rounded-full" :class="statusClass(order.status)">{{ order.status }}</span>
            <p class="text-sm font-medium mt-1" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(order.final_price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { BuildingStorefrontIcon, WrenchScrewdriverIcon, MapPinIcon, CubeIcon, TruckIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const orders = ref([])

const fitur = [
  { icon: MapPinIcon, title: 'Bengkel Terdekat', desc: 'Temukan bengkel terpercaya di sekitar lokasi kamu dengan mudah' },
  { icon: WrenchScrewdriverIcon, title: 'Mekanik Panggilan', desc: 'Mekanik profesional datang langsung ke lokasi kendaraan kamu' },
  { icon: CubeIcon, title: 'Sparepart Tersedia', desc: 'Bengkel kami menyediakan stok sparepart lengkap untuk semua jenis kendaraan' },
]

const statusClass = (s) => ({
  pending: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}[s] || 'bg-gray-500/20 text-gray-400')

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v)

onMounted(async () => {
  try {
    const res = await axios.get('/api/orders')
    orders.value = res.data.data.data?.slice(0, 3) || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})
</script>
