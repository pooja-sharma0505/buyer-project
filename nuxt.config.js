export default defineNuxtConfig({
  compatibilityDate: '2026-07-11',

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap' }
      ]
    }
  },

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
