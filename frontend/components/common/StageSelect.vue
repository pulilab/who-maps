<template>
  <lazy-el-select
    v-model="innerValue"
    :multiple="multiple"
    :disabled="disabled"
    :placeholder="$gettext('Select stage') | translate"
    filterable
    clearable
  >
    <el-option
      v-for="stage in stages"
      :key="stage.id"
      :label="stage.name"
      :value="stage.id"
    />
  </lazy-el-select>
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
      type: [Number, Array, String],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      stages: 'project/getStagesList'
    }),
    innerValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  }
};
</script>
