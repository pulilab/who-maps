<template>
  <PageLayout>
    <template #title>
      {{ collectionName }}
    </template>
    <template #subtitle>
      Browse and search this collection to find projects you are associated with, and assign yourself as editor to be able to contribute it as your own.
      <a href="">Watch demo here</a>
    </template>
    <Panel v-loading="loading" :element-loading-text="$gettext('Loading project list...')" class="collection-wrapper">
      <el-alert v-if="!user" type="error" class="alert">
        <translate>You are currently not logged in. If you wish to contribute, you need an active account. Please Signup or login before you use "Add me as editor" action. </translate>
      </el-alert>
      <template v-if="!loading">
        <CollectionInfo :info="collection" />
        <CollectionProjects :collection="collection" />
      </template>
    </Panel>
  </PageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import CollectionInfo from '@/components/project/collection/CollectionInfo'
import CollectionProjects from '@/components/project/collection/CollectionProjects'

export default {
  components: {
    PageLayout,
    Panel,
    CollectionInfo,
    CollectionProjects
  },
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    await this.$store.dispatch('admin/import/loadCollection', this.$route.params.id)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      collection: 'admin/import/getCollection',
      user: 'user/getProfile'
    }),
    collectionName() {
      return this.collection?.name
    }
  }
}
</script>

<style lang="less" scoped>

.collection-wrapper {
  position: relative;
  min-height: 480px;
  .placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
}

.alert {
  margin: 10px 0 40px 0;
  ::v-deep &.el-alert {
    height: 42px;
    line-height: 42px;
    padding: 0 16px;

    .el-alert__description {
      margin: 0;
      font-size: 14px;
    }

    .el-alert__closebtn {
      top: 13px;
      font-size: 20px;
    }

  }
}

</style>
