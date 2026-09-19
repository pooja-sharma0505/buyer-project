<template>
  <Teleport to="body">
    <div v-if="show" class="search-suggestions-overlay" @click.self="close">
      <div class="search-suggestions-dropdown">
        <div v-if="loading" class="suggestions-loading">
          <div class="spinner"></div>
          <span>Searching...</span>
        </div>
        <div v-else-if="suggestions.length === 0 && searchQuery.trim()" class="suggestions-empty">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <span>No products found for "{{ searchQuery }}"</span>
        </div>
        <ul v-else class="suggestions-list">
          <li v-for="item in suggestions" :key="item.id" class="suggestion-item" @click="selectSuggestion(item)">
            <img :src="item.image || '/placeholder-product.svg'" :alt="item.title" class="suggestion-thumb" />
            <div class="suggestion-info">
              <span class="suggestion-title">{{ item.title }}</span>
              <span class="suggestion-price">{{ formatPrice(item.price) }}</span>
            </div>
            <svg class="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </li>
        </ul>
        <div v-if="suggestions.length > 0" class="suggestions-footer">
          <NuxtLink to="/" class="view-all-link">View all results →</NuxtLink>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
  show: { type: Boolean, default: false },
  suggestions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['close', 'select'])

const { formatPrice } = useFormatPrice()

function selectSuggestion(item) {
  $emit('select', item)
}

function close() {
  $emit('close')
}
</script>

<style scoped>
.search-suggestions-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: transparent;
}

.search-suggestions-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.suggestions-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #6b7280;
  font-size: 13px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #d4af64;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.suggestions-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 320px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-thumb {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  flex-shrink: 0;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.suggestion-title {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-price {
  font-size: 12px;
  font-weight: 600;
  color: #d4af64;
}

.suggestion-arrow {
  color: #9ca3af;
  flex-shrink: 0;
}

.suggestions-footer {
  border-top: 1px solid #e5e7eb;
  padding: 10px 12px;
}

.view-all-link {
  display: block;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #d4af64;
  text-decoration: none;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: #b8860b;
}
</style>