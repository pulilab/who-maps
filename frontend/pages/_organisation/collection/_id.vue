<template>
  <div class="">
    <collection />
  </div>
</template>

<script>
import Collection from '@/components/project/collection/Collection'

export default {
  components: {
    Collection
  },
  async asyncData ({ params, store }) {
    console.log('loading collection')
    await store.dispatch('admin/import/loadCollection', params.id)
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

</style>
