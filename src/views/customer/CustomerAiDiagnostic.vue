<template>
  <div class="animate-fadein">
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <CpuChipIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> AI Diagnostic
      </h1>
      <p class="mt-1 text-sm" :style="{ color: `var(--text-secondary)` }">Ceritakan keluhan kendaraan kamu, AI kami akan menganalisa</p>
    </div>

    <div class="card mb-6 relative overflow-hidden">
      <!-- Animated background -->
      <div class="absolute inset-0 opacity-5 pointer-events-none" style="background: radial-gradient(circle at 80% 20%, var(--accent), transparent 60%);"></div>

      <div class="flex items-center gap-3 mb-6 relative z-10">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative" :style="{ background: `linear-gradient(135deg, var(--accent), #d97706)` }">
          <CpuChipIcon class="w-7 h-7 text-black" />
          <div v-if="diagnosing" class="absolute inset-0 rounded-2xl animate-ping opacity-30" :style="{ backgroundColor: `var(--accent)` }"></div>
        </div>
        <div>
          <h2 class="font-semibold" :style="{ color: `var(--text-primary)` }">Tanya AI Mekanik MECHA</h2>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Gratis & langsung dapat hasil analisa</p>
        </div>
        <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style="background:rgba(34,197,94,0.1);color:#22c55e">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> AI Online
        </div>
      </div>

      <div class="mb-4 relative z-10">
        <label class="text-sm mb-2 block font-medium" :style="{ color: `var(--text-secondary)` }">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle" type="text" placeholder="Contoh: Toyota Avanza 2019, Honda Beat 2022" class="input-field" :disabled="diagnosing" />
      </div>

      <div class="mb-6 relative z-10">
        <label class="text-sm mb-2 block font-medium" :style="{ color: `var(--text-secondary)` }">Ceritakan Keluhan Kendaraan Kamu</label>
        <textarea v-model="form.symptoms" placeholder="Contoh: Mesin berbunyi kasar saat dinyalakan pagi hari, asap hitam keluar dari knalpot..." rows="4" class="input-field resize-none" :disabled="diagnosing" />
      </div>

      <!-- Analyzing State -->
      <div v-if="diagnosing" class="mb-5 p-4 rounded-2xl relative z-10 overflow-hidden" :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--accent)40` }">
        <div class="absolute inset-0 opacity-10" style="background: linear-gradient(90deg, transparent, var(--accent), transparent); animation: shimmer 2s infinite;"></div>
        <div class="flex items-center gap-3 mb-3">
          <div class="flex gap-1">
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `0ms` }"></div>
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `150ms` }"></div>
            <div class="w-2.5 h-2.5 rounded-full animate-bounce" :style="{ backgroundColor: `var(--accent)`, animationDelay: `300ms` }"></div>
          </div>
          <span class="text-sm font-medium" :style="{ color: `var(--accent)` }">AI sedang menganalisa kendaraan kamu...</span>
        </div>
        <div class="space-y-2">
          <div v-for="(step, i) in analyzeSteps" :key="i" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
              :style="currentStep > i
                ? { background: `linear-gradient(135deg, var(--accent), #d97706)` }
                : currentStep === i
                ? { border: `2px solid var(--accent)` }
                : { border: `2px solid var(--border-color)` }">
              <CheckCircleIcon v-if="currentStep > i" class="w-2.5 h-2.5 text-black" />
              <div v-else-if="currentStep === i" class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: `var(--accent)` }"></div>
            </div>
            <span class="text-xs transition-all"
              :style="{ color: currentStep >= i ? `var(--text-primary)` : `var(--text-muted)` }">{{ step }}</span>
          </div>
        </div>
      </div>

      <button @click="diagnose" :disabled="diagnosing || !form.symptoms"
        class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center relative z-10 hover:scale-[1.02] transition-transform">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <CpuChipIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa..." : "Analisa Kendaraan Saya" }}
      </button>
    </div>

    <!-- Hasil Analisa -->
    <transition name="slide-up">
      <div v-if="result" class="card mb-6 animate-fadein" :style="{ border: `1px solid var(--accent)50` }">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" :style="{ background: `linear-gradient(135deg, var(--accent), #d97706)` }">
              <CpuChipIcon class="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 class="font-semibold" :style="{ color: `var(--accent)` }">Hasil Analisa AI</h2>
              <p class="text-xs" :style="{ color: `var(--text-muted)` }">{{ form.vehicle || "Kendaraan tidak disebutkan" }}</p>
            </div>
          </div>
          <button @click="resetForm" class="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:scale-105"
            :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
            <ArrowPathIcon class="w-3 h-3" /> Reset
          </button>
        </div>
        <div class="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">{{ result }}</div>
        <div class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: `var(--accent)15`, border: `1px solid var(--accent)30` }">
          <p class="text-sm font-medium mb-1 flex items-center gap-2" :style="{ color: `var(--accent)` }">
            <ExclamationTriangleIcon class="w-4 h-4" /> Perhatian
          </p>
          <p class="text-xs" :style="{ color: `var(--text-muted)` }">Hasil analisa AI hanya sebagai referensi awal. Untuk diagnosa akurat, segera kunjungi bengkel terdekat.</p>
        </div>
        <div class="flex gap-3 mt-4">
          <RouterLink to="/customer/bengkel" class="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <MapPinIcon class="w-4 h-4" /> Cari Bengkel
          </RouterLink>
          <RouterLink to="/customer/bengkel" class="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            :style="{ border: `1px solid var(--accent)`, color: `var(--accent)` }">
            <WrenchScrewdriverIcon class="w-4 h-4" /> Panggil Mekanik
          </RouterLink>
        </div>
      </div>
    </transition>

    <!-- Error -->
    <div v-if="errorMsg" class="card mb-6 animate-fadein" :style="{ border: `1px solid rgba(239,68,68,0.3)` }">
      <div class="flex items-center gap-3 mb-2">
        <XCircleIcon class="w-5 h-5 text-red-400" />
        <p class="font-medium text-red-400">Gagal Menghubungi AI</p>
      </div>
      <p class="text-sm mb-3" :style="{ color: `var(--text-secondary)` }">{{ errorMsg }}</p>
      <button @click="diagnose" class="btn-primary px-5 py-2 rounded-lg text-sm">Coba Lagi</button>
    </div>

    <!-- Tips -->
    <div class="card">
      <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: `var(--text-primary)` }">
        <LightBulbIcon class="w-4 h-4" :style="{ color: `var(--accent)` }" /> Tips Mendeskripsikan Keluhan
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="(tip, i) in tips" :key="tip.title"
          class="flex items-start gap-3 rounded-xl p-3 hover:scale-[1.01] transition-all cursor-default"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }"
          :class="`animate-fadein-delay-${Math.min(i+1,3)}`">
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
import {
  CpuChipIcon, ArrowPathIcon, MagnifyingGlassIcon, ExclamationTriangleIcon,
  MapPinIcon, WrenchScrewdriverIcon, LightBulbIcon, SpeakerWaveIcon,
  FireIcon, BoltIcon, BeakerIcon, ArrowsRightLeftIcon, CheckCircleIcon, XCircleIcon,
} from "@heroicons/vue/24/outline"

const diagnosing = ref(false)
const result = ref("")
const errorMsg = ref("")
const currentStep = ref(0)
const form = ref({ vehicle: "", symptoms: "" })

const analyzeSteps = [
  "Memproses keluhan kendaraan...",
  "Mengidentifikasi kemungkinan masalah...",
  "Menyusun rekomendasi perbaikan...",
  "Finalisasi hasil analisa...",
]

let stepInterval = null

const diagnose = async () => {
  diagnosing.value = true
  result.value = ""
  errorMsg.value = ""
  currentStep.value = 0
  stepInterval = setInterval(() => {
    if (currentStep.value < analyzeSteps.length - 1) currentStep.value++
  }, 1500)
  try {
    const res = await axios.post("/api/ai-groq", { vehicle_info: form.value.vehicle, symptoms: form.value.symptoms })
    if (res.data.success) { result.value = res.data.result }
    else { errorMsg.value = res.data.message || "Terjadi kesalahan" }
  } catch (e) {
    errorMsg.value = "Gagal terhubung ke AI. Coba beberapa saat lagi."
  } finally {
    clearInterval(stepInterval)
    currentStep.value = analyzeSteps.length
    diagnosing.value = false
  }
}

const resetForm = () => {
  form.value = { vehicle: "", symptoms: "" }
  result.value = ""
  errorMsg.value = ""
  currentStep.value = 0
}

onUnmounted(() => clearInterval(stepInterval))

const tips = [
  { icon: SpeakerWaveIcon, title: "Bunyi tidak biasa", desc: "Jelaskan bunyi seperti apa dan kapan terjadi", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
  { icon: FireIcon, title: "Asap dari knalpot", desc: "Sebutkan warna asap putih, hitam, atau biru", gradient: "linear-gradient(135deg,#ef4444,#dc2626)" },
  { icon: BoltIcon, title: "Suhu mesin", desc: "Apakah mesin cepat panas atau indikator naik?", gradient: "linear-gradient(135deg,#3b82f6,#2563eb)" },
  { icon: BeakerIcon, title: "Performa kendaraan", desc: "Tarikan berat, boros bensin, atau susah starter?", gradient: "linear-gradient(135deg,#a855f7,#7c3aed)" },
  { icon: ArrowsRightLeftIcon, title: "Kebocoran cairan", desc: "Ada tetesan oli atau air radiator di bawah kendaraan?", gradient: "linear-gradient(135deg,#22c55e,#16a34a)" },
  { icon: WrenchScrewdriverIcon, title: "Getaran & handling", desc: "Setir bergetar atau mobil menarik ke satu sisi?", gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
]
</script>

<style scoped>
.slide-up-enter-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
</style>