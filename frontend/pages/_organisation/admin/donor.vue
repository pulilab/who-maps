<template>
  <donor-admin />
</template>

<script>
import DonorAdmin from '../../../components/admin/DonorAdmin';

export default {
  name: 'Donor',

  components: {
    DonorAdmin
  },
  async fetch ({store}) {
    await store.dispatch('system/loadUserProfiles');
    await store.dispatch('admin/donor/fetchData');
  }
};
</script>
