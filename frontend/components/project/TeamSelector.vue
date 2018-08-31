<template>
  <el-select
    :value="value"
    multiple
    filterable
    reserve-keyword
    class="TeamSelector"
    popper-class="TeamSelectorDropdown"
    placeholder="Type and select a name"
    @change="changeHandler"
  >
    <el-option
      v-for="person in profiles"
      :key="person.id"
      :label="person.name"
      :value="person.id"
    >
      <span>{{ person.name }}</span>
      <template v-if="person.organisation">
        <organisation-item :id="person.organisation" />
      </template>
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
import OrganisationItem from '../common/OrganisationItem';

export default {
  components: {
    OrganisationItem
  },
  $_veeValidate: {
    value () {
      return this.value;
    },
    events: 'change|blur'
  },
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
      profiles: 'system/getUserProfiles'
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
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TeamSelector {
    width: 100%;
  }

  .TeamSelectorDropdown {
     .OrganisationItem {
      display: inline-block;
      margin-left: 6px;
      font-weight: 400;
      color: @colorGray;

      &::before {
        content: "(";
      }

      &::after {
        content: ")";
      }
    }
  }
</style>
