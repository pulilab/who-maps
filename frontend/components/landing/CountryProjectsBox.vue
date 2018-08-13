<template>
  <div class="CountryProjectxBox">
    <map-projects-box
      :active-country.sync="activeCountry"
      :active-tab.sync="activeTab"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import MapProjectsBox from '../common/MapProjectsBox';

export default {
  components: {
    MapProjectsBox
  },
  props: {
  },
  computed: {
    ...mapGetters({
      getActiveCountry: 'landing/getActiveCountry',
      getActiveTab: `landing/getProjectBoxActiveTab`
    }),
    activeCountry: {
      get () {
        return this.getActiveCountry;
      },
      set (value) {
        this.setActiveCountry(value);
      }
    },
    activeTab: {
      get () {
        return this.getActiveTab;
      },
      set (value) {
        this.setActiveTab(value);
      }
    }
  },
  methods: {
    ...mapActions({
      setActiveCountry: 'landing/setActiveCountry',
      setActiveTab: 'landing/setProjectBoxActiveTab'
    })
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryProjectsBox {
  }

</style>
