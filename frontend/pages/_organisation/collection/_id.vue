<template>
  <div class="">
    <Collection />
  </div>
</template>

<script>
import Collection from '@/components/project/collection/Collection'

export default {
  components: {
    Collection
  },
  async asyncData ({ params, store }) {
    await store.dispatch('admin/import/loadCollection', params.id)
  }
}
</script>