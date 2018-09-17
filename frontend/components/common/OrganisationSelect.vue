<template>
  <el-select
    v-model="innerValue"
    :allow-create="true"
    :placeholder="$gettext('Type and select a name')"
    :remote-method="filterList"
    :default-first-option="true"
    filterable
    remote
    class="OrganisationSelector"
    popper-class="OrganisationSelectorDropdown"
  >
    <el-option
      v-for="organisation in optionsAndValues"
      :key="organisation.id"
      :label="organisation.name"
      :value="organisation.id"
    />
  </el-select>

</template>

<script>
import { mapGetters } from 'vuex';
import LightSelectMixin from '../mixins/LightSelectMixin.js';
import OrganisationItem from '../common/OrganisationItem';

export default {
  components: {
    OrganisationItem
  },
  mixins: [LightSelectMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    ...mapGetters({
      items: 'system/getOrganisations'
    }),
    innerValue: {
      get () {
        if (isNaN(this.value)) {
          return this.value;
        }
        return this.value ? +this.value : null;
      },
      set (value) {
        this.$emit('change', value);
      }
    }
  }
};
</script>

<style lang="less">
.OrganisationSelector {
  width: 100%;
}
.OrganisationSelectorDropdown {
   .OrganisationItem {
    display: inline;
  }
}
</style>
