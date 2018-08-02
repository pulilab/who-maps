<template>
  <div class="NationalLevelCoverageElement">
    <el-row type="flex">
      <el-col
        :span="4"
        type="flex"
        justify="center"
        align="middle">
        <country-flag
          :code="country.code"
          small
        />
      </el-col>
      <el-col :span="16">
        +3 National Project
      </el-col>
      <el-col :span="4">
        <el-button type="text">Show</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CountryFlag from '../common/CountryFlag';

export default {
  components: {
    CountryFlag
  },
  props: {
    id: {
      type: Number,
      required: true
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
  .NationalLevelCoverageElement {
    box-sizing: border-box;
    height: 39px;
    width: 221px;
    border: 3px solid #F4B20D;
    border-radius: 2px;
    background-color: rgba(251,192,45,0.7);
    box-shadow: 0 0 0 2px #FFFFFF, 0 0 5px 0 rgba(0,0,0,0.12), 0 5px 5px 0 rgba(0,0,0,0.24);
  }
</style>
