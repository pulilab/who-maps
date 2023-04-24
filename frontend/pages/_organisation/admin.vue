<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  name: 'Admin',
  middleware: ['isLoggedIn'],
  async fetch ({ store }) {
    store.dispatch('landing/resetSearch')
  }
}
</script>
