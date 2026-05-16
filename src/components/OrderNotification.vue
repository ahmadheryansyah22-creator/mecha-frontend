<template>
  <transition name="notif">
    <div v-if="show" class="fixed top-6 right-6 z-[999] max-w-sm w-full animate-fadein">
      <div class="rounded-2xl p-4 shadow-2xl flex items-start gap-4"
        :style="{ backgroundColor: 'var(--sidebar-bg)', border: '2px solid var(--accent)' }">
        <!-- Pulse icon -->
        <div class="relative shrink-0">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center"
            style="background:linear-gradient(135deg,#f5c518,#d97706)">
            <BellAlertIcon class="w-6 h-6 text-black" />
          </div>
          <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">!</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm" :style="{ color: 'var(--accent)' }">Order Baru Masuk!</p>
          <p class="text-xs mt-0.5 truncate" :style="{ color: 'var(--text-primary)' }">{{ order?.order_number }}</p>
          <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">
            {{ order?.vehicle?.license_plate }} • {{ order?.vehicle?.brand }}
          </p>
          <div class="flex gap-2 mt-3">
            <button @click="accept"
              class="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-transform">
              Lihat Order
            </button>
            <button @click="dismiss"
              class="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-70"
              :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }">
              Tutup
            </button>
          </div>
        </div>
        <!-- Auto close bar -->
        <div class="absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all"
          :style="{ width: barWidth + '%', backgroundColor: 'var(--accent)' }"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { BellAlertIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  order: { type: Object, default: null },
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['dismiss'])
const router = useRouter()
const barWidth = ref(100)
let countdown = null

watch(() => props.show, (val) => {
  if (val) {
    barWidth.value = 100
    countdown = setInterval(() => {
      barWidth.value -= 2
      if (barWidth.value <= 0) dismiss()
    }, 100)
  } else {
    clearInterval(countdown)
  }
})

const accept = () => {
  dismiss()
  router.push('/portal-mekanik/order')
}

const dismiss = () => {
  clearInterval(countdown)
  emit('dismiss')
}

onUnmounted(() => clearInterval(countdown))
</script>

<style scoped>
.notif-enter-active { transition: all 0.3s ease; }
.notif-leave-active { transition: all 0.25s ease; }
.notif-enter-from { opacity: 0; transform: translateX(100px) scale(0.9); }
.notif-leave-to { opacity: 0; transform: translateX(100px) scale(0.9); }
</style>
