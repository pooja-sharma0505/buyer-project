<script setup>
useHead({
  titleTemplate: '%s | LUMIÈRE',
  meta: [
    { name: 'description', content: 'LUMIÈRE — a curated collection of luxury essentials. Shop jewellery, fashion, electronics, and more.' }
  ]
})
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="app-main">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Montserrat', sans-serif;
  background: #ffffff;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: 72px;
}
</style>
