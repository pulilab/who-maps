<template>
  <div class="FilterItem">
    <div class="FilterItemHeader">
      <div class="Label">
        {{ label }}
      </div>
      <el-button type="text">
        <span v-show="!selected">
          All
        </span>
        <span v-show="selected">
          Filtered
        </span>
        <fa icon="pencil-alt" />
      </el-button>
    </div>
    <div class="Selected">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less">
.FilterItemHeader {
  display: flex;
}

</style>
