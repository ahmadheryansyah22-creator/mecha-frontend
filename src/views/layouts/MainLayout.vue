<template>
  <div :class="isDark ? 'dark' : 'light'" class="flex min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">

    <aside class="fixed h-full z-50 flex flex-col transition-all duration-300"
      :style="{ width: collapsed ? '72px' : '240px', backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }">

      <!-- Logo -->
      <div class="flex items-center gap-3 p-4" :style="{ borderBottom: '1px solid var(--sidebar-border)', minHeight: '72px' }">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-10 h-10 object-contain shrink-0" />
        <transition name="fade">
          <div v-if="!collapsed">
            <h1 class="font-bold text-sm" :style="{ color: 'var(--accent)' }">MECHA</h1>
            <p class="text-xs" :style="{ color: 'var(--text-muted)' }">Bengkel Management</p>
          </div>
        </transition>
      </div>

      <!-- Toggle -->
      <button @click="collapsed = !collapsed"
        class="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all z-50"
        :style="{ backgroundColor: 'var(--accent)', color: '#000' }">
        <ChevronLeftIcon v-if="!collapsed" class="w-3 h-3" />
        <ChevronRightIcon v-else class="w-3 h-3" />
      </button>

      <!-- Menu -->
      <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto mt-2">
        <button v-for="menu in menus" :key="menu.path"
          @click="$router.push(menu.path)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative"
          :class="collapsed ? 'justify-center' : ''"
          :style="isActive(menu.path)
            ? { backgroundColor: 'var(--accent)', color: '#000', transform: 'scale(1.02)' }
            : { color: 'var(--text-secondary)' }">
          <!-- Icon dengan animasi -->
          <component :is="menu.icon"
            class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
            :class="isActive(menu.path) ? 'text-black' : ''" />
          <transition name="slide-fade">
            <span v-if="!collapsed" class="transition-all">{{ menu.label }}</span>
          </transition>
          <!-- Active indicator -->
          <div v-if="isActive(menu.path) && !collapsed"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-black opacity-60"></div>
          <!-- Tooltip -->
          <div v-if="collapsed"
            class="absolute left-16 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-lg"
            :style="{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)', color: 'var(--text-primary)' }">
            {{ menu.label }}
          </div>
        </button>
      </nav>

      <!-- Bottom -->
      <div class="p-2 space-y-1" :style="{ borderTop: '1px solid var(--sidebar-border)' }">
        <button @click="toggleTheme"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative hover:opacity-80"
          :class="collapsed ? 'justify-center' : ''"
          :style="{ backgroundColor: 'var(--bg-primary)' }">
          <MoonIcon v-if="isDark" class="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" :style="{ color: 'var(--accent)' }" />
          <SunIcon v-else class="w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform" :style="{ color: 'var(--accent)' }" />
          <transition name="slide-fade">
            <span v-if="!collapsed" class="text-sm" :style="{ color: 'var(--text-primary)' }">
              {{ isDark ? 'Mode Gelap' : 'Mode Terang' }}
            </span>
          </transition>
          <div v-if="collapsed"
            class="absolute left-16 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-lg"
            :style="{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)', color: 'var(--text-primary)' }">
            {{ isDark ? 'Mode Gelap' : 'Mode Terang' }}
          </div>
        </button>

        <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          :class="collapsed ? 'justify-center' : ''"
          :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-2 ring-offset-1"
            :style="{ backgroundColor: 'var(--accent)', ringColor: 'var(--accent)' }">
            <span class="font-bold text-sm text-black">{{ userInitial }}</span>
          </div>
          <transition name="slide-fade">
            <div v-if="!collapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">{{ userName }}</p>
              <p class="text-xs capitalize" :style="{ color: 'var(--text-muted)' }">{{ userRole }}</p>
            </div>
          </transition>
          <button @click="logout"
            class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all hover:scale-110">
            <ArrowRightOnRectangleIcon class="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 p-8 transition-all duration-300"
      :style="{ marginLeft: collapsed ? '72px' : '240px', backgroundColor: 'var(--bg-primary)' }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import axios from 'axios'
import {
  Squares2X2Icon, BuildingStorefrontIcon, TruckIcon, WrenchIcon,
  ClipboardDocumentListIcon, BanknotesIcon, CubeIcon, CpuChipIcon,
  MoonIcon, SunIcon, ArrowRightOnRectangleIcon, UserIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const collapsed = ref(false)

const menus = [
  { path: '/dashboard', icon: Squares2X2Icon, label: 'Dashboard' },
  { path: '/dashboard/bengkel', icon: BuildingStorefrontIcon, label: 'Bengkel' },
  { path: '/dashboard/kendaraan', icon: TruckIcon, label: 'Kendaraan' },
  { path: '/dashboard/daftar-mekanik', icon: WrenchIcon, label: 'Mekanik' },
  { path: '/dashboard/order', icon: ClipboardDocumentListIcon, label: 'Order Servis' },
  { path: '/dashboard/transaksi', icon: BanknotesIcon, label: 'Transaksi' },
  { path: '/dashboard/sparepart', icon: CubeIcon, label: 'Stok Sparepart' },
  { path: '/dashboard/ai-diagnostic', icon: CpuChipIcon, label: 'AI Diagnostic' },
  { path: '/dashboard/profil', icon: UserIcon, label: 'Profil Saya' },
]

const isActive = (path) => route.path === path || route.path === path + '/'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name || 'Admin')
const userInitial = computed(() => (user.name || 'A')[0].toUpperCase())
const userRole = computed(() => user.role || 'bengkel')

const logout = async () => {
  try { await axios.post('/api/logout') }
  finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(-8px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-8px); }
</style>
