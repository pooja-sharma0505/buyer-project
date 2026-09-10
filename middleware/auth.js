export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, waitForAuthReady } = useAuth()

  // Wait for auth initialization to complete before making any redirect decision
  // This ensures the session is restored from the server before checking auth state
  await waitForAuthReady()

  // After auth is ready, check if user is logged in
  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
