<template>
  <div :class="isDark ? `dark` : `light`" class="min-h-screen" :style="{ backgroundColor: `var(--bg-primary)` }">
    <nav class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300"
      :style="{ backgroundColor: `var(--sidebar-bg)`, borderBottom: `1px solid var(--sidebar-border)` }">
      <div class="flex items-center gap-3">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="h-16 w-auto object-contain" />
        <h1 class="font-bold text-lg" :style="{ color: `var(--accent)` }">MECHA</h1>
      </div>

      <div class="hidden md:flex items-center gap-1">
        <button v-for="menu in menus" :key="menu.path"
          @click="$router.push(menu.path)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group hover:bg-yellow-400/10 hover:text-yellow-400 hover:shadow-[0_0_12px_rgba(245,197,24,0.3)]"
          :style="checkActive(menu.path)
            ? { backgroundColor: `rgba(245,197,24,0.12)`, color: `var(--accent)`, boxShadow: `0 0 16px rgba(245,197,24,0.5), inset 0 0 0 1px rgba(245,197,24,0.3)` }
            : { color: `var(--text-secondary)` }">
          <component :is="menu.icon"
            class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span>{{ menu.label }}</span>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button @click="toggleTheme" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <MoonIcon v-if="isDark" class="w-5 h-5 hover:rotate-12 transition-transform" :style="{ color: `var(--accent)` }" />
          <SunIcon v-else class="w-5 h-5 hover:rotate-45 transition-transform" :style="{ color: `var(--accent)` }" />
        </button>

        <div class="relative">
          <button @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-[1.02]"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <div class="w-7 h-7 rounded-full flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
              <span class="font-bold text-xs text-black">{{ userInitial }}</span>
            </div>
            <span class="text-sm font-medium hidden md:block" :style="{ color: `var(--text-primary)` }">{{ userName }}</span>
            <ChevronDownIcon class="w-4 h-4 transition-transform duration-200"
              :class="dropdownOpen ? 'rotate-180' : ''"
              :style="{ color: `var(--text-muted)` }" />
          </button>

          <transition name="dropdown">
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden"
              :style="{ backgroundColor: `var(--sidebar-bg)`, border: `1px solid var(--border-color)` }">
              <div class="px-4 py-3" :style="{ borderBottom: `1px solid var(--border-color)` }">
                <p class="text-sm font-semibold truncate" :style="{ color: `var(--text-primary)` }">{{ userName }}</p>
                <p class="text-xs" :style="{ color: `var(--text-muted)` }">Customer</p>
              </div>
              <button @click="() => { $router.push('/customer/profil'); dropdownOpen = false }"
                class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80"
                :style="{ color: `var(--text-secondary)` }">
                <UserIcon class="w-4 h-4" /> Profil Saya
              </button>
              <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-red-500/10 text-red-400">
                <ArrowRightOnRectangleIcon class="w-4 h-4" /> Keluar
              </button>
            </div>
          </transition>
        </div>
      </div>
    </nav>

    <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-40"></div>

    <!-- Mobile Menu -->
    <div class="md:hidden flex overflow-x-auto gap-2 px-4 py-3 sticky top-16 z-30"
      :style="{ backgroundColor: `var(--sidebar-bg)`, borderBottom: `1px solid var(--sidebar-border)` }">
      <button v-for="menu in menus" :key="menu.path"
        @click="$router.push(menu.path)"
        class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 font-medium"
        :style="checkActive(menu.path)
          ? { backgroundColor: `var(--accent)`, color: `#000` }
          : { color: `var(--text-secondary)`, border: `1px solid var(--border-color)` }">
        <component :is="menu.icon" class="w-4 h-4 shrink-0" />
        <span>{{ menu.label }}</span>
      </button>
    </div>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import axios from "axios"
import { StarIcon, UserCircleIcon,
  HomeIcon, MapPinIcon, ClipboardDocumentListIcon, CpuChipIcon,
  MoonIcon, SunIcon, ArrowRightOnRectangleIcon, UserIcon, ChevronDownIcon,
} from "@heroicons/vue/24/outline"

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const dropdownOpen = ref(false)

const menus = [
  { path: "/customer", icon: HomeIcon, label: "Beranda" },
  { path: "/customer/bengkel", icon: MapPinIcon, label: "Cari Bengkel" },
  { path: "/customer/order", icon: ClipboardDocumentListIcon, label: "Order Saya" },
  { path: "/customer/rating", icon: StarIcon, label: "Rating" },
  { path: "/customer/profil", icon: UserCircleIcon, label: "Profil" },
  { path: "/customer/ai-diagnostic", icon: CpuChipIcon, label: "AI Diagnostic" },
]

const checkActive = (path) => {
  if (path === "/customer") return route.path === "/customer"
  return route.path.startsWith(path)
}

const user = JSON.parse(localStorage.getItem("user") || "{}")
const userName = computed(() => user.name || "Customer")
const userInitial = computed(() => (user.name || "C")[0].toUpperCase())

const logout = async () => {
  dropdownOpen.value = false
  try { await axios.post("/api/logout") }
  finally {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }
}
</script>

<style scoped>
.dropdown-enter-active { transition: all 0.2s ease; }
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>
