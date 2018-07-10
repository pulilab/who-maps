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
    '~/assets/style/main.sass'
  ],
  env: {
  },
  plugins: [
    { src: '~plugins/axios.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: true },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/vue-django-feedback.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {},
  axios: {
    baseURL: 'http://django:8000/',
    browserBaseURL: '/',
    credentials: true,
    retry: false
  },
  mq: {
    breakpoints: {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: Infinity
    }
  },
  router: {
    middleware: ['auth']
  },
  loading: { color: '#3B8070' },
  build: {
    extractCSS: true,
    extend (config, { isDev, isClient }) {
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
    '/api/': { target: 'https://localhost/', secure: false }
  };
}
module.exports = config;
