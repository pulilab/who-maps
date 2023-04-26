<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list')"
    multiple
    filterable
    class="SoftwareBucketSelector"
    @change="changeHandler"
  >
    <el-option
      v-for="software in softwares"
      :key="software.id"
      :label="software.name"
      :value="software.id"
    />
  </lazy-el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      softwares: 'projects/getTechnologyPlatforms'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less">
.SoftwareBucketSelector {
  width: 100%;
}
</style>
