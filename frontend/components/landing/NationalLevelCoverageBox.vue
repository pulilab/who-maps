<template>

  <div class="NationalLevelCoverageBox">
    <div class="wrapper">
      <el-row>
        <el-col :span="12">
          <national-level-coverage-element :id="country" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NationalLevelCoverageElement from './NationalLevelCoverageElement';
export default {
  components: {
    NationalLevelCoverageElement
  },
  computed: {
    ...mapGetters({
      country: 'landing/getSelectedCountry'
    })
  }
};
</script>

<style lang="less">
  .NationalLevelCoverageBox {
    z-index: 1010;
    position:relative;

    .wrapper {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>
