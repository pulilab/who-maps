<template>
  <div class="ProfilePage">
    <edit-profile />
  </div>
</template>

<script>
import EditProfile from '../../components/EditProfile.vue';

export default {
  components: {
    EditProfile
  },
  async fetch ({ store }) {
    store.dispatch('user/fetchDonors');
  }
};
</script>

<style lang="less">
</style>
