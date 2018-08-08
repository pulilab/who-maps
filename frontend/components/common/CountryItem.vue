<template>
  <el-row
    type="flex"
    class="CountryItem"
  >
    <el-col class="Flag">
      <country-flag
        v-show="showFlag"
        :code="country.code"
        small />
    </el-col>
    <el-col class="Name">
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
    .Flag {
      width: auto;
    }
    .Name {
      padding: 0 50px 0 8px;
      font-size: @fontSizeBase;
      font-weight: 700;
      color: @colorTextPrimary;
    }
  }
</style>
