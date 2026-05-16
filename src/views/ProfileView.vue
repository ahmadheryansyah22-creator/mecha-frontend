<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
        <UserIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> Profil Saya
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola informasi akun bengkel kamu</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Avatar Card -->
      <div class="card flex flex-col items-center text-center py-8">
        <div class="relative mb-4">
          <img v-if="avatarUrl" :src="avatarUrl" class="w-24 h-24 rounded-full object-cover" />
          <div v-else class="w-24 h-24 rounded-full flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
            <span class="text-4xl font-bold text-black">{{ userInitial }}</span>
          </div>
          <button @click="$refs.avatarInput.click()"
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            :style="{ backgroundColor: `var(--accent)` }">
            <CameraIcon class="w-4 h-4 text-black" />
          </button>
          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
        </div>

        <div v-if="uploadingAvatar" class="text-xs mb-2 flex items-center gap-1" :style="{ color: `var(--text-muted)` }">
          <ArrowPathIcon class="w-3 h-3 animate-spin" /> Mengupload...
        </div>

        <h2 class="text-xl font-bold mb-1" :style="{ color: `var(--text-primary)` }">{{ user.name }}</h2>
        <span class="text-xs px-3 py-1 rounded-full font-medium mb-4" :style="{ backgroundColor: `var(--accent-soft)`, color: `var(--accent)` }">
          {{ roleLabel }}
        </span>
        <p class="text-sm" :style="{ color: `var(--text-secondary)` }">{{ user.email }}</p>
        <p class="text-xs mt-2" :style="{ color: `var(--text-muted)` }">Klik ikon kamera untuk ganti foto</p>
      </div>

      <!-- Edit Form -->
      <div class="card md:col-span-2">
        <h3 class="font-semibold mb-6 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
          <UserIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" /> Edit Informasi
        </h3>

        <div v-if="success" class="rounded-lg p-3 mb-4 text-sm flex items-center gap-2" style="background-color: #22c55e20; color: #22c55e;">
          <CheckCircleIcon class="w-4 h-4" /> {{ successMsg }}
        </div>
        <div v-if="error" class="rounded-lg p-3 mb-4 text-sm" style="background-color: #ef444420; color: #ef4444;">
          {{ error }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Nama Lengkap</label>
            <input v-model="form.name" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Email</label>
            <input v-model="form.email" type="email" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">No. Telepon</label>
            <input v-model="form.phone" type="tel" class="input-field" />
          </div>
          <div>
            <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Alamat</label>
            <input v-model="form.address" type="text" class="input-field" />
          </div>
        </div>

        <button @click="updateProfile" :disabled="loading" class="btn-primary px-6 py-2 rounded-lg flex items-center gap-2">
          <ArrowPathIcon v-if="loading" class="w-4 h-4 animate-spin" />
          <CheckIcon v-else class="w-4 h-4" />
          {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>

        <div class="mt-8 pt-6" :style="{ borderTop: '1px solid var(--border-color)' }">
          <h3 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
            <LockClosedIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" /> Ganti Password
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Password Lama</label>
              <input v-model="passForm.old_password" type="password" class="input-field" />
            </div>
            <div>
              <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Password Baru</label>
              <input v-model="passForm.new_password" type="password" class="input-field" />
            </div>
            <div>
              <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Konfirmasi</label>
              <input v-model="passForm.new_password_confirmation" type="password" class="input-field" />
            </div>
          </div>
          <button @click="changePassword" :disabled="loadingPass" class="mt-4 px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium border transition-all" :style="{ borderColor: `var(--accent)`, color: `var(--accent)` }">
            <KeyIcon class="w-4 h-4" />
            {{ loadingPass ? 'Memproses...' : 'Ganti Password' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  UserIcon, LockClosedIcon, KeyIcon, CheckIcon,
  ArrowPathIcon, CheckCircleIcon, CameraIcon
} from '@heroicons/vue/24/outline'

const loading = ref(false)
const loadingPass = ref(false)
const uploadingAvatar = ref(false)
const success = ref(false)
const successMsg = ref('Profil berhasil diperbarui!')
const error = ref('')

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const userInitial = computed(() => (user.value.name || 'U')[0].toUpperCase())
const roleLabel = computed(() => ({ customer: 'Customer', bengkel: 'Bengkel', mekanik: 'Mekanik' }[user.value.role] || 'User'))
const avatarUrl = ref(user.value.avatar ? 'http://localhost:8000/storage/' + user.value.avatar : null)

const form = ref({ name: '', email: '', phone: '', address: '' })
const passForm = ref({ old_password: '', new_password: '', new_password_confirmation: '' })

onMounted(() => {
  form.value = {
    name: user.value.name || '',
    email: user.value.email || '',
    phone: user.value.phone || '',
    address: user.value.address || '',
  }
})

const uploadAvatar = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploadingAvatar.value = true
  error.value = ''
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await axios.post('/api/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    avatarUrl.value = res.data.data.avatar
    user.value = res.data.data.user
    localStorage.setItem('user', JSON.stringify(res.data.data.user))
    successMsg.value = 'Foto profil berhasil diperbarui!'
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal upload foto'
  } finally {
    uploadingAvatar.value = false
  }
}

const updateProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const res = await axios.post('/api/profile/update', form.value)
    localStorage.setItem('user', JSON.stringify(res.data.data.user))
    user.value = res.data.data.user
    successMsg.value = 'Profil berhasil diperbarui!'
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memperbarui profil'
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  loadingPass.value = true
  error.value = ''
  try {
    await axios.post('/api/change-password', passForm.value)
    passForm.value = { old_password: '', new_password: '', new_password_confirmation: '' }
    successMsg.value = 'Password berhasil diganti!'
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal ganti password'
  } finally {
    loadingPass.value = false
  }
}
</script>