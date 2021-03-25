<template>
  <div class="CharacterCountInput">
    <el-input
      :value="value"
      :rules="rules"
      v-bind="$attrs"
      @input="setValue($event)"
    />
    <span
      v-if="max"
      :class="['Count', {'Error': error }]"
    >
      {{ count }} / {{ max }}
    </span>
  </div>
</template>

<script>
import get from 'lodash/get'
import debounce from 'lodash/debounce'

export default {
  name: 'CharacterCountInputStandalone',
  props: {
    namespace: {
      type: String,
      required: true
    },
    get: {
      type: String,
      required: true
    },
    set: {
      type: String,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      value: this.$store.getters[`${this.namespace}/${this.get}`]
    }
  },
  computed: {
    count () {
      if (this.value) {
        return this.value.length
      }
      return 0
    },
    max () {
      return get(this, 'rules.max', null)
    },
    error () {
      return this.count && this.max && this.count > this.max
    }
  },
  methods: {
    setValue (val) {
      this.value = val
      this.setStore(val)
    },
    setStore: debounce(function (val) {
      this.$store.dispatch(`${this.namespace}/${this.set}`, val)
    }, 100)
  }
}
</script>

<style lang="less">
  .CharacterCountInput {
    .Count {
      height: 15px;
      line-height: 15px;
      position: absolute;
      top: -15px;
      right: 0;
      font-size: 12px;
    }

    .Error {
      color: #F44336;
    }

    textarea.el-textarea__inner {
      padding-bottom: 15px;
    }
  }
</style>
