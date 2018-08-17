<template>
  <div class="DigitalHealthInterventionsList">
    <ul class="SelectedDigitalHealthInterventions">
      <li
        v-for="item in selected"
        :key="item.id">
        <digital-health-intervention-item :id="item.id" />
      </li>
    </ul>
  </div>
</template>

<script>
import DigitalHealthInterventionItem from '../common/DigitalHealthInterventionItem';

export default {
  components: {
    DigitalHealthInterventionItem
  },
  props: {
    platform: {
      type: Number,
      default: null
    },
    dhi: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selected () {
      return this.dhi.filter(dhi => dhi.platform === this.platform);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

</style>
