<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  components: {
  },
  middleware: ['isLoggedIn'],
  async fetch ({ store }) {
    store.dispatch('landing/resetSearch');
  }
};
</script>

<style lang="less">
</style>
