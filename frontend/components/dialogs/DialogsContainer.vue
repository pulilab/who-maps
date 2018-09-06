<template>
  <div class="DialogsContainer">
    <digital-health-interventions-dialog />
    <dashboard-filters-dialog />
    <save-filter-dialog />
  </div>
</template>

<script>
import DigitalHealthInterventionsDialog from './DigitalHealthInterventionsDialog';
import DashboardFiltersDialog from './DashboardFiltersDialog';
import SaveFilterDialog from './SaveFilterDialog';

export default {
  components: {
    DigitalHealthInterventionsDialog,
    DashboardFiltersDialog,
    SaveFilterDialog
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .DialogsContainer {}
</style>
