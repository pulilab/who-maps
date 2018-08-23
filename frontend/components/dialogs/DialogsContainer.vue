<template>
  <div class="DialogsContainer">
    <digital-health-interventions-dialog />
    <dashboard-filters-dialog />
  </div>
</template>

<script>
import DigitalHealthInterventionsDialog from './DigitalHealthInterventionsDialog';
import DashboardFiltersDialog from './DashboardFiltersDialog';

export default {
  components: {
    DigitalHealthInterventionsDialog,
    DashboardFiltersDialog
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .DialogsContainer {}
</style>
