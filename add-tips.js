const fs = require('fs');
let content = fs.readFileSync('src/views/DashboardView.vue', 'utf8');

const tipsHTML = `
    <!-- Tips & Checklist -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <BoltIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Tips Kelola Bengkel
        </h2>
        <div class="space-y-3">
          <div v-for="tip in tips" :key="tip.title" class="flex items-start gap-3 p-3 rounded-xl" :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :style="{ background: tip.gradient }">
              <component :is="tip.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium" :style="{ color: 'var(--text-primary)' }">{{ tip.title }}</p>
              <p class="text-xs mt-0.5" :style="{ color: 'var(--text-muted)' }">{{ tip.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2 class="font-semibold mb-4 flex items-center gap-2 text-sm" :style="{ color: 'var(--text-primary)' }">
          <ClipboardDocumentListIcon class="w-4 h-4" :style="{ color: 'var(--accent)' }" /> Checklist Harian
        </h2>
        <div class="space-y-2">
          <div v-for="(item, i) in checklist" :key="i" @click="item.done = !item.done"
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-all"
            :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              :style="item.done ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border-color)' }">
              <CheckCircleIcon v-if="item.done" class="w-3 h-3 text-black" />
            </div>
            <span class="text-sm flex-1" :style="{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }">{{ item.label }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" :style="item.done ? { backgroundColor: '#22c55e20', color: '#22c55e' } : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }">{{ item.done ? 'Selesai' : 'Belum' }}</span>
          </div>
        </div>
        <div class="mt-3 pt-3" :style="{ borderTop: '1px solid var(--border-color)' }">
          <div class="flex justify-between text-xs mb-1.5">
            <span :style="{ color: 'var(--text-muted)' }">Progress</span>
            <span class="font-bold" :style="{ color: 'var(--accent)' }">{{ checklist.filter(c => c.done).length }}/{{ checklist.length }}</span>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden" :style="{ backgroundColor: 'var(--bg-primary)' }">
            <div class="h-full rounded-full transition-all duration-500" :style="{ width: (checklist.filter(c => c.done).length / checklist.length * 100) + '%', backgroundColor: 'var(--accent)' }"></div>
          </div>
        </div>
      </div>
    </div>`;

const tipsJS = `
const tips = [
  { title: 'Respon order cepat', desc: 'Respon dalam 5 menit meningkatkan kepuasan customer', icon: BoltIcon, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Update stok rutin', desc: 'Cek stok sparepart minimal seminggu sekali', icon: CubeIcon, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { title: 'Gunakan AI Diagnostic', desc: 'Analisa keluhan lebih akurat dengan bantuan AI', icon: CpuChipIcon, gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
]
const checklist = ref([
  { label: 'Cek order masuk hari ini', done: false },
  { label: 'Update status order berjalan', done: false },
  { label: 'Cek stok sparepart menipis', done: false },
  { label: 'Konfirmasi jadwal mekanik', done: false },
  { label: 'Review transaksi kemarin', done: false },
])
`;

// Tambah HTML sebelum </div>\n</template>
content = content.replace('</div>\n</template>', tipsHTML + '\n  </div>\n</template>');

// Tambah JS sebelum onMounted
content = content.replace('onMounted(async', tipsJS + '\nonMounted(async');

// Tambah CheckCircleIcon ke import jika belum ada
if (!content.includes('CheckCircleIcon')) {
  content = content.replace('} from \'@heroicons/vue/24/outline\'', '  CheckCircleIcon,\n} from \'@heroicons/vue/24/outline\'');
}

fs.writeFileSync('src/views/DashboardView.vue', content, 'utf8');
console.log('Done!');
