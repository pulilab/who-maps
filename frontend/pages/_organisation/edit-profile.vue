<template>
  <page-layout>
    <template #title>
      <translate>Edit my profile</translate>
    </template>
    <ProfileEditor />
  </page-layout>
</template>

<script>
import PageLayout from '@/components/common/wrappers/PageLayout'
import ProfileEditor from '../../components/ProfileEditor.vue'

export default {
  name: 'edit-profile',
  middleware: ['authGuard'],
  components: {
    PageLayout,
    ProfileEditor
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
