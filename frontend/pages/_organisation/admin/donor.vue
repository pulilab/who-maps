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
    await Promise.all([
      store.dispatch('system/loadUserProfiles'),
      store.dispatch('admin/donor/fetchData'),
      store.dispatch('user/fetchDonors')
    ]);
  }
};
</script>
