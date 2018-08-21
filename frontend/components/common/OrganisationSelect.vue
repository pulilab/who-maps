<template>
  <el-select
    :value="org"
    :allow-create="true"
    filterable
    reserve-keyword
    class="Organisationelector"
    popper-class="OrganisationelectorDropdown"
    placeholder="Type and select a name"
    @change="changeHandler"
  >
    <el-option
      v-for="organisation in organisations"
      :key="organisation.id"
      :label="organisation.name"
      :value="organisation.id"
    />
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
import OrganisationItem from '../common/OrganisationItem';

export default {
  components: {
    OrganisationItem
  },
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
      organisations: 'system/getOrganisations'
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
.Organisationelector {
  width: 100%;
}
.OrganisationelectorDropdown {
   .OrganisationItem {
    display: inline;
  }
}
</style>
