<template>
  <lazy-el-select
    :value="showFiltered"
    :placeholder="$gettext('Type and select a name') | translate"
    :disabled="disabled"
    multiple
    filterable
    reserve-keyword
    class="DonorSelector"
    popper-class="DonorSelectorDropdown"
    @change="changeHandler"
  >
    <el-option
      v-for="donor in filtered"
      :key="donor.id"
      :label="donor.name"
      :value="donor.id"
    />
  </lazy-el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  $_veeValidate: {
    value () {
      return this.value
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      donors: 'system/getDonors',
      shadows: 'project/getAllShadowDonors'
    }),
    filtered () {
      return this.donors.filter((item) => !this.shadows.includes(item.id))
    },
    showFiltered () {
      return this.value.filter((elm) => !this.shadows.includes(elm))
    }
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

  .DonorSelector {
    width: 100%;
  }

  .DonorSelectorDropdown {
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
