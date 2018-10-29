<template>
  <div class="">
    <dha-verify />
  </div>
</template>

<script>
import DhaVerify from '../../../../components/DhaVerify';

export default {

  async fetch ({ params, store }) {
    await store.dispatch('user/verifyEmail', params.key);
  },

  components: { DhaVerify }
};
</script>

<style lang="less">
</style>
