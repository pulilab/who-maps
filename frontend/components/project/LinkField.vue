<template>
  <div class="LinkField">
    <el-input
      :value="value"
      type="text"
      placeholder="http://"
      @change="changeHandler"/>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: null
    }
  },
  $_veeValidate: {
    value () {
      return this.value;
    },
    events: 'input|blur|change'
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style>

</style>
