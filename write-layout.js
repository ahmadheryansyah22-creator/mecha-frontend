const fs = require('fs');
const content = <template>
  <div :class="isDark ? 'dark' : 'light'" class="flex min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <aside class="w-64 flex flex-col fixed h-full" :style="{ backgroundColor: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }">
      <div class="p-5" :style="{ borderBottom: '1px solid var(--sidebar-border)' }">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ backgroundColor: 'var(--accent)' }">
            <span class="text-lg">🔧</span>
          </div>
          <div>
            <h1 class="font-bold" :style="{ color: 'var(--accent)' }">MECHA</h1>
            <p class="text-xs" :style="{ color: 'var(--text-muted)' }">Bengkel Management</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <RouterLink v-for="menu in menus" :key="menu.path" :to="menu.path" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm" :style="{ color: 'var(--text-secondary)' }" active-class="font-semibold">
          <span class="text-lg">{{ menu.icon }}</span>
          <span>{{ menu.label }}</span>
        </RouterLink>
      </nav>
      <div class="p-3" :style="{ borderTop: '1px solid var(--sidebar-border)' }">
        <div class="flex items-center justify-between px-3 py-2.5 rounded-xl mb-2" :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="flex items-center gap-2">
            <span>{{ isDark ? '🌙' : '☀️' }}</span>
            <span class="text-sm" :style="{ color: 'var(--text-secondary)' }">{{ isDark ? 'Mode Gelap' : 'Mode Terang' }}</span>
          </div>
          <button @click="toggleTheme" class="w-11 h-6 rounded-full relative transition-all duration-300" :style="{ backgroundColor: isDark ? 'var(--accent)' : 'var(--border-color)' }">
            <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow" :style="{ left: isDark ? '24px' : '4px' }"></div>
          </button>
        </div>
        <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl" :style="{ backgroundColor: 'var(--bg-primary)' }">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: 'var(--accent)' }">
            <span class="font-bold text-sm text-black">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :style="{ color: 'var(--text-primary)' }">{{ userName }}</p>
            <p class="text-xs capitalize" :style="{ color: 'var(--text-muted)' }">{{ userRole }}</p>
          </div>
          <button @click="logout" class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all" title="Logout">
            🚪
          </button>
        </div>
      </div>
    </aside>
    <main class="flex-1 ml-64 p-8" :style="{ backgroundColor: 'var(--bg-primary)' }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import axios from 'axios'

const router = useRouter()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

const menus = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/bengkel', icon: '🏪', label: 'Bengkel' },
  { path: '/kendaraan', icon: '🚗', label: 'Kendaraan' },
  { path: '/mekanik', icon: '👨‍🔧', label: 'Mekanik' },
  { path: '/order', icon: '📋', label: 'Order Servis' },
  { path: '/transaksi', icon: '💰', label: 'Transaksi' },
  { path: '/sparepart', icon: '🔩', label: 'Stok Sparepart' },
  { path: '/ai-diagnostic', icon: '🤖', label: 'AI Diagnostic' },
]

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = computed(() => user.name || 'Admin')
const userInitial = computed(() => (user.name || 'A')[0].toUpperCase())
const userRole = computed(() => user.role || 'bengkel')

const logout = async () => {
  try {
    await axios.post('/api/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>;
fs.writeFileSync('src/views/layouts/MainLayout.vue', content);
console.log('Done!');
