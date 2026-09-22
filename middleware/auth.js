export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, waitForAuthReady } = useAuth()

  await waitForAuthReady()

  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
