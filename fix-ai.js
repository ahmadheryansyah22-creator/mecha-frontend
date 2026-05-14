const fs = require('fs');

const aiDiagnostic = `<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2"><CpuChipIcon class="w-6 h-6 text-yellow-400" /> AI Diagnostic</h1>
      <p class="text-gray-400 mt-1">Analisa keluhan kendaraan pelanggan dengan AI</p>
    </div>

    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-6 h-6 text-yellow-400" /></div>
        <div>
          <h2 class="text-white font-semibold">AI Mekanik MECHA</h2>
          <p class="text-gray-400 text-sm">Khusus diagnosa kendaraan & bengkel</p>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-400 text-sm mb-2">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle_info" type="text" placeholder="Contoh: Honda Beat 2020, Toyota Innova 2018" class="input-field" />
      </div>

      <div class="mb-6">
        <label class="block text-gray-400 text-sm mb-2">Keluhan Kendaraan</label>
        <textarea v-model="form.symptoms" class="input-field" rows="5" placeholder="Contoh: Mesin berbunyi kasar, tarikan berat, asap hitam dari knalpot..."></textarea>
      </div>

      <button @click="diagnose" :disabled="diagnosing || !form.symptoms" class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <MagnifyingGlassIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa..." : "Analisa Sekarang" }}
      </button>

      <div v-if="diagnosing" class="mt-4 flex items-center gap-3 text-gray-400 text-sm">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        AI sedang memproses...
      </div>
    </div>

    <div v-if="result" class="card mb-6 border border-yellow-400/30">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-5 h-5 text-black" /></div>
          <div>
            <h2 class="text-yellow-400 font-semibold">Hasil Analisa AI</h2>
            <p class="text-gray-500 text-xs">{{ form.vehicle_info || "Kendaraan tidak disebutkan" }}</p>
          </div>
        </div>
        <button @click="resetForm" class="text-gray-500 hover:text-gray-300 text-sm border border-gray-700 px-3 py-1 rounded-lg flex items-center gap-1"><ArrowPathIcon class="w-4 h-4" /> Reset</button>
      </div>
      <div class="bg-[#0f0f0f] rounded-xl p-5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border border-gray-800">{{ result }}</div>
      <div class="mt-4 p-4 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
        <p class="text-yellow-400 text-sm font-medium mb-1 flex items-center gap-2"><ExclamationTriangleIcon class="w-4 h-4" /> Catatan</p>
        <p class="text-gray-400 text-xs">Hasil analisa AI hanya sebagai referensi awal. Tetap lakukan pemeriksaan langsung pada kendaraan.</p>
      </div>
    </div>

    <div v-if="errorMsg" class="card mb-6 border border-red-500/30">
      <div class="flex items-center gap-3 mb-3">
        <XCircleIcon class="w-6 h-6 text-red-400" />
        <h2 class="text-red-400 font-semibold">Gagal Menghubungi AI</h2>
      </div>
      <p class="text-gray-400 text-sm mb-4">{{ errorMsg }}</p>
      <button @click="diagnose" class="btn-primary px-6 py-2 rounded-lg text-sm">Coba Lagi</button>
    </div>

    <div class="card">
      <h2 class="text-white font-semibold mb-4 flex items-center gap-2"><BookOpenIcon class="w-5 h-5 text-yellow-400" /> Panduan Penggunaan</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="tip in tips" :key="tip.title" class="flex items-start gap-3 bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
          <component :is="tip.icon" class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-white text-sm font-medium">{{ tip.title }}</p>
            <p class="text-gray-400 text-xs mt-1">{{ tip.desc }}</p>
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
    const res = await axios.post("/api/ai-groq", {
      vehicle_info: form.value.vehicle_info,
      symptoms: form.value.symptoms
    })
    if (res.data.success) {
      result.value = res.data.result
    } else {
      errorMsg.value = res.data.message
    }
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
</script>`;

fs.writeFileSync('src/views/AiDiagnosticView.vue', aiDiagnostic, 'utf8');
console.log('✅ AiDiagnosticView.vue berhasil diupdate!');
