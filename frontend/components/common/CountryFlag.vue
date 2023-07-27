<template>
  <img
    :class="['CountryFlag', {small, isGlobal}]"
    :src="countryFlagUrl"
  >
</template>

<script>
export default {
  props: {
    code: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    countryFlagUrl () {
      if (this.isGlobal) {
        return '/who-logo-small.svg'
      }
      if (this.code) {
        return `/static/flags/${this.code.toLowerCase()}.png`
      }
      return ''
    },
    isGlobal () {
      return this.code === '00'
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryFlag {
    &.small {
      height: 16px;
      width: 24px;
    }
    &.isGlobal {
      box-shadow: none !important;
      height: 20px !important;
      width: 24px !important;
      margin-top: -4px;
    }
  }
</style>
