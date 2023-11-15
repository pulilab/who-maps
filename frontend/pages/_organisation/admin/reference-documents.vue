<template>
  <ReferenceDocumentAdmin />
</template>

<script>
import ReferenceDocumentAdmin from '@/components/admin/ReferenceDocumentAdmin'

export default {
  components: {
    ReferenceDocumentAdmin
  },
  async fetch ({ store }) {
    await store.dispatch('system/loadUserProfiles'),
    await store.dispatch('system/loadCountries'),
    await store.dispatch('projects/loadProjectStructure'),
    await store.dispatch('admin/country/fetchData', false)
  }
}
</script>
