<template>
  <div
    class="cart-item"
    :class="{ 'swiping': swipeOffset !== 0 }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <!-- Swipe-to-delete background -->
    <div class="swipe-actions" @click="confirmRemove">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      <span>Delete</span>
    </div>

    <div class="item-content" :style="{ transform: `translateX(${swipeOffset}px)` }">
      <div class="thumb-wrap">
        <img
          :src="displaySrc"
          :alt="product.title || 'Product'"
          class="thumb"
          loading="lazy"
          @error="onThumbError"
        />
      </div>

      <div class="meta">
        <h2>{{ product.title }}</h2>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <div class="qty-row">
          <button @click="decrease" class="qty-btn" aria-label="Decrease quantity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span class="qty-value">{{ quantity }}</span>
          <button
            @click="increase"
            :disabled="isAtMaxQty || isAtStockLimit"
            class="qty-btn"
            aria-label="Increase quantity"
            :aria-describedby="isAtMaxQty ? 'max-msg-' + product.id : (isAtStockLimit ? 'stock-msg-' + product.id : undefined)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        <p v-if="isAtMaxQty" :id="'max-msg-' + product.id" class="limit-msg max-qty-msg">Maximum {{ cart.MAX_QTY_PER_PRODUCT }} units allowed for this product</p>
        <p v-else-if="isAtStockLimit" :id="'stock-msg-' + product.id" class="limit-msg low-stock-msg">Only {{ product.stock || 1 }} left in stock</p>
      </div>

      <div class="total">
        <p class="total-price">{{ formatPrice(product.price * quantity) }}</p>
        <button class="remove-btn" @click="$emit('remove', product.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const { formatPrice } = useFormatPrice()
const cart = useCart()

const props = defineProps({
  product: Object,
  quantity: Number
})

const emit = defineEmits(['update-qty', 'remove'])

const thumbBroken = ref(false)
const swipeOffset = ref(0)
const touchStartX = ref(null)
const isSwiping = ref(false)

const isAtMaxQty = computed(() => {
  const stock = props.product?.stock
  const maxByStock = stock != null && stock >= 1 ? stock : cart.MAX_QTY_PER_PRODUCT
  return props.quantity >= Math.min(cart.MAX_QTY_PER_PRODUCT, maxByStock) && props.quantity >= cart.MAX_QTY_PER_PRODUCT
})

const isAtStockLimit = computed(() => {
  const stock = props.product?.stock
  if (stock == null || stock < 1) return false
  const maxByStock = Math.min(cart.MAX_QTY_PER_PRODUCT, stock)
  return props.quantity >= maxByStock && props.quantity < cart.MAX_QTY_PER_PRODUCT
})

const isAtLimit = computed(() => isAtMaxQty.value || isAtStockLimit.value)

const displaySrc = computed(() => {
  if (thumbBroken.value) return '/placeholder-product.svg'
  return props.product?.image || '/placeholder-product.svg'
})

const onThumbError = () => {
  thumbBroken.value = true
}

watch(
  () => props.product?.image,
  () => {
    thumbBroken.value = false
  }
)

const increase = () => {
  if (isAtLimit.value) {
    const toast = useToast()
    if (isAtMaxQty.value) {
      toast.error(`Maximum ${cart.MAX_QTY_PER_PRODUCT} units allowed for this product`)
    } else {
      toast.error(`Only ${props.product.stock || 1} left in stock`)
    }
    return
  }
  emit('update-qty', {
    id: props.product.id,
    quantity: props.quantity + 1
  })
}

const decrease = () => {
  if (props.quantity > 1) {
    emit('update-qty', {
      id: props.product.id,
      quantity: props.quantity - 1
    })
  }
}

const confirmRemove = () => {
  emit('remove', props.product.id)
  swipeOffset.value = 0
}

// Touch handlers for swipe-to-delete
function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  isSwiping.value = true
}

function onTouchMove(e) {
  if (!isSwiping.value || touchStartX.value === null) return
  const deltaX = e.touches[0].clientX - touchStartX.value
  if (deltaX < 0) {
    swipeOffset.value = Math.max(deltaX, -100)
  }
}

function onTouchEnd() {
  isSwiping.value = false
  touchStartX.value = null
  if (swipeOffset.value < -60) {
    confirmRemove()
  } else {
    swipeOffset.value = 0
  }
}

// Mouse handlers for desktop testing
function onMouseDown(e) {
  if (e.button !== 0) return
  touchStartX.value = e.clientX
  isSwiping.value = true
  const onMouseMove = (moveEvent) => {
    if (!isSwiping.value || touchStartX.value === null) return
    const deltaX = moveEvent.clientX - touchStartX.value
    if (deltaX < 0) {
      swipeOffset.value = Math.max(deltaX, -100)
    }
  }
  const onMouseUp = () => {
    isSwiping.value = false
    touchStartX.value = null
    if (swipeOffset.value < -60) {
      confirmRemove()
    } else {
      swipeOffset.value = 0
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.cart-item {
  position: relative;
  display: flex;
  gap: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  align-items: center;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.cart-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.cart-item.swiping {
  transition: none;
}

.swipe-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  z-index: 1;
}

.item-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 16px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  transition: transform 0.2s ease;
  will-change: transform;
}

.thumb-wrap {
  width: var(--product-thumb-row, 110px);
  height: var(--product-thumb-row, 110px);
  flex-shrink: 0;
  border-radius: var(--product-thumb-radius, 12px);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.thumb {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  transition: transform 0.3s ease;
}
.cart-item:hover .thumb {
  transform: scale(1.05);
}
.meta { flex: 1; min-width: 0; }
.meta h2 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta .price {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}
.qty-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 12px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 4px;
  width: fit-content;
}
.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.qty-btn:hover:not(:disabled) {
  background: #d4af64;
  color: #fff;
  box-shadow: 0 2px 4px rgba(212, 175, 100, 0.3);
}
.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.qty-value {
  min-width: 36px;
  text-align: center;
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}
.limit-msg {
  font-size: 11px;
  margin: 6px 0 0;
  font-weight: 500;
}
.max-qty-msg { color: #f59e0b; }
.low-stock-msg { color: #dc2626; }
.total {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}
.total-price {
  margin: 0;
  font-weight: 700;
  color: #111827;
  font-size: 16px;
}
.remove-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #fee2e2;
  background: #fef2f2;
  color: #dc2626;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.remove-btn:hover {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
@media (max-width: 640px) {
  .cart-item {
    padding: 12px;
  }
  .item-content {
    display: grid;
    grid-template-columns: var(--product-thumb-row, 100px) 1fr;
    gap: 12px;
    align-items: start;
    width: 100%;
  }
  .total {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px dashed #e5e7eb;
    margin-top: 8px;
  }
  .total-price { font-size: 15px; }
  .meta h2 { font-size: 14px; }
  .swipe-actions {
    width: 90px;
    font-size: 12px;
  }
}
</style>