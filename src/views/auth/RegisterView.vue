<template>
  <div :class="isDark ? 'dark' : 'light'" class="min-h-screen flex" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <!-- Left Panel -->
    <div class="hidden lg:flex flex-col w-1/2 px-12 relative overflow-hidden"
      style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a0a 50%, #0f0f0a 100%); min-height: 100vh; justify-content: center; align-items: flex-start;">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style="background: radial-gradient(circle, #f5c518, transparent);"></div>
      <div class="absolute w-2 h-2 rounded-full opacity-40 animate-bounce" style="background:#f5c518;top:25%;left:20%;animation-duration:3s"></div>
      <div class="absolute w-1.5 h-1.5 rounded-full opacity-30 animate-bounce" style="background:#f5c518;top:70%;left:75%;animation-delay:1.5s;animation-duration:4s"></div>

      <div class="absolute top-12 left-12 flex items-center gap-3 z-10">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-10 h-10 object-contain" />
        <span class="font-bold text-xl text-white">MECHA</span>
      </div>

      <div class="relative z-10 animate-fadein" style="margin-top: -280px;">
        <h2 class="text-4xl font-bold text-white mb-4 leading-tight">
          Mulai <br><span style="color: #f5c518;">Perjalananmu</span>
        </h2>
        <p class="text-gray-400 text-lg mb-8">Bergabung sebagai Customer, Bengkel, atau Mekanik.</p>
        <div class="space-y-3">
          <div v-for="(f, i) in features" :key="f"
            class="flex items-center gap-3 animate-fadein"
            :style="{ animationDelay: `${i * 100}ms` }">
            <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style="background: linear-gradient(135deg, #f5c518, #e0b015);">
              <CheckIcon class="w-3 h-3 text-black" />
            </div>
            <span class="text-gray-300 text-sm">{{ f }}</span>
          </div>
        </div>
      </div>
      <p class="absolute bottom-8 left-12 text-gray-600 text-xs">Ã‚Â© 2026 MECHA. All rights reserved.</p>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
      <div class="w-full max-w-md animate-fadein">
        <div class="flex items-center gap-3 mb-6 lg:hidden">
          <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-9 h-9 object-contain" />
          <span class="font-bold text-lg" :style="{ color: 'var(--accent)' }">MECHA</span>
        </div>

        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">Buat Akun Baru</h1>
            <p class="text-sm mt-1" :style="{ color: 'var(--text-secondary)' }">Daftar gratis, mulai sekarang</p>
          </div>
          <button @click="toggleTheme"
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            :style="{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }">
            <MoonIcon v-if="isDark" class="w-4 h-4 hover:rotate-12 transition-transform" :style="{ color: 'var(--accent)' }" />
            <SunIcon v-else class="w-4 h-4 hover:rotate-45 transition-transform" :style="{ color: 'var(--accent)' }" />
          </button>
        </div>

        <transition name="shake">
          <div v-if="errorMsg" class="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444;">
            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />{{ errorMsg }}
          </div>
        </transition>

        <!-- Role Selector dengan animasi -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--text-secondary)' }">Daftar sebagai</label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="(r, i) in roles" :key="r.value" @click="form.role = r.value"
              class="py-3 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-1.5 hover:scale-[1.05] active:scale-95"
              :style="form.role === r.value
                ? { background: 'linear-gradient(135deg, #f5c518, #e0b015)', color: '#000', borderColor: '#f5c518', transform: 'scale(1.05)', boxShadow: '0 4px 15px rgba(245,197,24,0.4)' }
                : { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }">
              <component :is="r.icon"
                class="w-5 h-5 transition-transform duration-300"
                :class="form.role === r.value ? 'scale-125' : ''" />
              <span>{{ r.label }}</span>
              <!-- Checkmark saat aktif -->
              <div v-if="form.role === r.value"
                class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                <CheckIcon class="w-2.5 h-2.5 text-yellow-400" />
              </div>
            </button>
          </div>
        </div>

        <div class="space-y-3 mb-5">
          <div v-for="(field, i) in fields" :key="field.key"
            class="animate-fadein" :style="{ animationDelay: `${i * 60}ms` }">
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--text-secondary)' }">{{ field.label }}</label>
            <div v-if="field.type === 'password'" class="relative">
              <input v-model="form[field.key]" :type="field.show.value ? 'text' : 'password'"
                :placeholder="field.placeholder" class="input-field pr-10 transition-all focus:scale-[1.01]" />
              <button @click="field.show.value = !field.show.value" type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                :style="{ color: 'var(--text-muted)' }">
                <EyeSlashIcon v-if="field.show.value" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
            <input v-else v-model="form[field.key]" :type="field.type"
              :placeholder="field.placeholder" class="input-field transition-all focus:scale-[1.01]" />
          </div>
        </div>

        <button @click="register" :disabled="loading"
          class="btn-primary w-full py-3 rounded-xl mb-4 disabled:opacity-50 hover:scale-[1.02] transition-all duration-200"
          :style="{ boxShadow: '0 4px 20px rgba(245,197,24,0.3)' }">
          <span v-if="loading" class="flex items-center gap-2 justify-center">
            <ArrowPathIcon class="w-4 h-4 animate-spin" /> Memproses...
          </span>
          <span v-else>Daftar Sekarang</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px" :style="{ backgroundColor: 'var(--border-color)' }"></div>
          <span class="text-xs" :style="{ color: 'var(--text-muted)' }">atau</span>
          <div class="flex-1 h-px" :style="{ backgroundColor: 'var(--border-color)' }"></div>
        </div>

        <button @click="registerWithGoogle" :disabled="googleLoading"
          class="w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 hover:scale-[1.02] hover:-translate-y-0.5 group"
          :style="{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }">
          <img src="https://www.google.com/favicon.ico" class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          {{ googleLoading ? 'Memproses...' : 'Daftar dengan Google' }}
        </button>

        <p class="text-center text-sm" :style="{ color: 'var(--text-muted)' }">
          Sudah punya akun?
          <RouterLink to="/login" class="font-semibold hover:opacity-80 hover:underline underline-offset-2 transition-all"
            :style="{ color: 'var(--accent)' }">Masuk di sini</RouterLink>
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
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/firebase"
import { CheckIcon, MoonIcon, SunIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, ExclamationCircleIcon, UserIcon, BuildingStorefrontIcon, WrenchIcon } from "@heroicons/vue/24/outline"

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const loading = ref(false)
const googleLoading = ref(false)
const errorMsg = ref("")
const showPassword = ref(false)
const showConfirm = ref(false)

const roles = [
  { value: "customer", icon: UserIcon, label: "Customer" },
  { value: "bengkel", icon: BuildingStorefrontIcon, label: "Bengkel" },
  { value: "mekanik", icon: WrenchIcon, label: "Mekanik" },
]

const features = ["Daftar gratis tanpa biaya", "AI Diagnostic kendaraan otomatis", "Order servis mudah & transparan", "Tersedia untuk Customer, Bengkel & Mekanik"]
const form = ref({ name: "", email: "", phone: "", password: "", password_confirmation: "", role: "customer" })

const fields = [
  { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
  { key: 'phone', label: 'No. Telepon', type: 'text', placeholder: '08xxxxxxxxxx' },
  { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter', show: showPassword },
  { key: 'password_confirmation', label: 'Konfirmasi Password', type: 'password', placeholder: 'Ulangi password', show: showConfirm },
]

const register = async () => {
  errorMsg.value = ""
  if (!form.value.name || !form.value.email || !form.value.password) { errorMsg.value = "Nama, email, dan password wajib diisi"; return }
  if (form.value.password !== form.value.password_confirmation) { errorMsg.value = "Password tidak cocok"; return }
  if (form.value.password.length < 8) { errorMsg.value = "Password minimal 8 karakter"; return }
  loading.value = true
  try {
    const res = await axios.post("/api/register", form.value)
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.data.user))
      const role = res.data.data.user.role
      if (role === "customer") router.push("/customer")
      else if (role === "mekanik") router.push("/portal-mekanik")
      else router.push("/")
    } else { errorMsg.value = res.data.message }
  } catch (err) { errorMsg.value = err.response?.data?.message || "Registrasi gagal." }
  finally { loading.value = false }
}

const registerWithGoogle = async () => {
  errorMsg.value = ""
  googleLoading.value = true
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    const res = await axios.post("/api/auth/google", { id_token: idToken, role: form.value.role })
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.data.user))
      if (res.data.is_new) router.push("/pilih-role")
      else {
        const role = res.data.data.user.role
        if (role === "customer") router.push("/customer")
        else if (role === "mekanik") router.push("/portal-mekanik")
        else router.push("/")
      }
    } else { errorMsg.value = res.data.message }
  } catch (err) { errorMsg.value = "Gagal daftar dengan Google." }
  finally { googleLoading.value = false }
}
</script>

<style scoped>
.shake-enter-active { animation: shake 0.4s ease; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
</style>
