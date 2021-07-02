<template>
  <div class="Alert" :class="type">
    <fa class="icon" :icon="icon" />
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<script>
const TYPE_CLASSES_MAP = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'times-circle',
  question: 'question-circle'
}

export default {
  props: {
    type: {
      type: String,
      default: 'info'
    }
  },
  computed: {
    icon () {
      return TYPE_CLASSES_MAP[this.type] || 'info-circle'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.Alert {
  display: flex;
  align-items: center;
  padding: 8px 12px;

  &.info {
    color: white;
    background-color: @colorBrandPrimary;
  }
  &.success {
    color: white;
    background-color: #76BF41;
  }
  &.error {
    color: white;
    background-color: @colorDanger;
  }
  &.warning {
    color: white;
    background-color: #FAA806;
  }
  &.question {
    color: white;
    background-color: @colorBrandPrimary;
  }

  .icon {
    color: currentColor;
    height: 16px;
    width: 16px;
  }
  .text {
    font-size: @fontSizeBase;
    margin-left: 8px;
  }
}

</style>
