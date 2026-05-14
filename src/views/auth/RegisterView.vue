<template>
  <div :class="isDark ? `dark` : `light`" class="min-h-screen flex items-center justify-center px-4 py-8" :style="{ backgroundColor: `var(--bg-primary)` }">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="mx-auto -mt-8" style="width: 200px; height: 200px;">
          <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-3xl font-bold -mb-2" :style="{ color: `var(--accent)` }">MECHA</h1>
        <p class="mt-1 text-sm" :style="{ color: `var(--text-muted)` }">Bengkel Management System</p>
      </div>

      <div class="rounded-2xl p-8" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold" :style="{ color: `var(--text-primary)` }">Buat Akun Baru</h2>
          <button @click="toggleTheme" class="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
            <MoonIcon v-if="isDark" class="w-5 h-5" :style="{ color: `var(--text-secondary)` }" />
            <SunIcon v-else class="w-5 h-5" :style="{ color: `var(--text-secondary)` }" />
          </button>
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 rounded-xl text-sm text-red-400 bg-red-500/10 border border-red-500/20">
          {{ errorMsg }}
        </div>

        <!-- Role Selector -->
        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Daftar sebagai</label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="r in roles" :key="r.value" @click="form.role = r.value"
              class="py-3 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-1"
              :style="form.role === r.value ? { backgroundColor: `var(--accent)`, color: `#000`, borderColor: `var(--accent)` } : { backgroundColor: `var(--bg-primary)`, color: `var(--text-secondary)`, borderColor: `var(--border-color)` }">
              <component :is="r.icon" class="w-5 h-5" />
              <span>{{ r.label }}</span>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Lengkap</label>
          <input v-model="form.name" type="text" placeholder="Nama lengkap"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Email</label>
          <input v-model="form.email" type="email" placeholder="email@example.com"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">No. Telepon</label>
          <input v-model="form.phone" type="text" placeholder="08xxxxxxxxxx"
            class="w-full px-4 py-3 rounded-xl text-sm outline-none"
            :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Password</label>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Min. 8 karakter"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
              :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
            <button @click="showPassword = !showPassword" type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg"
              :style="{ color: `var(--text-muted)` }">
              <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Konfirmasi Password</label>
          <div class="relative">
            <input v-model="form.password_confirmation" :type="showConfirm ? 'text' : 'password'" placeholder="Ulangi password"
              class="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
              :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-primary)` }" />
            <button @click="showConfirm = !showConfirm" type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg"
              :style="{ color: `var(--text-muted)` }">
              <EyeSlashIcon v-if="showConfirm" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button @click="register" :disabled="loading"
          class="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
          :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
          {{ loading ? "Memproses..." : "Daftar Sekarang" }}
        </button>

        <p class="text-center mt-4 text-sm" :style="{ color: `var(--text-muted)` }">
          Sudah punya akun?
          <RouterLink to="/login" class="font-semibold" :style="{ color: `var(--accent)` }">Masuk di sini</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import axios from "axios"
import { MoonIcon, SunIcon, EyeIcon, EyeSlashIcon, UserIcon, BuildingStorefrontIcon, WrenchIcon } from "@heroicons/vue/24/outline"

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

const loading = ref(false)
const errorMsg = ref("")
const showPassword = ref(false)
const showConfirm = ref(false)

const roles = [
  { value: "customer", icon: UserIcon, label: "Customer" },
  { value: "bengkel", icon: BuildingStorefrontIcon, label: "Bengkel" },
  { value: "mekanik", icon: WrenchIcon, label: "Mekanik" },
]

const form = ref({
  name: "", email: "", phone: "",
  password: "", password_confirmation: "",
  role: "customer"
})

const register = async () => {
  loading.value = true
  errorMsg.value = ""
  try {
    const res = await axios.post("/api/register", form.value)
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.data.user))
      const role = res.data.data.user.role
      if (role === "customer") router.push("/customer")
      else if (role === "mekanik") router.push("/portal-mekanik")
      else router.push("/")
    } else {
      errorMsg.value = res.data.message
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Registrasi gagal. Coba lagi."
  } finally {
    loading.value = false
  }
}
</script>
