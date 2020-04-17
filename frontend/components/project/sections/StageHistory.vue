<template>
  <div
    id="stages"
    class="graph"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Completion of Project stages') | translate"
    >
      <c-stages />
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from '../CollapsibleCard';
import cStages from '@/components/common/chart/cStages';

export default {
  components: {
    CollapsibleCard,
    cStages
  }
};
</script>

<style lang="less" >
  .graph {
    // outside modifiers
    .CollapsibleCard .ContentContainer{
      padding: 0;
    }
  }
</style>
