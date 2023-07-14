<template>
  <transition name="el-fade-in">
    <div
      v-show="cookieOn"
      class="CookieContainer"
    >
      <div class="CookieMessage">
        <div
          class="CloseConsent"
          @click="close"
        >
          <fa icon="times" />
        </div>
        <translate>
          We use cookies to offer you a better browsing experience, analyze site traffic and personalize content. Read about how we use cookies by clicking
        </translate>
        <nuxt-link :to="localePath({name: 'organisation-terms', params: $route.params})">
          <translate>Privacy Policy.</translate>
        </nuxt-link>
        <translate>
          If you continue to use this site, you consent to our use of cookies.
        </translate>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  computed: {
    cookieOn: {
      get () {
        return this.$store.state.user.cookieOn
      },
      set (val) {
        this.$store.commit('user/SET_COOKIE', val)
      }
    }
  },
  mounted () {
    if (!process.server) {
      this.cookieOn = window.localStorage.getItem('cookie:accepted') !== 'true'
    }
  },
  methods: {
    close () {
      this.cookieOn = false
    }
  }
}
</script>

<style lang="scss">
  .CookieContainer {
    position: fixed;
    width: 100%;
    max-width: 1680px;
    bottom: 0;
    z-index: 10000;
    .CookieMessage {
      line-height: 21px;
      font-size: 14px;
      color: #474747;
      padding: 10px 12px;
      margin: 12px;
      opacity: 0.9;
      background-color: #FFE5A3;
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.12);
    }
    .CloseConsent {
      float: right;
      cursor: pointer;
      margin-top: -10px;
      padding: 10px;
      margin-left: 50px;
    }
  }
</style>
