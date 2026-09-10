<template>
  <div class="cart-item">
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
          <i class="bi bi-dash"></i>
        </button>
        <span class="qty-value">{{ quantity }}</span>
        <button
          @click="increase"
          :disabled="isAtLimit"
          class="qty-btn"
          aria-label="Increase quantity"
          :aria-describedby="isAtLimit ? 'limit-msg-' + product.id : undefined"
        >
          <i class="bi bi-plus"></i>
        </button>
      </div>
      <p v-if="isAtLimit" :id="'limit-msg-' + product.id" class="limit-msg">Max {{ cart.MAX_QTY_PER_PRODUCT }} per product</p>
    </div>

    <div class="total">
      <p class="total-price">{{ formatPrice(product.price * quantity) }}</p>
      <button class="remove-btn" @click="$emit('remove', product.id)">
        <i class="bi bi-trash3"></i>
        <span>Remove</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const { formatPrice } = useFormatPrice()
const cart = useCart()

const props = defineProps({
  product: Object,
  quantity: Number
})

const emit = defineEmits(['update-qty', 'remove'])

const thumbBroken = ref(false)

const isAtLimit = computed(() => props.quantity >= cart.MAX_QTY_PER_PRODUCT)

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
  if (isAtLimit.value) return
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
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  align-items: center;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.cart-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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
  color: #f59e0b;
  margin: 6px 0 0;
  font-weight: 500;
}
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
.remove-btn i {
  font-size: 14px;
}
@media (max-width: 640px) {
  .cart-item {
    display: grid;
    grid-template-columns: var(--product-thumb-row, 100px) 1fr;
    gap: 12px;
    align-items: start;
    padding: 12px;
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
}
</style>