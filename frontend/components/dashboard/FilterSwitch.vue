<template>
  <div class="FilterSwitchs">

    <el-switch
      :value="value"
      @change="switchChangeHandler"
    />
    {{ label }}
    <el-tooltip
      v-model="showTooltip"
      :content="tooltip"
      effect="dark"
      placement="top"
      manual
    >
      <el-button
        type="text"
        @click="showTooltip = !showTooltip"
      >
        <fa icon="question-circle" />
      </el-button>
    </el-tooltip>
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
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showTooltip: false
    };
  },
  methods: {
    switchChangeHandler (value) {
      console.log(value);
      this.$emit('change', value);
    }
  }
};
</script>

<style>

</style>
