<template>
  <span class="TooltipContainer">
    <el-tooltip
      v-model="showTooltip"
      :content="text"
      :placement="placement"
      effect="dark"
      popper-class="TooltipElement"
      manual
    >
      <el-button
        type="text"
        class="MutedButton"
        @click="showTooltip = !showTooltip"
      >
        <fa icon="question-circle" />
      </el-button>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      showTooltip: false
    };
  }
};
</script>

<style lang="less">

  .TooltipContainer {
    width: auto;
    /*padding-left: 10px;*/

    .el-button {
      padding: 0;
    }
  }
  .TooltipElement {
    max-width: 257px;
  }

</style>
