<template>
  <page-layout>
    <template #title>
      <translate>Edit my profile</translate>
    </template>
    <edit-profile />
  </page-layout>
</template>

<script>
import PageLayout from '@/components/common/wrappers/PageLayout'
import EditProfile from '../../components/EditProfile.vue'

export default {
  components: {
    PageLayout,
    EditProfile
  },
  async fetch ({ store, query, redirect }) {
    if (query && query.missingProfile) {
      store.dispatch('layout/setShowEmptyProfileWarning', true)
      redirect({ ...this.$route, query: undefined })
      return
    }
    await store.dispatch('system/loadDonors')
  },
  watchQuery: ['missingProfile']
}
</script>

<style lang="less">
</style>
