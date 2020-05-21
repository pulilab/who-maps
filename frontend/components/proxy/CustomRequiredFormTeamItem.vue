<template>
  <el-form-item
    class="CustomRequiredFormItem"
    v-bind="propsAndAttrs"
    v-on="listeners"
  >
    <template slot="label">
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
  name: 'CustomRequiredFormTeamItem',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    draftRule: {
      type: Object,
      default: null
    },
    publishRule: {
      type: Object,
      default: null
    },
    value: {
      type: Array,
      default: null
    },
    prependLabel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputValue: ''
    };
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
    },
    prependFormat () {
      return this.prependLabel ? `${this.prependLabel}. ` : '';
    }
  },
  methods: {
  }
};
</script>
