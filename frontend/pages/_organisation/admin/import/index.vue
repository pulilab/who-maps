<template>
  <page-layout>
    <template #title>
      <translate>Import interface</translate>
    </template>
    <el-row type="flex" :gutter="17">
      <el-col :span="13">
        <panel v-if="queue && queue.length > 0">
          <template #header>
            <translate>Previous imports</translate>
          </template>
          <import-details
            v-for="(item, index) in queue"
            :key="index"
            :item="item"
            type="flex"
          >
            <el-button @click="select(item)">
              <translate>
                Select
              </translate>
            </el-button>
          </import-details>
        </panel>
        <panel v-else :empty="true">
          <template #header>
            <translate>Previous imports (0)</translate>
          </template>

          <p>
            <translate>No previous import(s) to show.</translate>
          </p>
          <p>
            <translate>To import new data / spreadsheet please use the form on the right aside.</translate>
          </p>
        </panel>
      </el-col>
      <el-col :span="11">
        <panel>
          <template #header>
            <translate>New import</translate>
          </template>
          <import-file />
        </panel>
      </el-col>
    </el-row>
  </page-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import ImportFile from '@/components/admin/import/ImportFile'
import ImportDetails from '@/components/admin/import/ImportDetails'

export default {
  components: {
    PageLayout,
    Panel,
    ImportFile,
    ImportDetails
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadDonors'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('admin/import/loadQueue'),
      store.dispatch('projects/loadProjectStructure'),
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
.ImportList {
  .box-card {
    margin: 12px;
  }
}

.empty-message {
  margin: 30px 40px;
}
</style>
