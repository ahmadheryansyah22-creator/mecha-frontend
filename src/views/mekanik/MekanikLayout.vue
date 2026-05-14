<template>
  <div class="min-h-screen" :style="{ backgroundColor: `var(--bg-primary)` }">
    <aside class="fixed left-0 top-0 h-full w-64 z-50" :style="{ backgroundColor: `var(--bg-secondary)`, borderRight: `1px solid var(--border-color)` }">
      <div class="p-6 flex items-center justify-between" :style="{ borderBottom: `1px solid var(--border-color)` }">
        <div class="flex items-center gap-3">
          <img src="@/assets/logo-mecha.png" class="w-8 h-8" />
          <div>
            <h1 class="font-bold text-sm" :style="{ color: `var(--accent)` }">MECHA</h1>
            <p class="text-xs" :style="{ color: `var(--text-muted)` }">Portal Mekanik</p>
          </div>
        </div>
        <button @click="toggleTheme" class="w-8 h-8 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <MoonIcon v-if="isDark" class="w-4 h-4" :style="{ color: `var(--text-secondary)` }" />
          <SunIcon v-else class="w-4 h-4" :style="{ color: `var(--text-secondary)` }" />
        </button>
      </div>
      <nav class="p-4 space-y-1">
        <button v-for="item in menuItems" :key="item.name"
          @click="$router.push(item.path)"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
          :style="$route.path === item.path ? { backgroundColor: `var(--accent)`, color: `#000` } : { color: `var(--text-secondary)` }">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.label }}
        </button>
      </nav>
      <div class="absolute bottom-0 left-0 right-0 p-4" :style="{ borderTop: `1px solid var(--border-color)` }">
        <div class="flex items-center gap-3 mb-3 px-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :style="{ color: `var(--text-primary)` }">{{ userName }}</p>
            <p class="text-xs" :style="{ color: `var(--text-muted)` }">Mekanik</p>
          </div>
        </div>
        <button @click="logout" class="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          :style="{ color: `var(--text-secondary)`, border: `1px solid var(--border-color)` }">
          <ArrowRightOnRectangleIcon class="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
    <main class="ml-64 p-6 min-h-screen" :style="{ backgroundColor: `var(--bg-primary)` }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { HomeIcon, ClipboardDocumentListIcon, TruckIcon, CpuChipIcon, BanknotesIcon, ArrowRightOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name || 'Mekanik')
const userInitial = computed(() => (user.name || 'M')[0].toUpperCase())

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/portal-mekanik', icon: HomeIcon },
  { name: 'order', label: 'Order Masuk', path: '/portal-mekanik/order', icon: ClipboardDocumentListIcon },
  { name: 'kendaraan', label: 'Kendaraan', path: '/portal-mekanik/kendaraan', icon: TruckIcon },
  { name: 'penghasilan', label: 'Penghasilan', path: '/portal-mekanik/penghasilan', icon: BanknotesIcon },
  { name: 'ai', label: 'AI Diagnostic', path: '/portal-mekanik/ai-diagnostic', icon: CpuChipIcon },
]

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
