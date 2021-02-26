<template>
  <el-col v-bind="{ ...$props, ...$attrs }">
    <div class="wrapper">
      <div class="container">
        <p v-if="this.$slots.default" class="title"><slot /></p>
        <template v-if="horizontal">
          <el-row>
            <el-col :span="13">
              <div class="graph-horizontal">
                <slot name="graph" />
              </div>
            </el-col>
            <el-col :span="10">
              <slot name="legend" />
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <div class="graph">
            <slot name="graph" />
          </div>
          <slot name="legend" />
        </template>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: white;
  height: 100%;
  .container {
    padding-top: 30px;
    display: grid;
    .title {
      color: #1cabe2;
      font-size: 18px;
      letter-spacing: -0.5px;
      line-height: 23px;
      margin: 9px 0 11px 0;
      text-align: center;
      margin: 0 25px 40px;
    }
    .graph {
      margin: 0 50px 15px 40px;
    }
    .graph-horizontal {
      margin: 0 50px 50px 80px;
    }
  }
}
</style>
