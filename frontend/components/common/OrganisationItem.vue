<template>
  <div
    v-if="organisation"
    class="OrganisationItem"
  >
    {{ organisation.name }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getOrganisationDetails: 'system/getOrganisationDetails'
    }),
    organisation () {
      if (this.id) {
        const id = parseInt(this.id, 10);
        return this.getOrganisationDetails(id);
      }
      return null;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

</style>
