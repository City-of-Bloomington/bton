module.exports = {
  mode: 'universal',
  // server: {
  //   port: 443
  // },

  env: {
    apiHost: process.env.API_HOST,
    clientHost: process.env.CLIENT_HOST,
    cobWebsiteURL: process.env.CITY_WEBSITE_URL,
  },

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  manifest: {
    name: 'Bton - City of Bloomington, Indiana, online services.',
    short_name: 'Bton',
    theme_color: '#1e59ae',
    background_color: '#1e5aae',
    display: 'standalone',
    description: 'Shorten City of Bloomington URLs using Bton.'
  },

  loading: { color: '#fff' },

  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
  ],

  css: ['assets/scss/style.scss'],

  styleResources: {
    scss: [
      '~assets/scss/system.utils.scss',
    ]
  },

  plugins: [
    { src: '~/plugins/design-system' },
    { src: '~/plugins/universal-methods' },
    // { src: '~/plugins/click-outside' },
    { src: '~/plugins/google-analytics.js', ssr: false },
    // { src: '~/plugins/persistedState.js',   ssr: false },
    // { src: '~/plugins/vue-cropper',         ssr: false },
    // { src: '~/plugins/vuedraggable.js',     ssr: false }
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },



  serverMiddleware: [
    { path: '/api', handler: '~/server/api/index.js' }
  ],
  build: {
    // transpile: ['vue-cropperjs'],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
  }
}
