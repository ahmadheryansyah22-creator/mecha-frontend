<template>
  <div class="animate-fadein">
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <CpuChipIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> AI Diagnostic
      </h1>
      <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Analisa keluhan kendaraan customer dengan AI</p>
    </div>

    <div class="card mb-6 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 pointer-events-none" style="background: radial-gradient(circle at 80% 20%, var(--accent), transparent 60%);"></div>
      <div class="flex items-center gap-3 mb-6 relative z-10">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative" :style="{ background: `linear-gradient(135deg, var(--accent), #d97706)` }">
          <CpuChipIcon class="w-7 h-7 text-black" />
          <div v-if="diagnosing" class="absolute inset-0 rounded-2xl animate-ping opacity-30" :style="{ backgroundColor: `var(--accent)` }"></div>
        </div>
        <div>
          <h2 class="font-semibold" :style="{ color: `var(--text-primary)` }">AI Mekanik MECHA</h2>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Khusus diagnosa kendaraan & bengkel</p>
        </div>
        <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style="background:rgba(34,197,94,0.1);color:#22c55e">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> AI Online
        </div>
      </div>
      <div class="mb-4 relative z-10">
        <label class="block text-sm mb-2 font-medium" :style="{ color: `var(--text-secondary)` }">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle_info" type="text" placeholder="Contoh: Honda Beat 2020, Toyota Innova 2018" class="input-field" :disabled="diagnosing" />
      </div>
      <div class="mb-6 relative z-10">
        <label class="block text-sm mb-2 font-medium" :style="{ color: `var(--text-secondary)` }">Keluhan Kendaraan</label>
        <textarea v-model="form.symptoms" class="input-field resize-none" rows="4" placeholder="Contoh: Mesin berbunyi kasar, tarikan berat, asap hitam dari knalpot..." :disabled="diagnosing"></textarea>
      </div>

      <div v-if="diagnosing" class="mb-5 p-4 rounded-2xl relative z-10" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--accent)40` }">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex gap-1">
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `0ms` }"></div>
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `150ms` }"></div>
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `300ms` }"></div>
          </div>
          <span class="text-sm font-medium" :style="{ color: `var(--accent)` }">AI sedang menganalisa...</span>
        </div>
        <div class="space-y-2">
          <div v-for="(step, i) in analyzeSteps" :key="i" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
              :style="currentStep > i ? { background: `linear-gradient(135deg, var(--accent), #d97706)` } : currentStep === i ? { border: `2px solid var(--accent)` } : { border: `2px solid var(--border-color)` }">
              <CheckCircleIcon v-if="currentStep > i" class="w-2.5 h-2.5 text-black" />
              <div v-else-if="currentStep === i" class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: `var(--accent)` }"></div>
            </div>
            <span class="text-xs" :style="{ color: currentStep >= i ? `var(--text-primary)` : `var(--text-muted)` }">{{ step }}</span>
          </div>
        </div>
      </div>

      <button @click="diagnose" :disabled="diagnosing || !form.symptoms"
        class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50 w-full justify-center relative z-10 hover:scale-[1.02] transition-transform">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <CpuChipIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa..." : "Analisa Sekarang" }}
      </button>
    </div>

    <transition name="slide-up">
      <div v-if="result" class="card mb-6 animate-fadein" :style="{ border: `1px solid var(--accent)50` }">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" :style="{ background: `linear-gradient(135deg, var(--accent), #d97706)` }">
              <CpuChipIcon class="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 class="font-semibold" :style="{ color: `var(--accent)` }">Hasil Analisa AI</h2>
              <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ form.vehicle_info || "Kendaraan tidak disebutkan" }}</p>
            </div>
          </div>
          <button @click="resetForm" class="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-all"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
            <ArrowPathIcon class="w-3 h-3" /> Reset
          </button>
        </div>
        <div class="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">{{ result }}</div>
        <div class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: `var(--accent)15`, border: `1px solid var(--accent)30` }">
          <p class="text-xs font-medium flex items-center gap-2" :style="{ color: `var(--accent)` }">
            <ExclamationTriangleIcon class="w-4 h-4" /> Hasil AI hanya referensi awal. Tetap lakukan pemeriksaan langsung pada kendaraan.
          </p>
        </div>
      </div>
    </transition>

    <div v-if="errorMsg" class="card mb-6" :style="{ border: `1px solid rgba(239,68,68,0.3)` }">
      <div class="flex items-center gap-2 mb-2"><XCircleIcon class="w-5 h-5 text-red-400" /><p class="font-medium text-red-400">Gagal Menghubungi AI</p></div>
      <p class="text-sm mb-3" :style="{ color: `var(--text-secondary)` }">{{ errorMsg }}</p>
      <button @click="diagnose" class="btn-primary px-5 py-2 rounded-lg text-sm">Coba Lagi</button>
    </div>

    <div class="card">
      <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: `var(--text-primary)` }">
        <LightBulbIcon class="w-4 h-4" :style="{ color: `var(--accent)` }" /> Panduan Penggunaan
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="(tip, i) in tips" :key="tip.title" class="flex items-start gap-3 rounded-xl p-3 hover:scale-[1.01] transition-all"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :style="{ background: tip.gradient }">
            <component :is="tip.icon" class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ tip.title }}</p>
            <p class="text-xs mt-0.5" :style="{ color: `var(--text-secondary)` }">{{ tip.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue"
import axios from "axios"
import { CpuChipIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon, LightBulbIcon, CheckCircleIcon, SpeakerWaveIcon, FireIcon, BoltIcon, BeakerIcon, TruckIcon, WrenchScrewdriverIcon } from "@heroicons/vue/24/outline"

const diagnosing = ref(false)
const result = ref("")
const errorMsg = ref("")
const currentStep = ref(0)
const form = ref({ vehicle_info: "", symptoms: "" })

const analyzeSteps = ["Memproses keluhan kendaraan...", "Mengidentifikasi kemungkinan masalah...", "Menyusun rekomendasi perbaikan...", "Finalisasi hasil analisa..."]
let stepInterval = null

const diagnose = async () => {
  diagnosing.value = true
  result.value = ""
  errorMsg.value = ""
  currentStep.value = 0
  stepInterval = setInterval(() => { if (currentStep.value < analyzeSteps.length - 1) currentStep.value++ }, 1500)
  try {
    const token = localStorage.getItem("token")
    const res = await axios.post("/api/ai-groq", { vehicle_info: form.value.vehicle_info, symptoms: form.value.symptoms }, { headers: { Authorization: `Bearer ${token}` } })
    if (res.data.success) { result.value = res.data.result }
    else { errorMsg.value = res.data.message || "Terjadi kesalahan" }
  } catch (e) { errorMsg.value = "Gagal terhubung ke AI. Coba beberapa saat lagi." }
  finally { clearInterval(stepInterval); currentStep.value = analyzeSteps.length; diagnosing.value = false }
}

const resetForm = () => { form.value = { vehicle_info: "", symptoms: "" }; result.value = ""; errorMsg.value = ""; currentStep.value = 0 }
onUnmounted(() => clearInterval(stepInterval))

const tips = [
  { icon: SpeakerWaveIcon, title: "Deskripsikan bunyi", desc: "Sebutkan jenis bunyi dan kapan muncul", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
  { icon: FireIcon, title: "Warna asap knalpot", desc: "Putih = air/coolant, Hitam = bensin berlebih, Biru = oli", gradient: "linear-gradient(135deg,#ef4444,#dc2626)" },
  { icon: ExclamationTriangleIcon, title: "Kondisi suhu mesin", desc: "Apakah overheat atau indikator naik tidak normal?", gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
  { icon: BoltIcon, title: "Performa & tenaga", desc: "Tarikan berat, boros BBM, susah starter, atau brebet?", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)" },
  { icon: BeakerIcon, title: "Kebocoran cairan", desc: "Oli, coolant, atau cairan lain menetes di bawah kendaraan", gradient: "linear-gradient(135deg,#22c55e,#16a34a)" },
  { icon: TruckIcon, title: "Handling kendaraan", desc: "Setir goyang, menarik ke satu sisi, atau rem kurang pakem?", gradient: "linear-gradient(135deg,#a855f7,#7c3aed)" },
]
</script>

<style scoped>
.slide-up-enter-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
</style>