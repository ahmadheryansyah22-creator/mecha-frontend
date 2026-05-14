<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold" :style="{ color: `var(--text-primary)` }">Transaksi</h1>
        <p class="mt-1" :style="{ color: `var(--text-secondary)` }">Kelola data transaksi pembayaran</p>
      </div>
      <button @click="showModal = true" class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
        <PlusIcon class="w-4 h-4" /> Tambah Transaksi
      </button>
    </div>

    <div class="card">
      <div v-if="loading" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Memuat data...</div>
      <div v-else-if="transactions.length === 0" class="text-center py-8" :style="{ color: `var(--text-muted)` }">Belum ada data transaksi</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr :style="{ borderBottom: `1px solid var(--border-color)` }">
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">No. Transaksi</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">No. Order</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Metode</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Status</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Jumlah</th>
              <th class="text-left text-sm pb-3" :style="{ color: `var(--text-secondary)` }">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" :style="{ borderBottom: `1px solid var(--border-color)` }">
              <td class="py-3 text-sm font-medium" :style="{ color: `var(--text-primary)` }">{{ t.transaction_number }}</td>
              <td class="py-3 text-sm" :style="{ color: `var(--text-secondary)` }">{{ t.order?.order_number || '-' }}</td>
              <td class="py-3 text-sm capitalize" :style="{ color: `var(--text-secondary)` }">{{ t.payment_method }}</td>
              <td class="py-3"><span class="text-xs px-2 py-1 rounded-full" :class="statusClass(t.status)">{{ t.status }}</span></td>
              <td class="py-3 text-sm font-medium" :style="{ color: `var(--accent)` }">Rp {{ formatRupiah(t.amount) }}</td>
              <td class="py-3"><button @click="deleteTransaction(t.id)" class="text-sm text-red-400 hover:text-red-300">Hapus</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="rounded-2xl p-8 w-full max-w-lg" :style="{ backgroundColor: `var(--bg-card)`, border: `1px solid var(--border-color)` }">
        <h2 class="text-lg font-semibold mb-6" :style="{ color: `var(--text-primary)` }">Tambah Transaksi</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">No. Transaksi</label><input v-model="form.transaction_number" type="text" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Order</label><select v-model="form.order_id" class="input-field"><option v-for="o in orders" :key="o.id" :value="o.id">{{ o.order_number }}</option></select></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Jumlah</label><input v-model="form.amount" type="number" class="input-field" /></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Metode Pembayaran</label><select v-model="form.payment_method" class="input-field"><option value="tunai">Tunai</option><option value="transfer">Transfer</option><option value="kartu_kredit">Kartu Kredit</option><option value="cicilan">Cicilan</option></select></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Status</label><select v-model="form.status" class="input-field"><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></div>
          <div><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Tanggal Bayar</label><input v-model="form.paid_at" type="datetime-local" class="input-field" /></div>
        </div>
        <div class="mb-4"><label class="block text-sm mb-2" :style="{ color: `var(--text-secondary)` }">Catatan</label><textarea v-model="form.notes" class="input-field" rows="2"></textarea></div>
        <div class="flex gap-3">
          <button @click="showModal = false" class="flex-1 py-3 rounded-lg text-sm" :style="{ border: `1px solid var(--border-color)`, color: `var(--text-secondary)` }">Batal</button>
          <button @click="storeTransaction" class="flex-1 btn-primary py-3 rounded-lg">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { PlusIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const showModal = ref(false)
const transactions = ref([])
const orders = ref([])
const form = ref({ transaction_number: '', order_id: '', amount: '', payment_method: 'tunai', status: 'pending', notes: '', paid_at: '' })

const statusClass = (s) => ({ pending: 'bg-yellow-500/20 text-yellow-400', completed: 'bg-green-500/20 text-green-400', failed: 'bg-red-500/20 text-red-400', refunded: 'bg-purple-500/20 text-purple-400' }[s] || 'bg-gray-500/20 text-gray-400')
const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v)

const fetchTransactions = async () => {
  loading.value = true
  try {
    const [tRes, oRes] = await Promise.all([axios.get('/api/transactions'), axios.get('/api/orders')])
    transactions.value = tRes.data.data.data || []
    orders.value = oRes.data.data.data || []
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const storeTransaction = async () => {
  try {
    await axios.post('/api/transactions', form.value)
    showModal.value = false
    fetchTransactions()
  } catch (err) { console.error(err) }
}

const deleteTransaction = async (id) => {
  if (!confirm('Hapus transaksi ini?')) return
  try {
    await axios.delete(`/api/transactions/${id}`)
    fetchTransactions()
  } catch (err) { console.error(err) }
}

onMounted(fetchTransactions)
</script>
