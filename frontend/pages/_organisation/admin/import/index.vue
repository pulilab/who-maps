<template>
  <PageLayout>
    <template #title>
      <translate>Import interface</translate>
    </template>
    <el-row type="flex" :gutter="17">
      <el-col :span="14">
        <Panel v-if="queue && queue.length > 0" :wide-body="true" align-title="left">
          <template #header>
            <translate>Previous imports</translate>
          </template>
          <div class="mb-4">
            <ImportQueue :queue="queue" />
          </div>
        </Panel>
        <Panel v-else :empty="true" align-title="left">
          <template #header>
            <translate>Previous imports (0)</translate>
          </template>

          <p>
            <translate>No previous import(s) to show.</translate>
          </p>
          <p>
            <translate>To import new data / spreadsheet please use the form on the right aside.</translate>
          </p>
        </Panel>
      </el-col>
      <el-col :span="10">
        <Panel align-title="left">
          <template #header>
            <translate>New import</translate>
          </template>
          <ImportFile />
        </Panel>
      </el-col>
    </el-row>
  </PageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import ImportFile from '@/components/admin/import/ImportFile'
import ImportQueue from '@/components/admin/import/ImportQueue'

export default {
  nane: 'Import',
  components: {
    PageLayout,
    Panel,
    ImportFile,
    ImportQueue
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadDonors'),
      store.dispatch('system/loadUserCollections'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('admin/import/loadQueue'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('system/loadCountries'),
      store.dispatch('system/loadStaticData')
    ])
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      queue: 'admin/import/getQueue',
      getCountryDetails: 'countries/getCountryDetails',
      dhi: 'projects/getDigitalHealthInterventions'
    })
  },
  methods: {
    async select ({ id }) {
      this.$nuxt.$loading.start()
      await this.$nextTick()
      this.$router.push(
        this.localePath({
          name: 'organisation-admin-import-id',
          params: { ...this.$route.params, id: id },
          query: undefined
        })
      )
    }
  }
}
</script>

<style lang="less" scoped>
.empty-message {
  margin: 30px 40px;
}
</style>
