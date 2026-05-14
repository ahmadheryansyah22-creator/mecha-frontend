const fs = require('fs');
const path = 'src/views/SparePartView.vue';
let content = fs.readFileSync(path, 'utf8');

// Ganti import script setup
content = content.replace(
`import { ref, computed, onMounted } from 'vue'
import axios from 'axios'`,
`import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'`
);

// Ganti stat cards emoji
content = content.replace(
  `<div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">📦</div>`,
  `<div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><ArchiveBoxIcon class="w-6 h-6 text-green-400" /></div>`
);
content = content.replace(
  `<div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl">⚠️</div>`,
  `<div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"><ExclamationTriangleIcon class="w-6 h-6 text-red-400" /></div>`
);
content = content.replace(
  `<div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl">💰</div>`,
  `<div class="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center"><BanknotesIcon class="w-6 h-6 text-yellow-400" /></div>`
);

// Ganti filter labels
content = content.replace(
  `{ value: 'semua', label: '📦 Semua' }`,
  `{ value: 'semua', label: 'Semua', icon: ArchiveBoxIcon }`
);
content = content.replace(
  `{ value: 'tersedia', label: '✅ Tersedia' }`,
  `{ value: 'tersedia', label: 'Tersedia', icon: CheckCircleIcon }`
);
content = content.replace(
  `{ value: 'menipis', label: '⚠️ Stok Menipis' }`,
  `{ value: 'menipis', label: 'Stok Menipis', icon: ExclamationTriangleIcon }`
);
content = content.replace(
  `{ value: 'habis', label: '❌ Habis' }`,
  `{ value: 'habis', label: 'Habis', icon: XCircleIcon }`
);

// Ganti tombol filter template (tambah icon)
content = content.replace(
  `        class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
      >
        {{ f.label }}`,
  `        class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
      >
        <component :is="f.icon" class="w-4 h-4" />{{ f.label }}`
);

// Ganti warning icon di tabel
content = content.replace(
  `<span v-if="part.stock <= part.min_stock" class="text-xs text-red-400">⚠️</span>`,
  `<ExclamationTriangleIcon v-if="part.stock <= part.min_stock" class="w-4 h-4 text-red-400" />`
);

fs.writeFileSync(path, content, 'utf8');
console.log('✅ SparePartView.vue berhasil diupdate!');
