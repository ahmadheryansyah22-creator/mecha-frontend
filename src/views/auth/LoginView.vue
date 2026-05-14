<template>
  <div class="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-32 h-32 object-contain mx-auto mb-2" />
        <h1 class="text-3xl font-bold text-yellow-400">MECHA</h1>
        <p class="text-gray-400 mt-1">Sistem Manajemen Bengkel Mobil</p>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <h2 class="text-xl font-semibold text-white mb-6">Masuk ke Akun</h2>

        <div v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-2">Email</label>
            <input v-model="form.email" type="email" placeholder="email@mecha.com" class="input-field" required />
          </div>
          <div class="mb-6">
            <label class="block text-gray-400 text-sm mb-2">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="input-field" required />
          </div>
          <button type="submit" :disabled="loading" class="w-full btn-primary py-3 rounded-lg text-black font-semibold">
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-gray-800"></div>
          <span class="text-gray-500 text-xs">atau</span>
          <div class="flex-1 h-px bg-gray-800"></div>
        </div>

        <button
          @click="loginGoogle"
          :disabled="loadingGoogle"
          class="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition-all text-sm font-medium"
        >
          <img src="https://www.google.com/favicon.ico" class="w-5 h-5" />
          {{ loadingGoogle ? 'Memproses...' : 'Masuk dengan Google' }}
        </button>

        <p class="text-center text-gray-500 text-sm mt-6">
          Belum punya akun?
          <RouterLink to="/register" class="text-yellow-400 hover:text-yellow-300">Daftar sekarang</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase'

const router = useRouter()
const loading = ref(false)
const loadingGoogle = ref(false)
const error = ref('')
const form = ref({ email: '', password: '' })

const login = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.post('/api/login', form.value)
    localStorage.setItem('token', res.data.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.data.user))
    const role = res.data.data.user.role
    if (role === 'customer') router.push('/customer')
    else router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}

const loginGoogle = async () => {
  loadingGoogle.value = true
  error.value = ''
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()
    const res = await axios.post('/api/auth/google', { id_token: idToken })
    if (res.data.success) {
      localStorage.setItem('token', res.data.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      router.push('/pilih-role')
    } else {
      error.value = res.data.message
    }
  } catch (err) {
    error.value = 'Login Google gagal: ' + (err.message || 'Coba lagi')
  } finally {
    loadingGoogle.value = false
  }
}
</script>