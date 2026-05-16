<template>
  <div>
    <!-- Stat Cards Skeleton -->
    <div v-if="type === 'stats'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="flex items-center gap-4">
          <div class="skeleton w-11 h-11 rounded-2xl shrink-0"></div>
          <div class="flex-1">
            <div class="skeleton h-7 w-16 mb-2"></div>
            <div class="skeleton h-3 w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in count" :key="i" class="skeleton-card flex items-center gap-4">
        <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
        <div class="flex-1">
          <div class="skeleton h-4 w-3/4 mb-2"></div>
          <div class="skeleton h-3 w-1/2"></div>
        </div>
        <div class="skeleton h-6 w-16 rounded-full"></div>
      </div>
    </div>

    <!-- Card Grid Skeleton -->
    <div v-else-if="type === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="flex items-center gap-3 mb-4">
          <div class="skeleton w-12 h-12 rounded-2xl shrink-0"></div>
          <div class="flex-1">
            <div class="skeleton h-4 w-2/3 mb-2"></div>
            <div class="skeleton h-3 w-1/2"></div>
          </div>
        </div>
        <div class="skeleton h-3 w-full mb-2"></div>
        <div class="skeleton h-3 w-4/5 mb-4"></div>
        <div class="skeleton h-9 w-full rounded-xl"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="type === 'table'" class="skeleton-card">
      <div class="skeleton h-4 w-48 mb-6"></div>
      <div v-for="i in count" :key="i" class="flex items-center gap-4 py-3 border-b" :style="{ borderColor: 'var(--border-color)' }">
        <div class="skeleton w-8 h-8 rounded-lg shrink-0"></div>
        <div class="flex-1">
          <div class="skeleton h-3 w-2/3 mb-1.5"></div>
          <div class="skeleton h-2.5 w-1/3"></div>
        </div>
        <div class="skeleton h-6 w-16 rounded-full"></div>
        <div class="skeleton h-6 w-20 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'list' },
  count: { type: Number, default: 4 }
})
</script>
