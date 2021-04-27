<template>
  <api-admin />
</template>

<script>
import ApiAdmin from '../../../components/admin/ApiAdmin'
export default {

  components: { ApiAdmin },

  /*async fetch ({ store }) {
    await store.dispatch('system/loadUserProfiles')
  }*/
}
</script>
