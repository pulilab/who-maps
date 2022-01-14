<template>
  <div>
    <MonthlyUserActivity />
    <MonthlyGrowthOfProejctsDoughnut />
    <TopDataStandards />
    <MonthlyGrowthOfProjects />
    <DistributionOfProjectStages2 />
    <HealthFocusAreasClickable />

  </div>
</template>

<script>
import MonthlyUserActivity from '~/components/kpi/MonthlyUserActivity.vue'
import MonthlyGrowthOfProejctsDoughnut from '~/components/kpi/MonthlyGrowthOfProejctsDoughnut.vue'
import TopDataStandards from '~/components/kpi/TopDataStandards.vue'
import MonthlyGrowthOfProjects from '~/components/kpi/MonthlyGrowthOfProjects.vue'
import DistributionOfProjectStages2 from '~/components/kpi/DistributionOfProjectStages2.vue'
import HealthFocusAreasClickable from '~/components/kpi/HealthFocusAreasClickable.vue'

export default {
  components: {
    MonthlyUserActivity,
    MonthlyGrowthOfProejctsDoughnut,
    TopDataStandards,
    MonthlyGrowthOfProjects,
    DistributionOfProjectStages2,
    HealthFocusAreasClickable
  }
}
</script>

<style lang="less">
</style>