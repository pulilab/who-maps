<template>
  <el-select
    :value="value"
    multiple
    filterable
    popper-class="HealthSystemChallengesSelectorDropdown"
    class="HealthSystemChallengesSelector"
    placeholder="Select from list"
    @change="changeHandler">
    <el-option-group
      v-for="group in healthSystemChallenges"
      :key="group.id"
      :label="group.name">
      <el-option
        v-for="hsc in group.challenges"
        :key="hsc.id"
        :label="hsc.challenge"
        :value="hsc.id"/>
    </el-option-group>\
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
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
      healthSystemChallenges: 'projects/getHscChallenges'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style lang="less">
.HealthSystemChallengesSelector {
  width: 100%;
}
.HealthSystemChallengesSelectorDropdown {

}
</style>
