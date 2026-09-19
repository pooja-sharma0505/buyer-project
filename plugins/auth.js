export default defineNuxtPlugin(async () => {
  const { fetchUser, isLoggedIn } = useAuth()
  await fetchUser()

  // Pre-fetch cart and wishlist during SSR so the Navbar badge counts
  // and the cart/wishlist pages render with correct data on first load.
  if (isLoggedIn.value && import.meta.server) {
    const cart = useCart()
    const wishlist = useWishlist()

    try {
      const dbCart = await $fetch('/api/cart')
      cart.initFromSsr(dbCart?.items || [])
    } catch {
      cart.isHydrated.value = true
    }

    try {
      const dbWishlist = await $fetch('/api/wishlist')
      wishlist.initFromSsr(dbWishlist?.items || [])
    } catch {
      wishlist.isHydrated.value = true
    }
  }
})
