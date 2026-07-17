export default defineNuxtConfig({
  compatibilityDate: '2026-07-11',

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/product-thumb.css'],

  tailwindcss: {
    configPath: '~/assets/css/tailwind.config.js'
  },

  runtimeConfig: {
    dbHost: process.env.DB_HOST || '127.0.0.1',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'demostore'
  }
})
