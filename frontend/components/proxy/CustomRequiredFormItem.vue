<template>
  <el-form-item
    class="CustomRequiredFormItem"
    v-bind="propsAndAttrs"
    v-on="listeners"
  >
    <template slot="label">
      <slot name="label" />
      <span
        v-show="draftRequired"
        class="Required DraftRequired"
      >
        *
      </span>
      <span
        v-show="publishRequired"
        class="Required PublishRequired"
      >
        *
      </span>
    </template>
    <slot />
  </el-form-item>
</template>

<script>
export default {
  name: 'CustomRequiredFormItem',
  props: {
    draftRule: {
      type: Object,
      default: null
    },
    publishRule: {
      type: Object,
      default: null
    }
  },
  computed: {
    propsAndAttrs () {
      return { ...this.$props, ...this.$attrs };
    },
    listeners () {
      return { ...this.$listeners };
    },
    draftRequired () {
      return this.draftRule && this.draftRule.required;
    },
    publishRequired () {
      return this.publishRule && this.publishRule.required;
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";
  .CustomRequiredFormItem{
    .Required{
      font-size: 16px;
      font-weight: 900
    }
    .DraftRequired{
      color: @colorDraft
    }
    .PublishRequired{
      color: @colorPublished
    }
  }
</style>
