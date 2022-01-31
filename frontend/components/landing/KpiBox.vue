<template>
  <div class="KpiWrapper">
    <el-row class="border-bottom bg-white header" type="flex">
      <translate tag="h2">Projects Statistics</translate>
      <CountrySelect v-model="country" clearable />
    </el-row>

    <el-row class="border-bottom bg-white">
      <DistributionOfProjectStages :span="18" :filters="filter" />
      <ProjectStatistics :span="6" :filters="filter" />      
    </el-row>
    <el-row class="border-bottom bg-white">
      <HealthFocusAreas :span="24" :filters="filter" />
    </el-row>
    <el-row class="border-bottom bg-white">
      <TopDataStandards :span="24" :filters="filter" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountrySelect from '@/components/common/CountrySelect'
import DistributionOfProjectStages from '@/components/charts/DistributionOfProjectStages'
import ProjectStatistics from '@/components/charts/ProjectStatistics'
import HealthFocusAreas from '@/components/charts/HealthFocusAreas'
import TopDataStandards from '@/components/charts/TopDataStandards'

export default {
  components: {
    CountrySelect,
    DistributionOfProjectStages,
    ProjectStatistics,
    HealthFocusAreas,
    TopDataStandards
  },
  data() {
    return {
      country: ''
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries'
    }),
    filter() {
      return {
        country: this.country ? `${this.country}` : undefined,
      } 
    },    
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/style/variables.less';

.KpiWrapper {
  padding: 0 40px 40px 40px;
  .header {
    align-items: center;
    justify-content: space-between;
    background-color: white;
    color: @colorBrandPrimary;
    padding: 36px;
    margin: 0;
    h2 {
      margin: 0;
    }
  }

  .border-bottom {
    border-bottom: 1px solid #dcdfe6;
  }

  .bg-white {
    background-color: white;
  }
}

</style>
