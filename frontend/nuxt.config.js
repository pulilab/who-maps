const result = require('dotenv').config();

if (result.error) {
  console.log('\x1b[31m%s\x1b[0m', 'Missing .env file, follow the README instructions');
  throw result.error;
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
      { rel: 'icon', type: 'image/pmg', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  css: [
    '~/assets/style/main.sass',
    '~/assets/style/main.less'
  ],
  env: {
  },
  plugins: [
    { src: '~plugins/axios.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: true },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/vue-django-feedback.js', ssr: false },
    { src: '~plugins/element.js', ssr: true },
    { src: '~plugins/i18n.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['nuxt-i18n', {
      locales: [
        {
          code: 'en',
          iso: 'en-GB',
          name: 'English'
        },
        {
          code: 'fr',
          iso: 'fr-FR',
          name: 'Français'
        },
        {
          code: 'es',
          iso: 'es-ES',
          name: 'Español'
        },
        {
          code: 'pt',
          iso: 'pt-PT',
          name: 'Português'
        }
      ],
      strategy: 'prefix',
      rootRedirect: 'en',
      defaultLocale: 'en',
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
    }]
  ],
  proxy: {},
  axios: {
    baseURL: 'http://nginx:9010/',
    browserBaseURL: '/',
    credentials: true,
    retry: false
  },
  router: {
    middleware: ['auth'],
    base: '/'
  },
  loading: { color: '#3B8070' },
  build: {
    extractCSS: true,
    extend (config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /(node_modules)/
      });
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  config.axios = {
    proxy: true,
    credentials: true
  };
  config.proxy = {
    '/api/': { target: 'https://localhost/', secure: false },
    '/media/': { target: 'http://localhost/', secure: false },
    '/static/': { target: 'http://localhost/', secure: false },
    '/translation/': { target: 'https://localhost/', secure: false }
  };
}
module.exports = config;
