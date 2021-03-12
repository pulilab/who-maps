<template>
  <div class="graph">
    <c-stages v-if="stages" />
    <div v-else class="no-data">
      <translate> No Data available </translate>
    </div>
  </div>
</template>

<script>
import cStages from "@/components/common/charts/cStages";

export default {
  components: {
    cStages,
  },
  computed: {
    stages() {
      return this.$store.getters["project/getStages"];
    },
  },
};
</script>

<style lang="less">
.graph {
  margin: -50px 0 60px 0;
  .no-data {
    padding: 22px 74px 0px 40px;
  }
}
</style>
