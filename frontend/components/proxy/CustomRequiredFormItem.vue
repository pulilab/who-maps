<template>
  <el-form-item
    class="CustomRequiredFormItem"
    v-bind="propsAndAttrs"
    v-on="listeners"
  >
    <template
      v-if="!!$slots.label"
      slot="label"
    >
      <span
        v-if="!!prependFormat"
        class="pre-number"
      >
        {{ prependFormat }}
      </span>
      <slot name="label" />
      <span class="spacer" />
      <span
        v-show="draftRequired"
        class="Required DraftRequired"
      >
        <span>
          *
        </span>
      </span>
      <span
        v-show="publishRequired"
        class="Required PublishRequired"
      >
        <span>
          *
        </span>
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
    },
    prependLabel: {
      type: String,
      default: ''
    }
  },
  computed: {
    propsAndAttrs () {
      return { ...this.$props, ...this.$attrs }
    },
    listeners () {
      return { ...this.$listeners }
    },
    draftRequired () {
      return this.draftRule && this.draftRule.required
    },
    publishRequired () {
      return this.publishRule && this.publishRule.required
    },
    prependFormat () {
      return this.prependLabel ? `${this.prependLabel}. ` : ''
    }
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';
.CustomRequiredFormItem {
  .pre-number {
    border-left: 5px solid @colorGrayLight;
    padding: 2px 15px 2px 10px;
  }
  .spacer {
    margin-left: 8px;
  }
  .Required {
    display: inline-block;
    width: 15px;
    height: 15px;
    font-size: 22px;
    line-height: 12px;
    font-weight: 900;
    text-align: center;
    color: #ffffff;
    border-radius: 50%;

    > span {
      position: relative;
      top: 6px;
    }
  }
  .DraftRequired {
    background-color: @colorDraft;
  }
  .PublishRequired {
    background-color: @colorPublished;
  }
}
</style>
