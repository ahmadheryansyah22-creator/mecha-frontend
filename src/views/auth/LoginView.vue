<template>
  <div :class="isDark ? 'dark' : 'light'" class="min-h-screen flex" :style="{ backgroundColor: 'var(--bg-primary)' }">

    <!-- Left Panel -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
      style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a0a 50%, #0f0f0a 100%);">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style="background: radial-gradient(circle, #f5c518, transparent);"></div>
      <!-- Floating particles -->
      <div class="absolute w-2 h-2 rounded-full opacity-40 animate-bounce" style="background:#f5c518;top:20%;left:15%;animation-delay:0s;animation-duration:3s"></div>
      <div class="absolute w-1.5 h-1.5 rounded-full opacity-30 animate-bounce" style="background:#f5c518;top:60%;left:80%;animation-delay:1s;animation-duration:4s"></div>
      <div class="absolute w-1 h-1 rounded-full opacity-20 animate-bounce" style="background:#f5c518;top:80%;left:30%;animation-delay:2s;animation-duration:3.5s"></div>

      <div class="flex items-center gap-3 relative z-10">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-10 h-10 object-contain" />
        <span class="font-bold text-xl text-white">MECHA</span>
      </div>

      <div class="relative z-10 animate-fadein">
        <h2 class="text-4xl font-bold text-white mb-4 leading-tight">
          Kelola Bengkel <br>
          <span style="color: #f5c518;">Lebih Cerdas</span>
        </h2>
        <p class="text-gray-400 text-lg mb-8">Platform manajemen bengkel modern dengan AI Diagnostic terintegrasi.</p>
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
      <p class="text-gray-600 text-xs relative z-10">Â© 2026 MECHA. All rights reserved.</p>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md animate-fadein">
        <div class="flex items-center gap-3 mb-8 lg:hidden">
          <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-9 h-9 object-contain" />
          <span class="font-bold text-lg" :style="{ color: 'var(--accent)' }">MECHA</span>
        </div>

        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">Selamat Datang</h1>
            <p class="text-sm mt-1" :style="{ color: 'var(--text-secondary)' }">Masuk ke akun MECHA kamu</p>
          </div>
          <button @click="toggleTheme"
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-12"
            :style="{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }">
            <MoonIcon v-if="isDark" class="w-4 h-4 transition-transform" :style="{ color: 'var(--accent)' }" />
            <SunIcon v-else class="w-4 h-4 transition-transform" :style="{ color: 'var(--accent)' }" />
          </button>
        </div>

        <transition name="shake">
          <div v-if="errorMsg" class="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444;">
            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
            {{ errorMsg }}
          </div>
        </transition>

        <div class="space-y-4 mb-6">
          <div class="animate-fadein-delay-1">
            <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--text-secondary)' }">Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com"
              class="input-field transition-all focus:scale-[1.01]" @keyup.enter="login" />
          </div>
          <div class="animate-fadein-delay-2">
            <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--text-secondary)' }">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                class="input-field pr-10 transition-all focus:scale-[1.01]" @keyup.enter="login" />
              <button @click="showPassword = !showPassword" type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                :style="{ color: 'var(--text-muted)' }">
                <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <button @click="login" :disabled="loading"
          class="btn-primary w-full py-3 rounded-xl mb-4 disabled:opacity-50 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 animate-fadein-delay-3"
          :style="{ boxShadow: loading ? 'none' : '0 4px 20px rgba(245,197,24,0.3)' }">
          <span v-if="loading" class="flex items-center gap-2 justify-center">
            <ArrowPathIcon class="w-4 h-4 animate-spin" /> Memproses...
          </span>
          <span v-else>Masuk</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="flex-1 h-px" :style="{ backgroundColor: 'var(--border-color)' }"></div>
          <span class="text-xs" :style="{ color: 'var(--text-muted)' }">atau</span>
          <div class="flex-1 h-px" :style="{ backgroundColor: 'var(--border-color)' }"></div>
        </div>

        <button @click="loginWithGoogle" :disabled="googleLoading"
          class="w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-50 hover:scale-[1.02] hover:-translate-y-0.5 group"
          :style="{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }">
          <img src="https://www.google.com/favicon.ico" class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          {{ googleLoading ? 'Memproses...' : 'Masuk dengan Google' }}
        </button>

        <p class="text-center text-sm" :style="{ color: 'var(--text-muted)' }">
          Belum punya akun?
          <RouterLink to="/register"
            class="font-semibold hover:opacity-80 transition-all hover:underline underline-offset-2"
            :style="{ color: 'var(--accent)' }">
            Daftar sekarang
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'
import {
  CheckIcon, MoonIcon, SunIcon,
  EyeIcon, EyeSlashIcon,
  ArrowPathIcon, ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

const loading = ref(false)
const googleLoading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)
const form = ref({ email: '', password: '' })

const features = [
  'Manajemen order & transaksi real-time',
  'AI Diagnostic kendaraan otomatis',
  'Stok sparepart terintegrasi',
  'Multi-role: Bengkel, Mekanik & Customer',
]

const login = async () => {
  errorMsg.value = ''
  if (!form.value.email || !form.value.password) {
    errorMsg.value = 'Email dan password wajib diisi'
    return
  }
  loading.value = true
  try {
    const res = await axios.post('/api/login', form.value)
    if (res.data.success) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      const role = res.data.data.user.role
      if (role === 'customer') router.push('/customer')
      else if (role === 'mekanik') router.push('/portal-mekanik')
      else router.push('/dashboard')
    } else {
      errorMsg.value = res.data.message
    }
  } catch (err) {
    errorMsg.value = 'Email atau password salah.'
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  errorMsg.value = ''
  googleLoading.value = true
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    const res = await axios.post('/api/auth/google', { id_token: idToken })
    if (res.data.success) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      if (res.data.is_new) router.push('/pilih-role')
      else {
        const role = res.data.data.user.role
        if (role === 'customer') router.push('/customer')
        else if (role === 'mekanik') router.push('/portal-mekanik')
        else router.push('/dashboard')
      }
    } else {
      errorMsg.value = res.data.message
    }
  } catch (err) {
    errorMsg.value = 'Gagal masuk dengan Google.'
  } finally {
    googleLoading.value = false
  }
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
