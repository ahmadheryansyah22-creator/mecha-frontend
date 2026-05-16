<template>
  <div class="animate-fadein">
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
        <UserIcon class="w-7 h-7" :style="{ color: 'var(--accent)' }" />
        Profil Saya
      </h1>
      <p class="mt-1 text-sm" :style="{ color: 'var(--text-secondary)' }">Kelola informasi akun mekanik</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card flex flex-col items-center py-8">
        <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4" :style="{ backgroundColor: 'var(--accent)', color: '#000' }">
          {{ userInitial }}
        </div>
        <p class="font-semibold text-lg" :style="{ color: 'var(--text-primary)' }">{{ user.name }}</p>
        <p class="text-sm mt-1" :style="{ color: 'var(--text-muted)' }">{{ user.email }}</p>
        <span class="mt-3 text-xs px-3 py-1 rounded-full font-medium" style="background: #f5c51820; color: #f5c518;">Mekanik</span>
      </div>

      <div class="card md:col-span-2">
        <h2 class="font-semibold mb-6 text-sm" :style="{ color: 'var(--text-primary)' }">Informasi Akun</h2>
        <div class="space-y-4">
          <div v-for="field in fields" :key="field.label">
            <label class="block text-xs font-medium mb-1.5" :style="{ color: 'var(--text-secondary)' }">{{ field.label }}</label>
            <input v-model="form[field.key]" :type="field.type || 'text'" :disabled="field.disabled"
              class="input-field text-sm w-full"
              :style="field.disabled ? { opacity: 0.5 } : {}" />
          </div>
          <div v-if="successMsg" class="p-3 rounded-xl text-sm text-green-400 bg-green-500/10">{{ successMsg }}</div>
          <div v-if="errorMsg" class="p-3 rounded-xl text-sm text-red-400 bg-red-500/10">{{ errorMsg }}</div>
          <button @click="save" :disabled="saving" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { UserIcon } from '@heroicons/vue/24/outline'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userInitial = computed(() => (user.name || 'M')[0].toUpperCase())
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = ref({ name: user.name || '', email: user.email || '', phone: user.phone || '' })

const fields = [
  { label: 'Nama Lengkap', key: 'name' },
  { label: 'Email', key: 'email', type: 'email', disabled: true },
  { label: 'No. Telepon', key: 'phone' },
]

const save = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const token = localStorage.getItem('token')
    await axios.post('/api/profile/update', form.value, { headers: { Authorization: `Bearer ${token}` } })
    user.name = form.value.name
    localStorage.setItem('user', JSON.stringify(user))
    successMsg.value = 'Profil berhasil diperbarui!'
  } catch (e) {
    errorMsg.value = 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}
</script>
