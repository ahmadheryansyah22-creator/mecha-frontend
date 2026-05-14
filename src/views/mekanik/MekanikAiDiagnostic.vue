<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <CpuChipIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> AI Diagnostic
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Analisa keluhan kendaraan dengan AI</p>
    </div>
    <div class="card mb-6">
      <div class="mb-4">
        <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle_info" type="text" placeholder="Contoh: Honda Beat 2020" class="input-field" />
      </div>
      <div class="mb-6">
        <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Keluhan Kendaraan</label>
        <textarea v-model="form.symptoms" class="input-field" rows="5" placeholder="Contoh: Mesin berbunyi kasar, tarikan berat..."></textarea>
      </div>
      <button @click="diagnose" :disabled="diagnosing || !form.symptoms" class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <MagnifyingGlassIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa..." : "Analisa Sekarang" }}
      </button>
    </div>
    <div v-if="result" class="card" :style="{ border: `1px solid var(--accent)` + `50` }">
      <h2 class="font-semibold mb-4" :style="{ color: `var(--accent)` }">Hasil Analisa AI</h2>
      <div class="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
        :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">{{ result }}</div>
      <div class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: `var(--accent)` + `15` }">
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">⚠️ Hasil AI hanya referensi awal. Tetap lakukan pemeriksaan langsung.</p>
      </div>
    </div>
    <div v-if="errorMsg" class="card" :style="{ border: `1px solid rgba(239,68,68,0.3)` }">
      <p class="text-red-400 text-sm">{{ errorMsg }}</p>
      <button @click="diagnose" class="btn-primary px-6 py-2 rounded-lg text-sm mt-3">Coba Lagi</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { CpuChipIcon, MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/vue/24/outline"

const diagnosing = ref(false)
const result = ref("")
const errorMsg = ref("")
const form = ref({ vehicle_info: "", symptoms: "" })

const diagnose = async () => {
  diagnosing.value = true
  result.value = ""
  errorMsg.value = ""
  try {
    const token = localStorage.getItem("token")
    const res = await axios.post("/api/ai-groq", { vehicle_info: form.value.vehicle_info, symptoms: form.value.symptoms }, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.success) { result.value = res.data.result }
    else { errorMsg.value = res.data.message }
  } catch (e) {
    errorMsg.value = "Gagal terhubung ke AI. Coba beberapa saat lagi."
  } finally {
    diagnosing.value = false
  }
}
</script>
