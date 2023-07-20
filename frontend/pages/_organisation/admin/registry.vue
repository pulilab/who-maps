<template>
  <PolicyRegistryAdmin />
</template>

<script>
import PolicyRegistryAdmin from '@/components/admin/PolicyRegistryAdmin'

export default {
  name: 'Registry',
  components: {
    PolicyRegistryAdmin
  },
  async fetch ({ store }) {
    await store.dispatch('system/loadUserProfiles'),
    await store.dispatch('system/loadCountries')
    await store.dispatch('admin/country/fetchData', false)
  }
}
</script>
