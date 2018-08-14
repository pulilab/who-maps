<template>
  <el-row
    v-if="country"
    type="flex"
    class="CountryItem"
  >
    <el-col class="CountryFlag">
      <country-flag
        v-show="showFlag"
        :code="country.code" />
    </el-col>
    <el-col class="CountryName">
      {{ country.name }}
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
      required: true
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
      return this.getCountryDetails(this.id);
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
      }
    }

    .CountryName {
      width: 100%;
      margin-left: 10px;
      font-size: @fontSizeMedium;
      font-weight: 700;
      line-height: 16px;
      color: @colorTextPrimary;
    }
  }
</style>
