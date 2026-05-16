<template>
  <div :class="isDark ? `dark` : `light`" class="min-h-screen" :style="{ backgroundColor: `var(--bg-primary)` }">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300" :style="{ backgroundColor: `var(--sidebar-bg)`, borderBottom: `1px solid var(--sidebar-border)` }">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="h-16 w-auto object-contain" />
        <h1 class="font-bold text-lg" :style="{ color: `var(--accent)` }">MECHA</h1>
      </div>

      <!-- Menu -->
      <div class="hidden md:flex items-center gap-2">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          :style="{ color: `var(--text-secondary)` }"
          active-class="!font-semibold"
        >
          <component :is="menu.icon" class="w-4 h-4 shrink-0" />
          <span>{{ menu.label }}</span>
        </RouterLink>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button @click="toggleTheme" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <MoonIcon v-if="isDark" class="w-5 h-5" :style="{ color: `var(--text-secondary)` }" />
          <SunIcon v-else class="w-5 h-5" :style="{ color: `var(--text-secondary)` }" />
        </button>

        <!-- Avatar Dropdown -->
        <div class="relative">
          <button @click="dropdownOpen = !dropdownOpen" class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <div class="w-7 h-7 rounded-full flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
              <span class="font-bold text-xs text-black">{{ userInitial }}</span>
            </div>
            <span class="text-sm font-medium hidden md:block" :style="{ color: `var(--text-primary)` }">{{ userName }}</span>
            <ChevronDownIcon class="w-4 h-4" :style="{ color: `var(--text-muted)` }" />
          </button>

          <!-- Dropdown Menu -->
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden"
            :style="{ backgroundColor: `var(--sidebar-bg)`, border: `1px solid var(--border-color)` }">
            <div class="px-4 py-3" :style="{ borderBottom: `1px solid var(--border-color)` }">
              <p class="text-sm font-semibold truncate" :style="{ color: `var(--text-primary)` }">{{ userName }}</p>
              <p class="text-xs" :style="{ color: `var(--text-muted)` }">Customer</p>
            </div>
            <RouterLink to="/customer/profil" @click="dropdownOpen = false"
              class="flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80"
              :style="{ color: `var(--text-secondary)` }">
              <UserIcon class="w-4 h-4" />
              Profil Saya
            </RouterLink>
            <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80 text-red-400">
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Click outside to close dropdown -->
    <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40"></div>

    <!-- Mobile Menu -->
    <div class="md:hidden flex overflow-x-auto gap-2 px-4 py-3 sticky top-16 z-30" :style="{ backgroundColor: `var(--sidebar-bg)`, borderBottom: `1px solid var(--sidebar-border)` }">
      <RouterLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all"
        :style="{ color: `var(--text-secondary)` }"
        active-class="!font-semibold"
      >
        <component :is="menu.icon" class="w-4 h-4 shrink-0" />
        <span>{{ menu.label }}</span>
      </RouterLink>
    </div>

    <!-- Content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import axios from "axios"
import {
  HomeIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  CpuChipIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline"

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const dropdownOpen = ref(false)

const menus = [
  { path: "/customer", icon: HomeIcon, label: "Beranda" },
  { path: "/customer/bengkel", icon: MapPinIcon, label: "Cari Bengkel" },
  { path: "/customer/order", icon: ClipboardDocumentListIcon, label: "Order Saya" },
  { path: "/customer/ai-diagnostic", icon: CpuChipIcon, label: "AI Diagnostic" },
]

const user = JSON.parse(localStorage.getItem("user") || "{}")
const userName = computed(() => user.name || "Customer")
const userInitial = computed(() => (user.name || "C")[0].toUpperCase())

const logout = async () => {
  dropdownOpen.value = false
  try {
    await axios.post("/api/logout")
  } finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }
}
</script>