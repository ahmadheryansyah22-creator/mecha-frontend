<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: 'var(--text-primary)' }">
        <StarIcon class="w-7 h-7" :style="{ color: 'var(--accent)' }" />
        Rating & Review
      </h1>
      <p class="mt-1" :style="{ color: 'var(--text-secondary)' }">Beri penilaian untuk servis yang sudah selesai</p>
    </div>

    <!-- Order yang bisa dirating -->
    <div v-if="loading" class="card text-center py-8" :style="{ color: 'var(--text-muted)' }">
      Memuat data...
    </div>

    <div v-else-if="completedOrders.length === 0" class="card text-center py-12">
      <StarIcon class="w-12 h-12 mx-auto mb-4" :style="{ color: 'var(--text-muted)' }" />
      <p class="font-medium" :style="{ color: 'var(--text-primary)' }">Belum ada order yang selesai</p>
      <p class="text-sm mt-1" :style="{ color: 'var(--text-muted)' }">Rating bisa diberikan setelah order selesai</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in completedOrders" :key="order.id" class="card">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold" :style="{ color: 'var(--text-primary)' }">{{ order.order_number }}</h3>
            <p class="text-sm mt-1" :style="{ color: 'var(--text-secondary)' }">
              {{ order.bengkel?.name }} • {{ order.vehicle?.license_plate }}
            </p>
          </div>
          <span v-if="order.rated" class="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
            style="background-color: #22c55e20; color: #22c55e;">
            <CheckCircleIcon class="w-3 h-3" /> Sudah dirating
          </span>
          <span v-else class="text-xs px-3 py-1 rounded-full font-medium"
            :style="{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }">
            Belum dirating
          </span>
        </div>

        <!-- Form Rating -->
        <div v-if="!order.rated">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">Kualitas Servis</p>
              <div class="flex gap-1">
                <button v-for="s in 5" :key="s" @click="setRating(order.id, 'service_quality', s)">
                  <StarIcon class="w-7 h-7 transition-all"
                    :style="{ color: s <= (ratings[order.id]?.service_quality || 0) ? '#f59e0b' : 'var(--text-muted)' }" />
                </button>
              </div>
            </div>
            <div>
              <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">Profesionalisme</p>
              <div class="flex gap-1">
                <button v-for="s in 5" :key="s" @click="setRating(order.id, 'professionalism', s)">
                  <StarIcon class="w-7 h-7 transition-all"
                    :style="{ color: s <= (ratings[order.id]?.professionalism || 0) ? '#f59e0b' : 'var(--text-muted)' }" />
                </button>
              </div>
            </div>
            <div>
              <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">Ketepatan Waktu</p>
              <div class="flex gap-1">
                <button v-for="s in 5" :key="s" @click="setRating(order.id, 'timeliness', s)">
                  <StarIcon class="w-7 h-7 transition-all"
                    :style="{ color: s <= (ratings[order.id]?.timeliness || 0) ? '#f59e0b' : 'var(--text-muted)' }" />
                </button>
              </div>
            </div>
            <div>
              <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">Penilaian Keseluruhan</p>
              <div class="flex gap-1">
                <button v-for="s in 5" :key="s" @click="setRating(order.id, 'overall_rating', s)">
                  <StarIcon class="w-7 h-7 transition-all"
                    :style="{ color: s <= (ratings[order.id]?.overall_rating || 0) ? '#f59e0b' : 'var(--text-muted)' }" />
                </button>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">Ulasan (opsional)</p>
            <textarea v-model="ratings[order.id].review" rows="3" class="input-field"
              placeholder="Ceritakan pengalaman servis kamu..."></textarea>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <p class="text-sm" :style="{ color: 'var(--text-secondary)' }">Rekomendasikan?</p>
              <button @click="ratings[order.id].would_recommend = true"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                :style="ratings[order.id]?.would_recommend ? { backgroundColor: '#22c55e20', color: '#22c55e' } : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }">
                <HandThumbUpIcon class="w-4 h-4 inline mr-1" /> Ya
              </button>
              <button @click="ratings[order.id].would_recommend = false"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                :style="ratings[order.id]?.would_recommend === false ? { backgroundColor: '#ef444420', color: '#ef4444' } : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }">
                <HandThumbDownIcon class="w-4 h-4 inline mr-1" /> Tidak
              </button>
            </div>
            <button @click="submitRating(order)" :disabled="submitting[order.id]"
              class="btn-primary px-6 py-2 rounded-lg flex items-center gap-2">
              <PaperAirplaneIcon class="w-4 h-4" />
              {{ submitting[order.id] ? 'Mengirim...' : 'Kirim Rating' }}
            </button>
          </div>
        </div>

        <!-- Tampilkan rating yang sudah ada -->
        <div v-else class="flex gap-1">
          <StarIcon v-for="s in 5" :key="s" class="w-5 h-5"
            :style="{ color: s <= order.rating?.overall_rating ? '#f59e0b' : 'var(--text-muted)' }" />
          <span class="text-sm ml-2" :style="{ color: 'var(--text-secondary)' }">{{ order.rating?.review }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  StarIcon, CheckCircleIcon, HandThumbUpIcon,
  HandThumbDownIcon, PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const loading = ref(true)
const completedOrders = ref([])
const ratings = ref({})
const submitting = ref({})

const setRating = (orderId, field, value) => {
  if (!ratings.value[orderId]) ratings.value[orderId] = {}
  ratings.value[orderId][field] = value
}

const submitRating = async (order) => {
  const r = ratings.value[order.id]
  if (!r?.overall_rating) return alert('Berikan penilaian keseluruhan dulu!')
  submitting.value[order.id] = true
  try {
    await axios.post('/api/ratings', {
      order_id: order.id,
      mechanic_id: order.mechanic_id || 1,
      service_quality: r.service_quality || r.overall_rating,
      professionalism: r.professionalism || r.overall_rating,
      timeliness: r.timeliness || r.overall_rating,
      overall_rating: r.overall_rating,
      review: r.review || '',
      would_recommend: r.would_recommend ?? true,
      tanggal_rating: new Date().toISOString().slice(0, 10),
    })
    order.rated = true
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal mengirim rating')
  } finally {
    submitting.value[order.id] = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/orders')
    const orders = res.data.data.data || []
    completedOrders.value = orders
      .filter(o => o.status === 'completed' || o.status === 'selesai')
      .map(o => ({ ...o, rated: false }))
    completedOrders.value.forEach(o => {
      ratings.value[o.id] = { service_quality: 0, professionalism: 0, timeliness: 0, overall_rating: 0, review: '', would_recommend: true }
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>