<template>
  <div class="DialogsContainer">
    <digital-health-interventions-dialog />
    <dashboard-filters-dialog />
    <save-filter-dialog />
    <send-email-dialog />
    <project-approval-dialog />
  </div>
</template>

<script>
import DigitalHealthInterventionsDialog from './DigitalHealthInterventionsDialog';
import DashboardFiltersDialog from './DashboardFiltersDialog';
import SaveFilterDialog from './SaveFilterDialog';
import SendEmailDialog from './SendEmailDialog';
import ProjectApprovalDialog from './ProjectApprovalDialog';

export default {
  components: {
    DigitalHealthInterventionsDialog,
    DashboardFiltersDialog,
    SaveFilterDialog,
    SendEmailDialog,
    ProjectApprovalDialog
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .DialogsContainer {}
</style>
