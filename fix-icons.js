const fs = require('fs');

// ===== SPAREPART VIEW =====
const sparepart = fs.readFileSync('src/views/SparePartView.vue', 'utf8');
const newSparepart = sparepart
  .replace(
    `import { ref, computed, onMounted } from 'vue'\nimport axios from 'axios'`,
    `import { ref, computed, onMounted } from 'vue'\nimport axios from 'axios'\nimport { ArchiveBoxIcon, ExclamationTriangleIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'`
  )
  .replace(
    `<div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">📦</div>`,
    `<div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><ArchiveBoxIcon class="w-6 h-6 text-green-400" /></div>`
  )
  .replace(
    `<div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl">⚠️</div>`,
    `<div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"><ExclamationTriangleIcon class="w-6 h-6 text-red-400" /></div>`
  )
  .replace(
    `<div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl">💰</div>`,
    `<div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center"><BanknotesIcon class="w-6 h-6 text-yellow-400" /></div>`
  )
  .replace(
    `{ value: 'semua', label: '📦 Semua' }`,
    `{ value: 'semua', label: 'Semua', icon: ArchiveBoxIcon }`
  )
  .replace(
    `{ value: 'tersedia', label: '✅ Tersedia' }`,
    `{ value: 'tersedia', label: 'Tersedia', icon: CheckCircleIcon }`
  )
  .replace(
    `{ value: 'menipis', label: '⚠️ Stok Menipis' }`,
    `{ value: 'menipis', label: 'Stok Menipis', icon: ExclamationTriangleIcon }`
  )
  .replace(
    `{ value: 'habis', label: '❌ Habis' }`,
    `{ value: 'habis', label: 'Habis', icon: XCircleIcon }`
  )
  .replace(
    `        class="px-4 py-2 rounded-xl text-sm font-medium transition-all"\n      >\n        {{ f.label }}`,
    `        class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"\n      >\n        <component :is="f.icon" class="w-4 h-4" />{{ f.label }}`
  )
  .replace(
    `<span v-if="part.stock <= part.min_stock" class="text-xs text-red-400">⚠️</span>`,
    `<ExclamationTriangleIcon v-if="part.stock <= part.min_stock" class="w-4 h-4 text-red-400" />`
  );
fs.writeFileSync('src/views/SparePartView.vue', newSparepart, 'utf8');
console.log('✅ SparePartView.vue berhasil diupdate!');

// ===== AI DIAGNOSTIC VIEW =====
const ai = fs.readFileSync('src/views/AiDiagnosticView.vue', 'utf8');
const newAi = ai
  .replace(
    `import { ref } from "vue"\nimport axios from "axios"`,
    `import { ref } from "vue"\nimport axios from "axios"\nimport { CpuChipIcon, MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon, BookOpenIcon, SpeakerWaveIcon, FireIcon, BoltIcon, WrenchScrewdriverIcon, BeakerIcon, TruckIcon } from '@heroicons/vue/24/outline'`
  )
  .replace(
    `<h1 class="text-2xl font-bold text-white">?? AI Diagnostic</h1>`,
    `<h1 class="text-2xl font-bold text-white flex items-center gap-3"><CpuChipIcon class="w-7 h-7 text-yellow-400" /> AI Diagnostic</h1>`
  )
  .replace(
    `<div class="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center text-2xl">??</div>`,
    `<div class="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-6 h-6 text-yellow-400" /></div>`
  )
  .replace(
    `<span class="text-xl">{{ diagnosing ? "?" : "??" }}</span>`,
    `<ArrowPathIcon v-if="diagnosing" class="w-5 h-5 animate-spin" /><MagnifyingGlassIcon v-else class="w-5 h-5" />`
  )
  .replace(
    `<div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-xl">??</div>`,
    `<div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-5 h-5 text-black" /></div>`
  )
  .replace(
    `<button @click="resetForm" class="text-gray-500 hover:text-gray-300 text-sm border border-gray-700 px-3 py-1 rounded-lg">?? Reset</button>`,
    `<button @click="resetForm" class="text-gray-500 hover:text-gray-300 text-sm border border-gray-700 px-3 py-1 rounded-lg flex items-center gap-1"><ArrowPathIcon class="w-4 h-4" /> Reset</button>`
  )
  .replace(
    `<p class="text-yellow-400 text-sm font-medium mb-1">?? Catatan</p>`,
    `<p class="text-yellow-400 text-sm font-medium mb-1 flex items-center gap-2"><ExclamationTriangleIcon class="w-4 h-4" /> Catatan</p>`
  )
  .replace(
    `<span class="text-2xl">?</span>`,
    `<XCircleIcon class="w-6 h-6 text-red-400" />`
  )
  .replace(
    `<h2 class="text-white font-semibold mb-4">?? Panduan Penggunaan</h2>`,
    `<h2 class="text-white font-semibold mb-4 flex items-center gap-2"><BookOpenIcon class="w-5 h-5 text-yellow-400" /> Panduan Penggunaan</h2>`
  )
  .replace(
    `<span class="text-2xl">{{ tip.icon }}</span>`,
    `<component :is="tip.icon" class="w-5 h-5 text-yellow-400" />`
  )
  .replace(
    `const tips = [
  { icon: "??", title: "Deskripsikan bunyi"`,
    `const tips = [
  { icon: SpeakerWaveIcon, title: "Deskripsikan bunyi"`
  )
  .replace(`{ icon: "??", title: "Warna asap knalpot"`, `{ icon: FireIcon, title: "Warna asap knalpot"`)
  .replace(`{ icon: "???", title: "Kondisi suhu mesin"`, `{ icon: ExclamationTriangleIcon, title: "Kondisi suhu mesin"`)
  .replace(`{ icon: "?", title: "Performa & tenaga"`, `{ icon: BoltIcon, title: "Performa & tenaga"`)
  .replace(`{ icon: "??", title: "Kebocoran cairan"`, `{ icon: BeakerIcon, title: "Kebocoran cairan"`)
  .replace(`{ icon: "??", title: "Handling kendaraan"`, `{ icon: TruckIcon, title: "Handling kendaraan"`)
  .replace(`]`, `]`, 1);
fs.writeFileSync('src/views/AiDiagnosticView.vue', newAi, 'utf8');
console.log('✅ AiDiagnosticView.vue berhasil diupdate!');
