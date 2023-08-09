<template>
  <el-checkbox-group
    :value="value"
    class="ThreePerRow"
    @input="changeHandler"
  >
    <el-checkbox
      v-for="standard in standards"
      :key="standard.id"
      :label="standard.id"
    >
      {{ standard.name }}
    </el-checkbox>
    <tooltip :text="$gettext('Specify other digital health systems that ') | translate" />
  </el-checkbox-group>
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
      default: () => []
    }
  },
  data() {
    return {
      standardsGroups: [
        {
          name: this.$gettext('Health Data Exchange Standards'),
          standardIds: [1,4,5,6,17,8,9,11,13,18,15,16]
        },
        {
          name: this.$gettext('Security & Privacy Standards'),
          standardIds: [2,3,12]
        },
        {
          name: this.$gettext('Health Data Standardization'),
          standardIds: [28,21,27,30,22,31,26]
        },
        {
          name: this.$gettext('Technical Standards'),
          standardIds: [19,7,10,14,20,29]
        },
        {
          name: this.$gettext('Demographic Data Standardization'),
          standardIds: [24,25,23]
        },
      ],
      standardsTooltips: [
        {}
      ]
    }
  },
  computed: {
    ...mapGetters({
      standards: 'projects/getInteroperabilityStandards'
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
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

</style>
