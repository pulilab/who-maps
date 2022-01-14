<template>
  <div>
    <BarChart />
    <DoughnutChart />
    <HorizontalBarChart />
    <LineChart />
    <ProjectStagesPolarChart />
    <ClickableHorizontalBarChart />    

  </div>
</template>

<script>
import BarChart from '@/components/kpi/BarChart.vue'
import DoughnutChart from '@/components/kpi/DoughnutChart.vue'
import HorizontalBarChart from '@/components/kpi/HorizontalBarChart.vue'
import LineChart from '@/components/kpi/LineChart.vue'
import ProjectStagesPolarChart from '@/components/kpi/ProjectStagesPolarChart.vue'
import ClickableHorizontalBarChart from '@/components/kpi/ClickableHorizontalBarChart.vue'

export default {
  components: {
    BarChart,
    DoughnutChart,
    HorizontalBarChart,
    LineChart,
    ProjectStagesPolarChart,
    ClickableHorizontalBarChart
  }
}
</script>

<style lang="less">
</style>