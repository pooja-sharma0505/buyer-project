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
      <p>{{ formatPrice(product.price) }}</p>
      <div class="qty-row">
        <button @click="decrease" aria-label="Decrease quantity">-</button>
        <span>{{ quantity }}</span>
        <button @click="increase" aria-label="Increase quantity">+</button>
      </div>
    </div>

    <div class="total">
      <p>{{ formatPrice(product.price * quantity) }}</p>
      <button class="remove" @click="$emit('remove', product.id)">Remove</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const { formatPrice } = useFormatPrice()

const props = defineProps({
  product: Object,
  quantity: Number
})

const emit = defineEmits(['update-qty', 'remove'])

const thumbBroken = ref(false)

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
  gap: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  align-items: center;
}
.thumb-wrap {
  width: var(--product-thumb-row, 120px);
  height: var(--product-thumb-row, 120px);
  flex-shrink: 0;
  border-radius: var(--product-thumb-radius, 10px);
  background: var(--product-thumb-bg, #f8fafc);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
}
.thumb {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}
.meta { flex: 1; }
.meta h2 { margin: 0 0 4px; font-size: 14px; color: #111827; }
.meta p { margin: 0; font-size: 13px; color: #6b7280; }
.qty-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.qty-row button { width: 28px; height: 28px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease; }
.qty-row button:hover { border-color: #d4af64; color: #d4af64; }
.total { text-align: right; }
.total p { margin: 0 0 8px; font-weight: 600; color: #111827; }
.remove { border: none; background: none; color: #dc2626; cursor: pointer; font-size: 12px; }
@media (max-width: 640px) {
  .cart-item {
    display: grid;
    grid-template-columns: var(--product-thumb-row, 120px) 1fr;
    gap: 10px;
    align-items: start;
  }
  .total {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 6px;
    border-top: 1px dashed #e5e7eb;
  }
  .total p { margin: 0; }
}
</style>