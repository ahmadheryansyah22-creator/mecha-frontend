<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold flex items-center gap-3" :style="{ color: `var(--text-primary)` }">
        <CpuChipIcon class="w-7 h-7" :style="{ color: `var(--accent)` }" /> AI Diagnostic
      </h1>
      <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Ceritakan keluhan kendaraan kamu, AI kami akan menganalisa</p>
    </div>

    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` + `20` }">
          <CpuChipIcon class="w-6 h-6" :style="{ color: `var(--accent)` }" />
        </div>
        <div>
          <h2 class="font-semibold" :style="{ color: `var(--text-primary)` }">Tanya AI Mekanik MECHA</h2>
          <p class="text-sm" :style="{ color: `var(--text-secondary)` }">Gratis & langsung dapat hasil analisa</p>
        </div>
      </div>

      <div class="mb-4">
        <label class="text-sm mb-2 block" :style="{ color: `var(--text-secondary)` }">Merek & Model Kendaraan</label>
        <input v-model="form.vehicle" type="text" placeholder="Contoh: Toyota Avanza 2019" class="input-field" />
      </div>

      <div class="mb-6">
        <label class="text-sm mb-2 block" :style="{ color: `var(--text-secondary)` }">Ceritakan Keluhan Kendaraan Kamu</label>
        <textarea v-model="form.symptoms" placeholder="Contoh: Mesin berbunyi kasar saat dinyalakan pagi hari, asap hitam keluar dari knalpot..."
          rows="5" class="input-field resize-none" />
      </div>

      <button @click="diagnose" :disabled="diagnosing || !form.symptoms"
        class="btn-primary px-8 py-3 rounded-xl flex items-center gap-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        <ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" />
        <MagnifyingGlassIcon v-else class="w-5 h-5" />
        {{ diagnosing ? "AI sedang menganalisa... (mohon tunggu)" : "Analisa Kendaraan Saya" }}
      </button>
    </div>

    <div v-if="result" class="card mb-6" :style="{ borderColor: `var(--accent)` + `50` }">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: `var(--accent)` }">
          <CpuChipIcon class="w-5 h-5 text-black" />
        </div>
        <h2 class="font-semibold" :style="{ color: `var(--accent)` }">Hasil Analisa AI</h2>
      </div>
      <div class="rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap"
        :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">
        {{ result }}
      </div>
      <div class="mt-4 p-4 rounded-xl" :style="{ backgroundColor: `var(--accent)` + `15`, border: `1px solid var(--accent)` + `30` }">
        <p class="text-sm font-medium mb-1 flex items-center gap-2" :style="{ color: `var(--accent)` }">
          <ExclamationTriangleIcon class="w-4 h-4" /> Perhatian
        </p>
        <p class="text-xs" :style="{ color: `var(--text-muted)` }">Hasil analisa AI hanya sebagai referensi awal. Untuk diagnosa akurat, segera kunjungi bengkel terdekat.</p>
      </div>
      <div class="flex gap-3 mt-4">
        <RouterLink to="/customer/bengkel" class="flex-1 btn-primary py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2">
          <MapPinIcon class="w-4 h-4" /> Cari Bengkel Terdekat
        </RouterLink>
        <RouterLink to="/customer/bengkel" class="flex-1 py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          :style="{ border: `1px solid var(--accent)`, color: `var(--accent)` }">
          <WrenchScrewdriverIcon class="w-4 h-4" /> Panggil Mekanik
        </RouterLink>
      </div>
    </div>

    <div class="card">
      <h2 class="font-semibold mb-4 flex items-center gap-2" :style="{ color: `var(--text-primary)` }">
        <LightBulbIcon class="w-5 h-5" :style="{ color: `var(--accent)` }" /> Tips Mendeskripsikan Keluhan
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="tip in tips" :key="tip.title" class="flex items-start gap-3 rounded-xl p-4"
          :style="{ backgroundColor: `var(--bg-primary)`, border: `1px solid var(--border-color)` }">
          <component :is="tip.icon" class="w-5 h-5 shrink-0 mt-0.5" :style="{ color: `var(--accent)` }" />
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
import {
  CpuChipIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  SpeakerWaveIcon,
  FireIcon,
  BoltIcon,
  BeakerIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/vue/24/outline"

const diagnosing = ref(false)
const result = ref("")
const form = ref({ vehicle: "", symptoms: "" })

const diagnose = async () => {
  diagnosing.value = true
  diagnosing.value = false
}

const tips = [
  { icon: SpeakerWaveIcon, title: "Bunyi yang tidak biasa", desc: "Jelaskan bunyi seperti apa (berdecit, bergetar, gemuruh) dan kapan terjadi" },
  { icon: FireIcon, title: "Asap dari knalpot", desc: "Sebutkan warna asap (putih, hitam, biru) dan kapan muncul" },
  { icon: BoltIcon, title: "Suhu mesin", desc: "Apakah mesin cepat panas atau indikator suhu naik?" },
  { icon: BeakerIcon, title: "Performa kendaraan", desc: "Apakah tarikan berat, boros bensin, atau susah starter?" },
  { icon: ArrowsRightLeftIcon, title: "Kebocoran cairan", desc: "Ada tetesan oli, air radiator, atau cairan lain di bawah kendaraan?" },
  { icon: WrenchScrewdriverIcon, title: "Getaran & handling", desc: "Apakah setir bergetar, mobil menarik ke satu sisi, atau rem tidak pakem?" },
]
</script>
