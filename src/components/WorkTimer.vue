<template>
  <div class="card animate-fadein">
    <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
      <ClockIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Timer Pengerjaan
    </h2>

    <div v-if="!activeOrder" class="text-center py-8">
      <ClockIcon class="w-12 h-12 mx-auto mb-3 opacity-20" :style="{ color: 'var(--text-muted)' }" />
      <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Belum ada order aktif</p>
    </div>

    <div v-else>
      <!-- Order Info -->
      <div class="rounded-xl p-3 mb-4" :style="{ backgroundColor: 'var(--bg-primary)' }">
        <p class="text-xs mb-0.5" :style="{ color: 'var(--text-muted)' }">Order Aktif</p>
        <p class="font-semibold text-sm" :style="{ color: 'var(--text-primary)' }">{{ activeOrder.order_number }}</p>
        <p class="text-xs mt-0.5" :style="{ color: 'var(--text-secondary)' }">{{ activeOrder.vehicle?.license_plate }} • {{ activeOrder.vehicle?.brand }}</p>
      </div>

      <!-- Timer Display -->
      <div class="text-center mb-4">
        <div class="relative inline-flex items-center justify-center">
          <!-- Circle progress -->
          <svg class="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" stroke-width="6" />
            <circle cx="50" cy="50" r="42" fill="none" :stroke="isRunning ? '#f5c518' : '#6a6a8a'"
              stroke-width="6" stroke-linecap="round"
              :stroke-dasharray="`${2 * Math.PI * 42}`"
              :stroke-dashoffset="`${2 * Math.PI * 42 * (1 - (elapsed % 3600) / 3600)}`"
              style="transition: stroke-dashoffset 1s linear" />
          </svg>
          <div class="absolute text-center">
            <p class="text-2xl font-bold tabular-nums" :style="{ color: isRunning ? 'var(--accent)' : 'var(--text-primary)' }">
              {{ formattedTime }}
            </p>
            <p class="text-xs" :style="{ color: 'var(--text-muted)' }">{{ isRunning ? 'Berjalan' : 'Berhenti' }}</p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex gap-2">
        <button v-if="!isRunning" @click="startTimer"
          class="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
          <PlayIcon class="w-4 h-4" /> Mulai
        </button>
        <button v-else @click="pauseTimer"
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          style="background:#f59e0b20;color:#f59e0b;border:1px solid #f59e0b40">
          <PauseIcon class="w-4 h-4" /> Pause
        </button>
        <button @click="resetTimer"
          class="px-4 py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02]"
          :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }">
          <ArrowPathIcon class="w-4 h-4" />
        </button>
      </div>

      <!-- Selesai Button -->
      <button v-if="elapsed > 0" @click="selesaikan"
        class="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style="background:#22c55e20;color:#22c55e;border:1px solid #22c55e40">
        ✓ Tandai Selesai
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ClockIcon, PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ activeOrder: { type: Object, default: null } })
const emit = defineEmits(['selesai'])

const elapsed = ref(0)
const isRunning = ref(false)
let interval = null

const formattedTime = computed(() => {
  const h = Math.floor(elapsed.value / 3600)
  const m = Math.floor((elapsed.value % 3600) / 60)
  const s = elapsed.value % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
})

const startTimer = () => {
  isRunning.value = true
  interval = setInterval(() => elapsed.value++, 1000)
}

const pauseTimer = () => {
  isRunning.value = false
  clearInterval(interval)
}

const resetTimer = () => {
  pauseTimer()
  elapsed.value = 0
}

const selesaikan = () => {
  pauseTimer()
  emit('selesai', { orderId: props.activeOrder?.id, duration: elapsed.value })
  elapsed.value = 0
}

onUnmounted(() => clearInterval(interval))
</script>
