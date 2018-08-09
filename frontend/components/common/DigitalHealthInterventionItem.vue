<template>
  <div
    v-if="dhi"
    class="DhiItem">
    {{ dhi.name }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getDigitalHealthInterventionDetails: 'projects/getDigitalHealthInterventionDetails'
    }),
    dhi () {
      return this.getDigitalHealthInterventionDetails(this.id);
    }
  }
};
</script>

<style>

</style>
