<template>
  <div class="DialogsContainer">
    <digital-health-interventions-dialog />
  </div>
</template>

<script>
import DigitalHealthInterventionsDialog from './DigitalHealthInterventionsDialog';

export default {
  components: {
    DigitalHealthInterventionsDialog
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .DialogsContainer {}
</style>
