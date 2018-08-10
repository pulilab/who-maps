<template>
  <div class="OrganisationItem">
    {{ organisation.name }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getOrganisationDetails: 'system/getOrganisationDetails'
    }),
    organisation () {
      const id = parseInt(this.id, 10);
      return this.getOrganisationDetails(id);
    }
  }
};
</script>

<style>

</style>
