<template>
  <div class="bar">
    <div :class="`progress phase-${phase}`">
      <span><translate>Phase</translate> {{ phase }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    phase: {
      type: Number,
      required: false,
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../assets/style/variables.less";

//  @colorBrandPrimary;
  .bar {
    width: 100%;
    height: 16px;
    background-color: #ECEFF1;
    border-radius: 25px;
    overflow: hidden;
    margin: 5px 0 10px;
    .progress {
      height: 16px;
      border-radius: 25px;
      background-color: #008DC9;
      > span {
        color: white;
        font-size: 11px;
        font-weight: 700;
        display: block;
        text-align: right;
        padding-right: 8px;
        padding-top: 1px;
      }
    }
    .phase-1 {
      width: 20%;
      opacity: 0.4;
    }
    .phase-2 {
      width: 40%;
      opacity: 0.55;
    }
    .phase-3 {
      width: 60%;
      opacity: 0.7;
    }
    .phase-4 {
      width: 80%;
      opacity: 0.8;
    }
    .phase-5 {
      width: 100%;
      opacity: 1;
    }
  }

</style>
