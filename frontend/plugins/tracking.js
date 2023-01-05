import Vue from 'vue'

function track () {
  this.$ga.enable()
}

Vue.use({
  install (vue) {
    vue.mixin({
      methods: { $track: track }
    })
  }
})

export default ({ app }) => {
  if (!process.server && localStorage.getItem('cookie:accepted') === 'true') {
    track.call(app)
  }
}
