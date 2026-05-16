<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between" style="background: rgba(10,10,10,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,193,7,0.1);">
      <div class="flex items-center gap-3">
        <img src="@/assets/logo-mecha.png" alt="MECHA" class="w-9 h-9 object-contain" />
        <span class="font-bold text-xl text-yellow-400">MECHA</span>
      </div>
      <div class="hidden md:flex items-center gap-8">
        <a href="#fitur" class="text-sm text-gray-400 hover:text-yellow-400 transition-colors">Fitur</a>
        <a href="#cara-kerja" class="text-sm text-gray-400 hover:text-yellow-400 transition-colors">Cara Kerja</a>
        <a href="#testimoni" class="text-sm text-gray-400 hover:text-yellow-400 transition-colors">Testimoni</a>
      </div>
      <div class="flex items-center gap-3">
        <RouterLink to="/login" class="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Masuk</RouterLink>
        <RouterLink to="/register" class="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-90" style="background: #f59e0b; color: #000;">Daftar Gratis</RouterLink>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center px-8 pt-20 relative">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style="background: #f59e0b;"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl" style="background: #f59e0b;"></div>
      </div>
      <div class="text-center max-w-4xl mx-auto relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8" style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #f59e0b;">
          <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          Platform Manajemen Bengkel #1 di Indonesia
        </div>
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Bengkel Lebih
          <span style="background: linear-gradient(135deg, #f59e0b, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Modern</span>
          <br />dengan MECHA
        </h1>
        <p class="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kelola bengkel, mekanik, order servis, dan stok sparepart dalam satu platform. Dilengkapi AI Diagnostic untuk analisa kendaraan lebih akurat.
        </p>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <RouterLink to="/register" class="px-8 py-4 rounded-2xl font-semibold text-black flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg" style="background: linear-gradient(135deg, #f59e0b, #fbbf24); box-shadow: 0 0 30px rgba(245,158,11,0.3);">
            Mulai Gratis Sekarang →
          </RouterLink>
          <RouterLink to="/login" class="px-8 py-4 rounded-2xl font-semibold text-gray-300 flex items-center gap-2 transition-all hover:border-yellow-400 hover:text-yellow-400" style="border: 1px solid rgba(255,255,255,0.1);">
            Sudah punya akun
          </RouterLink>
        </div>
        <div class="flex items-center justify-center gap-8 mt-12">
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-400">500+</p>
            <p class="text-xs text-gray-500">Bengkel Aktif</p>
          </div>
          <div class="w-px h-8 bg-gray-800"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-400">10rb+</p>
            <p class="text-xs text-gray-500">Order Selesai</p>
          </div>
          <div class="w-px h-8 bg-gray-800"></div>
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-400">4.9★</p>
            <p class="text-xs text-gray-500">Rating Pengguna</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fitur -->
    <section id="fitur" class="py-24 px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-yellow-400 text-sm font-medium mb-3">Kenapa MECHA?</p>
          <h2 class="text-4xl font-bold mb-4">Semua yang kamu butuhkan<br />ada di sini</h2>
          <p class="text-gray-400 max-w-xl mx-auto">Dari manajemen bengkel hingga AI Diagnostic, MECHA hadir sebagai solusi lengkap untuk bisnis bengkel modern.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="f in fitur" :key="f.title"
            class="p-6 rounded-2xl transition-all hover:scale-[1.02] hover:border-yellow-400/30 cursor-default"
            style="background: #111; border: 1px solid rgba(255,255,255,0.06);">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" :style="{ background: f.gradient }">
              <component :is="f.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-semibold text-lg mb-2">{{ f.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cara Kerja -->
    <section id="cara-kerja" class="py-24 px-8" style="background: #0d0d0d;">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-yellow-400 text-sm font-medium mb-3">Mudah & Cepat</p>
          <h2 class="text-4xl font-bold mb-4">Mulai dalam 3 langkah</h2>
        </div>
        <div class="space-y-6">
          <div v-for="(step, i) in steps" :key="i" class="flex items-start gap-6 p-6 rounded-2xl" style="background: #111; border: 1px solid rgba(255,255,255,0.06);">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-black text-lg" style="background: linear-gradient(135deg, #f59e0b, #fbbf24);">
              {{ i + 1 }}
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-1">{{ step.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimoni -->
    <section id="testimoni" class="py-24 px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-yellow-400 text-sm font-medium mb-3">Testimoni</p>
          <h2 class="text-4xl font-bold mb-4">Dipercaya ribuan bengkel</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="t in testimoni" :key="t.name" class="p-6 rounded-2xl" style="background: #111; border: 1px solid rgba(255,255,255,0.06);">
            <div class="flex items-center gap-1 mb-4">
              <span v-for="s in 5" :key="s" class="text-yellow-400 text-sm">★</span>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed mb-6">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black" style="background: #f59e0b;">
                {{ t.name[0] }}
              </div>
              <div>
                <p class="font-medium text-sm">{{ t.name }}</p>
                <p class="text-xs text-gray-500">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 px-8">
      <div class="max-w-3xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden" style="background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05)); border: 1px solid rgba(245,158,11,0.2);">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl" style="background: #f59e0b;"></div>
        <div class="relative z-10">
          <h2 class="text-4xl font-bold mb-4">Siap modernisasi bengkelmu?</h2>
          <p class="text-gray-400 mb-8">Daftar sekarang gratis. Tidak perlu kartu kredit.</p>
          <RouterLink to="/register" class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-black transition-all hover:scale-105" style="background: linear-gradient(135deg, #f59e0b, #fbbf24); box-shadow: 0 0 40px rgba(245,158,11,0.4);">
            Daftar Gratis Sekarang →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-8 text-center" style="border-top: 1px solid rgba(255,255,255,0.06);">
      <p class="text-gray-500 text-sm">© 2026 MECHA. Platform Manajemen Bengkel Modern.</p>
    </footer>
  </div>
</template>

<script setup>
import {
  BuildingStorefrontIcon, WrenchScrewdriverIcon, CpuChipIcon,
  ClipboardDocumentListIcon, CubeIcon, BanknotesIcon,
  UserGroupIcon, MapPinIcon, ShieldCheckIcon,
} from '@heroicons/vue/24/outline'

const fitur = [
  { title: 'Manajemen Bengkel', desc: 'Kelola profil bengkel, jam operasional, dan layanan yang tersedia dengan mudah.', icon: BuildingStorefrontIcon, gradient: 'linear-gradient(135deg,#22c55e,#16a34a)' },
  { title: 'AI Diagnostic', desc: 'Analisa keluhan kendaraan dengan kecerdasan buatan untuk diagnosa yang lebih akurat dan cepat.', icon: CpuChipIcon, gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
  { title: 'Order Servis', desc: 'Terima dan kelola order servis dari customer secara real-time dengan notifikasi otomatis.', icon: ClipboardDocumentListIcon, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Stok Sparepart', desc: 'Pantau stok sparepart, dapatkan notifikasi saat stok menipis, dan kelola pembelian.', icon: CubeIcon, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { title: 'Manajemen Mekanik', desc: 'Kelola jadwal dan performa mekanik. Assign order ke mekanik yang tepat dengan mudah.', icon: WrenchScrewdriverIcon, gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
  { title: 'Laporan Keuangan', desc: 'Pantau pendapatan, transaksi, dan laporan keuangan bengkel secara real-time.', icon: BanknotesIcon, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
]

const steps = [
  { title: 'Daftar & Pilih Role', desc: 'Buat akun gratis dan pilih role kamu — sebagai pemilik bengkel, mekanik, atau customer yang mencari bengkel.' },
  { title: 'Setup Bengkel atau Temukan Bengkel', desc: 'Pemilik bengkel lengkapi profil dan layanan. Customer langsung cari bengkel terdekat atau gunakan AI Diagnostic.' },
  { title: 'Mulai Kelola & Servis', desc: 'Terima order, assign ke mekanik, update status real-time, dan pantau semua dari satu dashboard.' },
]

const testimoni = [
  { name: 'Budi Santoso', role: 'Pemilik Bengkel, Jakarta', text: 'Sejak pakai MECHA, manajemen bengkel saya jauh lebih rapi. Order tidak pernah terlewat dan customer lebih puas.' },
  { name: 'Siti Rahayu', role: 'Customer, Bandung', text: 'Cari bengkel jadi mudah banget! Bisa lihat rating dan langsung pesan servis. AI Diagnostic-nya juga membantu banget.' },
  { name: 'Ahmad Rizki', role: 'Mekanik, Surabaya', text: 'Kerja jadi lebih terorganisir. Semua order masuk ke aplikasi, tidak perlu repot catat manual lagi.' },
]
</script>