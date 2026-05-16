<template>
  <div class="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="h-16 w-auto object-contain mx-auto mb-2" />
        <h1 class="text-3xl font-bold text-yellow-400">MECHA</h1>
        <p class="text-gray-400 mt-1">Sistem Manajemen Bengkel Mobil</p>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <h2 class="text-xl font-semibold text-white mb-6">Buat Akun Baru</h2>

        <div v-if="error" class="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
          {{ error }}
        </div>

        <div class="mb-5">
          <label class="block text-gray-400 text-sm mb-2">Daftar sebagai</label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="r in roles" :key="r.value" type="button" @click="form.role = r.value"
              class="py-3 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-2"
              :class="form.role === r.value ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-[#0f0f0f] text-gray-400 border-gray-700 hover:border-yellow-400'">
              <component :is="r.icon" class="w-5 h-5" />
              <span>{{ r.label }}</span>
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-2">Nama Lengkap</label>
          <input v-model="form.name" type="text" placeholder="Nama Lengkap" class="input-field" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-2">Email</label>
          <input v-model="form.email" type="email" placeholder="email@gmail.com" class="input-field" />
          <p v-if="emailError" class="text-red-400 text-xs mt-1">{{ emailError }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-2">No. Telepon</label>
          <input v-model="form.phone" type="tel" placeholder="081234567890" class="input-field" maxlength="13" @input="onPhoneInput" />
          <p class="text-gray-600 text-xs mt-1">Format: 081234567890 (wajib valid)</p>
          <p v-if="phoneError" class="text-red-400 text-xs mt-1">{{ phoneError }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-2">Password</label>
          <div class="relative">
            <input v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Min. 8 karakter" class="input-field pr-10" />
            <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <component :is="showPass ? EyeSlashIcon : EyeIcon" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-2">Konfirmasi Password</label>
          <input v-model="form.password_confirmation" :type="showPass ? 'text' : 'password'" placeholder="Ulangi password" class="input-field" />
          <p v-if="form.password && form.password_confirmation && form.password !== form.password_confirmation" class="text-red-400 text-xs mt-1">Password tidak cocok</p>
          <p v-if="form.password && form.password_confirmation && form.password === form.password_confirmation" class="text-green-400 text-xs mt-1">Password cocok</p>
        </div>

        <button @click="register" :disabled="loading" class="w-full btn-primary py-3 rounded-lg font-semibold mb-4">
          {{ loading ? 'Memproses...' : 'Daftar Sekarang' }}
        </button>

        <p class="text-center text-gray-500 text-sm">
          Sudah punya akun?
          <RouterLink to="/login" class="text-yellow-400 hover:text-yellow-300">Masuk di sini</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const phoneError = ref('')
const emailError = ref('')
const showPass = ref(false)

const roles = [
  { value: 'customer', icon: TruckIcon, label: 'Customer' },
  { value: 'bengkel', icon: BuildingStorefrontIcon, label: 'Bengkel' },
  { value: 'mekanik', icon: WrenchScrewdriverIcon, label: 'Mekanik' },
]

const form = ref({
  name: '', email: '', phone: '',
  password: '', password_confirmation: '', role: 'customer'
})

const onPhoneInput = () => {
  phoneError.value = ''
  form.value.phone = form.value.phone.replace(/[^0-9]/g, '')
}

const validatePhone = (phone) => {
  if (!phone) return { valid: false, msg: 'Nomor HP wajib diisi' }
  if (!/^08[1-9][0-9]{7,9}$/.test(phone)) return { valid: false, msg: 'Nomor tidak valid. Contoh: 081234567890' }
  return { valid: true }
}

const validateEmail = (email) => {
  if (!email) return { valid: false, msg: 'Email wajib diisi' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, msg: 'Format email tidak valid' }
  return { valid: true }
}

const register = async () => {
  error.value = ''
  phoneError.value = ''
  emailError.value = ''

  if (!form.value.name.trim()) { error.value = 'Nama wajib diisi'; return }
  const emailCheck = validateEmail(form.value.email)
  if (!emailCheck.valid) { emailError.value = emailCheck.msg; return }
  const phoneCheck = validatePhone(form.value.phone)
  if (!phoneCheck.valid) { phoneError.value = phoneCheck.msg; return }
  if (!form.value.password) { error.value = 'Password wajib diisi'; return }
  if (form.value.password.length < 8) { error.value = 'Password minimal 8 karakter'; return }
  if (form.value.password !== form.value.password_confirmation) { error.value = 'Password tidak cocok'; return }

  loading.value = true
  try {
    const res = await axios.post('/api/register', form.value)
    if (res.data.success) router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registrasi gagal'
    if (err.response?.data?.errors) error.value = Object.values(err.response.data.errors).flat().join(', ')
  } finally {
    loading.value = false
  }
}
</script>