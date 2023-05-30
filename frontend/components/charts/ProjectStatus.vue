<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }">
    <template #graph>
      <Chart
        type="doughnut"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :width="160"
        :height="160"
      />
    </template>
    <template #legend>
      <DataLegend :items="chartLegend" large />
    </template>
  </GraphLayout>
</template>

<script>
import { objectToQueryString, extract, customTooltip, legendGenerator } from '@/utilities/charts'
import Chart from '@/components/charts/common/Chart'
import GraphLayout from '@/components/charts/common/GraphLayout'
import DataLegend from '@/components/charts/utilities/DataLegend.vue'

const base = '/api/kpi'
const chartColors = ['#BABABB', '#9ACB67', '#FFCF3F', '#49BCE8', '#E84F48', '#000']

export default {
  name: 'ProjectStatus',
  components: {
    Chart,
    GraphLayout,
    DataLegend
  },
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      loadingChart: 0,
      currentlyLoading: true,
      chartData: {
        labels: [
          this.$gettext('Draft Projects'),
          this.$gettext('Published Projects'),
          this.$gettext('Publishable Projects'),
          this.$gettext('Unpublished Projects'),
          this.$gettext('Incoherent Projects'),
          this.$gettext('Archived Projects'),
        ],
        datasets: [{
          data: [],
          backgroundColor: chartColors,
          lineTension: 0,
          pointRadius: 0
        }]
      },
      chartOptions: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        tooltips: { ...customTooltip }
      },
      chartLegend: []
    }
  },
  methods: {
    async getProjectStatus() {
      const response = await this.$axios.get(
        `${base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    projectSum(arr) {
      return arr.reduce((acc, val) => acc + val, 0)
    },
    async loadChart() {
      this.currentlyLoading = true
      const projectStatus = await this.getProjectStatus()
      // projects status data generation
      const draft = extract(projectStatus, 'draft')
      const published = extract(projectStatus, 'published')
      const publishable = extract(projectStatus, 'ready_to_publish')
      const unpublished = extract(projectStatus, 'unpublished')
      const deletable = extract(projectStatus, 'to_delete')
      const archived = extract(projectStatus, 'archived')

      this.chartData.datasets[0].data = [
        this.projectSum(draft),
        this.projectSum(published),
        this.projectSum(publishable),
        this.projectSum(unpublished),
        this.projectSum(deletable),
        this.projectSum(archived),
      ]

      this.chartLegend = legendGenerator(
        this.chartData.labels,
        chartColors,
        this.chartData.datasets[0].data
      )

      //re-render chart
      this.loadingChart++
      this.currentlyLoading = false
    }
  },
  async mounted() {
    await this.loadChart()
  },
  watch: {
    filters: async function(newValue, oldValue) {
      await this.loadChart()
    }
  }
}
</script>

<style>

</style>