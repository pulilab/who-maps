<template>
  <div class="graph">
    <c-stages v-if="stages" />
    <div v-else class="no-data">
      <i class="el-icon-warning" />
      <h3>
        <translate> No Data available </translate>
      </h3>
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
@import "~assets/style/variables.less";

.graph {
  margin: -50px 0 60px 0;
  .no-data {
    color: @colorTextMuted;
    display: flex;
    width: 100%;
    height: 500px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    i {
      font-size: 40px;
    }
  }
}
</style>
