<template>
  <img
    :class="['CountryFlag', {small}]"
    :src="countryFlagUrl">
</template>

<script>
export default {
  props: {
    code: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    countryFlagUrl () {
      if (this.code) {
        return `/static/flags/${this.code.toLowerCase()}.png`;
      }
    }
  }
};
</script>

<style lang="less">
  .CountryFlag {
    &.small {
      height: 16px;
      width: 24px;
    }
  }
</style>
