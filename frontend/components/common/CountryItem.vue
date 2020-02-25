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
    <el-col class="CountryName">
      <div @click="selectCountry(country)">
        {{ country.name }}
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
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
    selectCountry (country) {
      const organisation = country ? country.code.toLowerCase() : '-';
      const localised = this.localePath({ name: 'organisation', params: { organisation } });
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
      color: @colorBrandPrimary;

      div {
        display: inline-block;
        cursor: pointer;
        &:hover {
          color: @colorBrandPrimaryLight;
        }
      }
    }
  }
</style>
