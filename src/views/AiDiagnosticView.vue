<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <CpuChipIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> AI Diagnostic
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Analisa keluhan kendaraan pelanggan dengan AI</p>
    </div>

    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <CpuChipIcon class="w-6 h-6" :style="{ color: `var(--accent)` }" />
        </div>
        <div>
          <h2 class="font-semibold" :style="{ color: `var(--text-primary)` }">AI Mekanik MECHA</h2>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Khusus diagnosa kendaraan & bengkel</p>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle_info" type="text" placeholder="Contoh: Honda Beat 2020, Toyota Innova 2018" class="input-field" />
      </div>
      <div class="mb-6">
        <label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Keluhan Kendaraan</label>
        <textarea v-model="form.symptoms" class="input-field" rows="5" placeholder="Contoh: Mesin berbunyi kasar, tarikan berat, asap hitam dari knalpot..."></textarea>
      </div>

      <button @click="diagnose" :disabled="diagnosing || !form.symptoms" class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <MagnifyingGlassIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa..." : "Analisa Sekarang" }}
      </button>

      <div v-if="diagnosing" class="mt-4 flex items-center gap-3 text-sm" :style="{ color: `var(--text-secondary)` }">
        <div class="flex gap-1">
          <div class="w-2 h-2 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: '0ms' }"></div>
          <div class="w-2 h-2 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: '150ms' }"></div>
          <div class="w-2 h-2 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: '300ms' }"></div>
        </div>
        AI sedang memproses...
      </div>
    </div>

    <div v-if="result" class="card mb-6" :style="{ border: `1px solid var(--accent)` + `50` }">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
            <CpuChipIcon class="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 class="font-semibold" :style="{ color: `var(--accent)` }">Hasil Analisa AI</h2>
            <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ form.vehicle_info || "Kendaraan tidak disebutkan" }}</p>
          </div>
        </div>
        <button @click="resetForm" class="text-sm flex items-center gap-1 px-3 py-1 rounded-lg transition-all"
          :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
          <ArrowPathIcon class="w-4 h-4" /> Reset
        </button>
      </div>
      <div class="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
        :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">{{ result }}</div>
      <div class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: `var(--accent)` + `15`, border: `1px solid var(--accent)` + `30` }">
        <p class="text-sm font-medium mb-1 flex items-center gap-2" :style="{ color: `var(--accent)` }">
          <ExclamationTriangleIcon class="w-4 h-4" /> Catatan
        </p>
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">Hasil analisa AI hanya sebagai referensi awal. Tetap lakukan pemeriksaan langsung pada kendaraan.</p>
      </div>
    </div>

    <div v-if="errorMsg" class="card mb-6" :style="{ border: `1px solid rgba(239,68,68,0.3)` }">
      <div class="flex items-center gap-3 mb-3">
        <XCircleIcon class="w-6 h-6 text-red-400" />
        <h2 class="font-semibold text-red-400">Gagal Menghubungi AI</h2>
      </div>
      <p class="text-sm mb-4" :style="{ color: `var(--text-secondary)` }">{{ errorMsg }}</p>
      <button @click="diagnose" class="btn-primary px-6 py-2 rounded-lg text-sm">Coba Lagi</button>
    </div>

    <div class="card">
      <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
        <BookOpenIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" /> Panduan Penggunaan
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="tip in tips" :key="tip.title" class="flex items-start gap-3 rounded-xl p-4"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <component :is="tip.icon" class="w-5 h-5 flex-shrink-0 mt-0.5" :style="{ color: `var(--accent)` }" />
          <div>
            <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ tip.title }}</p>
            <p class="text-xs mt-1" :style="{ color: `var(--text-secondary)` }">{{ tip.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { CpuChipIcon, MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon, BookOpenIcon, SpeakerWaveIcon, FireIcon, BoltIcon, BeakerIcon, TruckIcon } from '@heroicons/vue/24/outline'

const diagnosing = ref(false)
const result = ref("")
const errorMsg = ref("")
const form = ref({ vehicle_info: "", symptoms: "" })

const tips = [
  { icon: SpeakerWaveIcon, title: "Deskripsikan bunyi", desc: "Sebutkan jenis bunyi (berdecit, gemuruh, ketukan) dan kapan muncul" },
  { icon: FireIcon, title: "Warna asap knalpot", desc: "Putih = air/coolant, Hitam = bensin berlebih, Biru = oli terbakar" },
  { icon: ExclamationTriangleIcon, title: "Kondisi suhu mesin", desc: "Apakah overheat, cepat panas, atau indikator naik tidak normal?" },
  { icon: BoltIcon, title: "Performa & tenaga", desc: "Tarikan berat, boros BBM, susah starter, atau brebet?" },
  { icon: BeakerIcon, title: "Kebocoran cairan", desc: "Oli, coolant, atau cairan lain yang menetes di bawah kendaraan" },
  { icon: TruckIcon, title: "Handling kendaraan", desc: "Setir goyang, menarik ke satu sisi, atau rem kurang pakem?" },
]

const diagnose = async () => {
  diagnosing.value = true
  result.value = ""
  errorMsg.value = ""
  try {
    const res = await axios.post("/api/ai-groq", { vehicle_info: form.value.vehicle_info, symptoms: form.value.symptoms })
    if (res.data.success) { result.value = res.data.result }
    else { errorMsg.value = res.data.message }
  } catch (err) {
    errorMsg.value = "Gagal terhubung ke AI. Coba beberapa saat lagi."
  } finally {
    diagnosing.value = false
  }
}

const resetForm = () => {
  form.value = { vehicle_info: "", symptoms: "" }
  result.value = ""
  errorMsg.value = ""
}
</script>
