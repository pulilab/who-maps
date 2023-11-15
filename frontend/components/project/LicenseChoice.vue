<template>
  <lazy-el-select
    v-model="innerValue"
    :placeholder="$gettext('Select option') | translate"
    clearable
  >
    <el-option
      v-for="choice in licenseChoices[choice]"
      :key="choice.id"
      :label="choice.name"
      :value="choice.id"
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
      type: [String,Number],
      default: ''
    },
    choice: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      licenseChoices: {
        normal: [
          {
            id: 1,
            name: this.$gettext('Yes'),
          },
          {
            id: 2,
            name: this.$gettext('Yes - With restrictions'),
          },
          {
            id: 3,
            name: this.$gettext('No'),
          },
        ],
        alternative: [
          {
            id: 1,
            name: this.$gettext('Yes'),
          },
          {
            id: 2,
            name: this.$gettext('Partially'),
          },
          {
            id: 3,
            name: this.$gettext('No'),
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      stages: 'project/getStagesList'
    }),
    innerValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>
