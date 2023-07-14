<template>
  <CountryAdmin />
</template>

<script>
import CountryAdmin from '@/components/admin/CountryAdmin'

export default {
  name: 'Country',
  components: {
    CountryAdmin
  },
  async fetch ({ store }) {
    await store.dispatch('system/loadUserProfiles')
    store.dispatch('admin/questions/setQuestionnaireType', 'country')
    await store.dispatch('admin/country/fetchData')
    await store.dispatch('admin/map/loadGeoJSON')
  }
}
</script>
