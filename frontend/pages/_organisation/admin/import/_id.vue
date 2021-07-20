<template>
  <page-layout>
    <template #title>
      <translate>Import interface</translate>
    </template>
    <panel>
      <template #header>
        <nuxt-link
          :to="localePath({name: 'organisation-admin-import', params: $route.params})"
          class="back-button"
          tag="div"
        >
          <i class="el-icon-back" />
        </nuxt-link>
        <translate>Edit imported data</translate>
      </template>

      <import-info :info="importInfo" />
      <import-data-table />
    </panel>
  </page-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import ImportInfo from '@/components/admin/import/ImportInfo'
import ImportDataTable from '@/components/admin/import/ImportDataTable'

export default {
  name: 'ImportDetail',
  components: {
    PageLayout,
    Panel,
    ImportInfo,
    ImportDataTable
  },
  async asyncData ({ params, store }) {
    const data = await store.dispatch('admin/import/loadImport', params.id)
    return {
      rawImport: data
    }
  },
  data () {
    return {
      showSaved: false
    }
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadUserProfiles'),
      store.dispatch('system/loadDonors'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('system/loadStaticData'),
      store.dispatch('system/loadOrganisations'),
      store.dispatch('countries/loadMapData')
    ])
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails',
      getDonorDetails: 'system/getDonorDetails',
      countries: 'countries/getCountries',
      donors: 'system/getDonors'
    }),
    importInfo () {
      return {
        sheetName: this.rawImport.sheet_name,
        fileName: this.rawImport.filename,
        country: this.rawImport.country ? this.countries.find((c) => c.id === this.rawImport.country).name : null,
        donor: this.rawImport.donor ? this.donors.find((d) => d.id === this.rawImport.donor).name : null,
        collectionName: this.rawImport.collection?.name,
        collectionUrl: this.rawImport.collection?.url
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.back-button {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 30px;
  padding: 0;
  font-size: 24px;
  color: white;
  &:hover {
    text-shadow: 0px 0px 6px white;
  }
}
</style>
