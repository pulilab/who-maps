<template>
  <el-col v-bind="{ ...$props, ...$attrs }">
    <div class="wrapper">
      <div class="container">
        <template v-if="$slots.back">
          <slot name="back" />
        </template>
        <p v-if="$slots.default" class="title">
          <slot />
        </p>
        <slot name="subtitle" />
        <template v-if="horizontal">
          <el-row class="mt-15">
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
          <div v-if="$slots.graph" class="graph">
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
      default: false
    },
    back: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: white;
  height: 100%;
  .container {
    position: relative;
    padding-top: 30px;
    display: grid;
    ::v-deep .el-button--text {
      color: #404041;
      position: absolute;
      z-index: 10;
      top: 30px;
      left: 40px;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 18px;
      font-weight: 100;
      padding: 3px 0;
    }
    .title {
      position: relative;
      color: #1cabe2;
      font-size: 18px;
      letter-spacing: -0.5px;
      line-height: 23px;
      text-align: center;
      margin: 0 25px 0px;
    }
    .graph {
      margin: 25px 50px 15px 40px;
    }
    .graph-horizontal {
      margin: 0px 50px 50px 80px;
    }
    .mt-15 {
      margin-top: 15px;
    }
  }
}
</style>
