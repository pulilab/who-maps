import dotenv from 'dotenv'
import path from 'path'
// import webpack from 'webpack';
const result = dotenv.config()

// const bundlebuddy = require('bundle-buddy-webpack-plugin');

const features = [
  'default',
  'fetch',
  'Object.entries',
  'Object.from',
  'IntersectionObserver',
  'EventSource'
].join('%2C')

if (result.error) {
  console.log(
    '\x1b[31m%s\x1b[0m',
    'Missing .env file, follow the README instructions'
  )
  throw result.error
}

const config = {
  head: {
    title: 'DHA',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'DHA' }
    ],
    link: [
      { rel: 'icon', type: 'image/ico', href: '/favicon.ico' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
    ],
    script: [
      {
        src: `https://polyfill.io/v3/polyfill.min.js?features=${features}`,
        body: true
      }
    ]
  },
  css: ['~assets/style/main.scss', '~assets/style/main.less'],
  env: {
    GlobalCountryID: process.env.GLOBAL_COUNTRY_ID || 201,
    hotjarId: process.env.HOTJAR_TRACKING_ID || null
  },
  plugins: [
    { src: '~plugins/tracking.js' },
    { src: '~plugins/eventfix.js', ssr: false },
    { src: '~plugins/hotjar.js', ssr: false },
    { src: '~plugins/extends.js', ssr: false },
    { src: '~plugins/axios.js', ssr: true },
    { src: '~plugins/token.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: true },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/element.js', ssr: true },
    { src: '~plugins/i18n.js', ssr: true },
    { src: '~plugins/watchHead.js', ssr: false },
    { src: '~plugins/directives.js', ssr: false },
    { src: '~plugins/charts.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-fontawesome',
    '@nuxtjs/gtm',
    '@nuxtjs/sentry',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'en',
            iso: 'en-GB',
            name: 'English',
            file: 'en-GB.js'
          },
          {
            code: 'fr',
            iso: 'fr-FR',
            name: 'Français',
            file: 'fr-FR.js'
          },
          {
            code: 'es',
            iso: 'es-ES',
            name: 'Español',
            file: 'es-ES.js'
          },
          {
            code: 'pt',
            iso: 'pt-PT',
            name: 'Português',
            file: 'pt-PT.js'
          },
          {
            code: 'ar',
            iso: 'ar-AR',
            name: 'Arabic',
            file: 'ar-AR.js'
          }
        ],
        lazy: true,
        langDir: 'lang/',
        strategy: 'prefix',
        rootRedirect: 'en/-/',
        defaultLocale: 'en',
        seo: false,
        vueI18n: {
          fallbackLocale: 'en',
          silentTranslationWarn: true
        },
        vuex: {
          moduleName: 'i18n',
          mutations: {
            setLocale: 'I18N_SET_LOCALE',
            setMessages: false
          }
        },
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected'
        }
      }
    ]
  ],
  gtm: {
    id: process.env.GTM_ID
  },
  fontawesome: {
    component: 'fa',
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['far']
      }
    ]
  },
  proxy: {},
  axios: {
    baseURL: 'http://nginx:9010/',
    browserBaseURL: '/',
    credentials: true,
    retry: false
  },
  router: {
    base: '/'
  },
  loading: '~/components/DhaLoader.vue',
  render: {
    resourceHints: false
  },
  buildModules: ['@nuxtjs/google-analytics'],
  googleAnalytics: {
    id: process.env.GA_TRACKING_ID,
    disabled: true,
    set: [{ field: 'anonymizeIp', value: true }]
  },
  build: {
    babel: {
      presets ({ isServer }) {
        const targets = isServer ? { node: '10' } : { ie: '11' }
        return [[require.resolve('@nuxt/babel-preset-app'), { targets }]]
      }
    },
    extractCSS: true,
    optimization: {},
    transpile: ['redux', 'redux-async-thunk'],
    extend (config, { isDev }) {
      config.plugins.forEach(function (plugin) {
        if (
          plugin.constructor &&
          plugin.constructor.name === 'ExtractCssChunksPlugin'
        ) {
          plugin.options.ignoreOrder = true
        }
      })
      config.module.rules.push({
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /(node_modules)/
      })
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.resolve.alias.leaflet = path.join(
        __dirname,
        'node_modules/leaflet'
      )
      // config.plugins.push(new bundlebuddy());
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  config.axios = {
    proxy: true,
    credentials: true
  }
  config.proxy = {
    '/api/': { target: 'http://localhost/', secure: false },
    '/media/': { target: 'http://localhost/', secure: false },
    '/static/': { target: 'http://localhost/', secure: false },
    '/translation/': { target: 'http://localhost/', secure: false }
  }
}
module.exports = config
