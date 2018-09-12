<template>
  <el-select
    :value="org"
    :allow-create="true"
    :placeholder="$gettext('Type and select a name')"
    :remote-method="filterList"
    filterable
    remote
    reserve-keyword
    class="OrganisationSelector"
    popper-class="OrganisationSelectorDropdown"
    @change="changeHandler"
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
    org () {
      if (isNaN(this.value)) {
        return this.value;
      }
      return this.value ? +this.value : null;
    }
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
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
