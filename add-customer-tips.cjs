const fs = require('fs');
let content = fs.readFileSync('src/views/customer/CustomerHome.vue', 'utf8');

const tipsHTML = `
    <!-- Tips Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="tip in tips" :key="tip.title" class="card hover:scale-[1.02] transition-transform cursor-default">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" :style="{ background: tip.gradient }">
          <component :is="tip.icon" class="w-6 h-6 text-white" />
        </div>
        <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">{{ tip.title }}</h3>
        <p class="text-sm" :style="{ color: 'var(--text-secondary)' }">{{ tip.desc }}</p>
      </div>
    </div>`;

const tipsJS = `
const tips = [
  { title: 'Deskripsikan keluhan detail', desc: 'Semakin detail keluhan kamu, semakin cepat mekanik bisa mendiagnosa masalah kendaraan', icon: WrenchScrewdriverIcon, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Cek rating bengkel', desc: 'Pilih bengkel dengan rating tinggi untuk hasil servis yang terpercaya dan berkualitas', icon: MapPinIcon, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { title: 'Gunakan AI Diagnostic', desc: 'Analisa keluhan kendaraan dengan AI sebelum ke bengkel untuk estimasi biaya lebih akurat', icon: CpuChipIcon, gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
]
`;

// Tambah sebelum Order Terakhir
content = content.replace('    <!-- Order Terakhir -->', tipsHTML + '\n    <!-- Order Terakhir -->');
content = content.replace('const formatRupiah', tipsJS + '\nconst formatRupiah');

// Tambah CpuChipIcon ke import jika belum ada
if (!content.includes('CpuChipIcon')) {
  content = content.replace("} from '@heroicons/vue/24/outline'", "  CpuChipIcon,\n} from '@heroicons/vue/24/outline'");
}

fs.writeFileSync('src/views/customer/CustomerHome.vue', content, 'utf8');
console.log('Done!');
