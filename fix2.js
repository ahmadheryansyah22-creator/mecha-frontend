const fs = require('fs');

// Fix AiDiagnosticView - hanya ganti bagian yang masih ??
let ai = fs.readFileSync('src/views/AiDiagnosticView.vue', 'utf8');

// Tambah import jika belum ada
if (!ai.includes('CpuChipIcon')) {
  ai = ai.replace(
    `import { ref } from "vue"`,
    `import { ref } from "vue"\nimport { CpuChipIcon, MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon, XCircleIcon, BookOpenIcon, SpeakerWaveIcon, FireIcon, BoltIcon, BeakerIcon, TruckIcon, BanknotesIcon } from '@heroicons/vue/24/outline'`
  );
}

// Ganti semua ?? dan ? dengan icon
ai = ai.replace(/\?\?/g, '');
ai = ai.replace(/<div class="w-12 h-12 bg-yellow-400\/20 rounded-xl flex items-center justify-center text-2xl"><\/div>/g,
  '<div class="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-6 h-6 text-yellow-400" /></div>');
ai = ai.replace(/<div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-xl"><\/div>/g,
  '<div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center"><CpuChipIcon class="w-5 h-5 text-black" /></div>');
ai = ai.replace(/<span class="text-xl"><\/span>/g,
  '<MagnifyingGlassIcon class="w-5 h-5" />');
ai = ai.replace(/<span class="text-2xl"><\/span>/g,
  '<XCircleIcon class="w-6 h-6 text-red-400" />');
ai = ai.replace(`> Reset</button>`,
  `class="flex items-center gap-1"><ArrowPathIcon class="w-4 h-4" /> Reset</button>`);

fs.writeFileSync('src/views/AiDiagnosticView.vue', ai, 'utf8');
console.log('✅ AiDiagnosticView.vue berhasil!');

// Fix SparePartView stat cards
let sp = fs.readFileSync('src/views/SparePartView.vue', 'utf8');
if (!sp.includes('ArchiveBoxIcon')) {
  sp = sp.replace(
    `import { ref, computed, onMounted } from 'vue'`,
    `import { ref, computed, onMounted } from 'vue'\nimport { ArchiveBoxIcon, ExclamationTriangleIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'`
  );
}
sp = sp.replace(/text-2xl">📦<\/div>/g, 'justify-center"><ArchiveBoxIcon class="w-6 h-6 text-green-400" /></div>');
sp = sp.replace(/text-2xl">⚠️<\/div>/g, 'justify-center"><ExclamationTriangleIcon class="w-6 h-6 text-red-400" /></div>');
sp = sp.replace(/text-2xl">💰<\/div>/g, 'justify-center"><BanknotesIcon class="w-6 h-6 text-yellow-400" /></div>');
fs.writeFileSync('src/views/SparePartView.vue', sp, 'utf8');
console.log('✅ SparePartView.vue berhasil!');
