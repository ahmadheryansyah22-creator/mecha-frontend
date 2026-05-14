<template>
  <div class="min-h-screen flex items-center justify-center px-4" :style="{ backgroundColor: `var(--bg-primary)` }">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold" :style="{ color: `var(--accent)` }">MECHA</h1>
        <p class="mt-2 text-sm" :style="{ color: `var(--text-muted)` }">Halo {{ userName }}! Daftar sebagai apa?</p>
      </div>
      <div class="rounded-2xl p-8" :style="{ backgroundColor: `var(--bg-secondary)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-6 text-center" :style="{ color: `var(--text-primary)` }">Pilih Role Akun</h2>
        <div class="space-y-3 mb-6">
          <button v-for="r in roles" :key="r.value" @click="selectedRole = r.value"
            class="w-full flex items-center gap-4 p-4 rounded-xl transition-all border"
            :style="selectedRole === r.value ? { backgroundColor: `var(--accent)`, color: `#000`, borderColor: `var(--accent)` } : { backgroundColor: `var(--bg-primary)`, color: `var(--text-primary)`, borderColor: `var(--border-color)` }">
            <component :is="r.icon" class="w-6 h-6 flex-shrink-0" />
            <div class="text-left">
              <p class="font-semibold">{{ r.label }}</p>
              <p class="text-xs opacity-70">{{ r.desc }}</p>
            </div>
          </button>
        </div>
        <button @click="confirm" :disabled="!selectedRole || loading"
          class="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          :style="{ backgroundColor: `var(--accent)`, color: `#000` }">
          {{ loading ? 'Memproses...' : 'Lanjutkan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { UserIcon, BuildingStorefrontIcon, WrenchIcon } from "@heroicons/vue/24/outline"

const router = useRouter()
const selectedRole = ref("")
const loading = ref(false)
const user = JSON.parse(localStorage.getItem("user") || "{}")
const userName = computed(() => user.name || "")

const roles = [
  { value: "customer", label: "Customer", desc: "Cari bengkel & pesan servis", icon: UserIcon },
  { value: "bengkel", label: "Bengkel", desc: "Kelola bengkel & terima order", icon: BuildingStorefrontIcon },
  { value: "mekanik", label: "Mekanik", desc: "Terima & kerjakan order servis", icon: WrenchIcon },
]

const confirm = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem("token")
    await axios.post("/api/update-role", { role: selectedRole.value }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.role = selectedRole.value
    localStorage.setItem("user", JSON.stringify(user))
    if (selectedRole.value === "customer") router.push("/customer")
    else if (selectedRole.value === "mekanik") router.push("/portal-mekanik")
    else router.push("/")
  } catch (e) {
    loading.value = false
  }
}
</script>
