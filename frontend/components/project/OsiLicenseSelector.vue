<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list') | translate"
    multiple
    filterable
    popper-class="hsc-popper"
    class="HealthSystemChallengesSelector"
    @change="changeHandler"
  >
    <el-option
      v-for="license in osiLicenses"
      :key="license.id"
      :value="license.id"
      :label="license.name"
      class="hsc-item"
    >
      <span>{{ license.name }}</span>
    </el-option>
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
      osiLicenses: 'projects/getOsiLicenses'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    },
  }
}
</script>
