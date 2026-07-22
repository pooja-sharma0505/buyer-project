<template>
  <div class="skeleton" :class="type" :style="style">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-img" />
      <div class="skeleton-body">
        <div class="skeleton-line short" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>
    </div>
    <div v-else-if="type === 'text'" class="skeleton-text">
      <div class="skeleton-line" :style="{ width: width }" />
      <div v-if="lines > 1" class="skeleton-line" :style="{ width: '85%' }" />
      <div v-if="lines > 2" class="skeleton-line" :style="{ width: '60%' }" />
    </div>
    <div v-else-if="type === 'detail'" class="skeleton-detail">
      <div class="skeleton-img" />
      <div class="skeleton-body">
        <div class="skeleton-line short" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
        <div class="skeleton-line" />
      </div>
    </div>
    <div v-else-if="type === 'cart-item'" class="skeleton-cart-item">
      <div class="skeleton-img small" />
      <div class="skeleton-body">
        <div class="skeleton-line short" />
        <div class="skeleton-line" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'text' },
  lines: { type: Number, default: 2 },
  width: { type: String, default: '100%' },
})
const style = computed(() => ({}))
</script>

<style scoped>
.skeleton {
  --skeleton-bg: #e5e7eb;
  --skeleton-shine: #f3f4f6;
}

.skeleton-line,
.skeleton-img {
  background: var(--skeleton-bg);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.skeleton-line::after,
.skeleton-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, var(--skeleton-shine), transparent);
  animation: shine 1.5s infinite;
}
.skeleton-line { height: 14px; margin-bottom: 10px; }
.skeleton-line.short { width: 60%; }
.skeleton-img { width: 100%; aspect-ratio: 1 / 1; border-radius: 10px; margin-bottom: 12px; }
.skeleton-img.small { width: 120px; height: 120px; flex-shrink: 0; }

.skeleton-card { display: flex; flex-direction: column; }
.skeleton-text { display: flex; flex-direction: column; }
.skeleton-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.skeleton-cart-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 12px; }

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (max-width: 820px) {
  .skeleton-detail { grid-template-columns: 1fr; }
}
</style>