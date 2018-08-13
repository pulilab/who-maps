<template>

  <div class="CountrySwitchViewBox">
    <switch-view-box :active-tab.sync="activeTab" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SwitchViewBox from '../common/SwitchViewBox';

export default {
  components: {
    SwitchViewBox
  },
  computed: {
    ...mapGetters({
      getActiveTab: 'landing/getProjectBoxActiveTab'
    }),
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
      setActiveTab: 'landing/setProjectBoxActiveTab'
    })
  }
};
</script>

<style lang="less">
  .SwitchViewBox {
    z-index: 1010;
    position:relative;

    .wrapper {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>
