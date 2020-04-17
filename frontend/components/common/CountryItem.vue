<template>
  <el-row
    v-if="country"
    type="flex"
    class="CountryItem"
  >
    <el-col class="CountryFlag">
      <country-flag
        v-show="showFlag"
        :code="country.code"
      />
    </el-col>
    <el-col :class="`CountryName ${active ? 'Active': ''}`">
      <div @click="selectCountry(country)">
        {{ country.name }}
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CountryFlag from './CountryFlag';

export default {
  components: {
    CountryFlag
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    showFlag: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails'
    }),
    country () {
      if (this.id) {
        return this.getCountryDetails(this.id);
      }
      return null;
    }
  },
  methods: {
    ...mapActions({
      setProjectBoxActiveGlobalTab: 'landing/setProjectBoxActiveGlobalTab'
    }),
    selectCountry (country) {
      if (!this.active) {
        return;
      }
      if (country && country.id === process.env.GlobalCountryID) {
        country = null;
        this.setProjectBoxActiveGlobalTab(true);
      }
      const organisation = country ? country.code.toLowerCase() : '-';
      const localised = this.localePath({ name: 'organisation', params: { organisation } }, this.locale);
      this.$router.push(localised);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryItem {
    .CountryFlag {
      width: auto;

      img {
        width: 24px;
        height: 14px;
        box-shadow: 0 0 1px 1px @colorGrayLighter;
      }
    }

    .CountryName {
      width: 100%;
      margin-left: 10px;
      font-size: @fontSizeMedium;
      font-weight: 700;
      line-height: 16px;

      div {
        display: inline-block;
        white-space: nowrap;
      }
      &.Active {
        color: @colorBrandPrimary;
        div {
          cursor: pointer;
          &:hover {
            color: @colorBrandPrimaryLight;
          }
        }
      }
    }
  }
</style>
