<template>
  <el-form-item
    :error="errors.first('name')"
    :label="question"
    class="CustomField"
  >
    <el-input
      v-validate="localRules"
      v-if="type < 3"
      v-model="value"
      :data-as-name="question"
      data-vv-name="name"/>

    <el-radio-group
      v-if="type === 3"
      v-model="value"
    >
      <el-radio label="yes"><translate>Yes</translate></el-radio>
      <el-radio label="no"><translate>No</translate></el-radio>
    </el-radio-group>

    <template v-if="type > 3 && options">
      <el-select
        v-model="value"
        :placeholder="$gettext('Select from list')"
        :multiple="type === 5"
        filterable
        popper-class="CustomFieldSelectorDropdown"
        class="CustomFieldSelector"
      >
        <el-option
          v-for="opt in options"
          :key="opt"
          :value="opt"
        />
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      default: () => []
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: ''
    };
  },
  computed: {
    localRules () {
      return {
        required: this.isRequired,
        numeric: this.type === 2
      };
    }
  }
};
</script>

<style lang="less">
.CustomField {
  width: 100%;

  .CustomFieldSelector {
    width: 100%;
  }
}

</style>
