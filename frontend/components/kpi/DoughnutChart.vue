<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout :span="24">
      <translate>Monthly growth of Projects</translate>
      <template #graph>
        <chart
          type="doughnut"
          :key="loadingChart"
          :width="160"
          :height="160"
          :chart-data="chartData"
          :options="chartOptions"
        />
      </template>
    </graph-layout>
  </div>
</template>

<script>
import { objectToQueryString } from '@/utilities/charts'

import Chart from '@/components/common/charts/Chart'
import DataLegend from '@/components/common/charts/utilities/DataLegend'
import GraphLayout from '@/components/common/charts/widgets/GraphLayout'

export default {
  components: {
    Chart,
    DataLegend,
    GraphLayout
  },
  name: 'ProjectStagesPolarChart',
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
    chartDataInput: {
      type: Object,
      default: () => ({})
    },
    chartOptionsInput: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loadingChart: 0,
      currentlyLoading: true,
      base: '/api/kpi',
      chartData: {
        labels: [
          'Draft Projects',
          'Published Projects',
          'Publishable Projects',
          'Unpublished Projects',
          'Incoherent Projects'
        ],
        datasets: [
          {
            backgroundColor: [
              '#BABABB',
              '#9ACB67',
              '#FFCF3F',
              '#49BCE8',
              '#E84F48'
            ],
            data: [],
            lineTension: 0,
            pointRadius: 0
          }
        ]
      },
      chartOptions: {
        legend: {
          display: false
        },
        maintainAspectRatio: false
      }
    }
  },
  methods: {
    sum(arr) {
      return arr.reduce((acc, val) => acc + val, 0)
    },
    async getProjectStatus() {
      let response = await this.$axios.get(
        `${this.base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response
    },
    getSums(projectStatuses) {
      //   let growthByMonth = projectStatuses.data.map(month => {return month.growth})
      return [
        this.sum(
          projectStatuses.data.map(month => {
            return month.draft
          })
        ),
        this.sum(
          projectStatuses.data.map(month => {
            return month.published
          })
        ),
        this.sum(
          projectStatuses.data.map(month => {
            return month.ready_to_publish
          })
        ),
        this.sum(
          projectStatuses.data.map(month => {
            return month.unpublished
          })
        ),
        this.sum(
          projectStatuses.data.map(month => {
            return month.to_delete
          })
        )
      ]
    },
    async loadChart() {
      this.currentlyLoading = true
      console.log('User data response')
      console.log(await this.getProjectStatus())

      let apiProjectStatuses = await this.getProjectStatus()
      let sums = this.getSums(apiProjectStatuses)

      console.log('Sums of API project statuses')
      console.log(sums)

      this.chartData.datasets[0].data = sums

      //   this.chartData.labels = sums
      //   let growthData = await this.getGrowth(apiProjectStatuses)
      //   let labels = await this.getLabels(apiProjectStatuses)

      //   console.log('this.getLabels(apiProjectStatuses)')
      //   console.log(this.getLabels(apiProjectStatuses))

      //   console.log('this.getGrowth(apiProjectStatuses)')
      //   console.log(this.getGrowth(apiProjectStatuses))

      //   this.chartData.datasets = [{ ...this.datasetPreset, data: growthData }]
      //   this.chartData.labels = labels

      console.log('Result chart data')
      console.log(this.chartData)
      console.log('Result chart chartOptions')
      console.log(this.chartOptions)

      if (Object.keys(this.chartDataInput).length) {
        this.chartData = this.chartDataInput
      }
      if (Object.keys(this.chartOptionsInput).length) {
        this.chartData = this.chartOptionsInput
      }

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

<style lang="less" scoped>
.chart-wrapper::before {
  transition: 0.2s ease-out;
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 0;
  backdrop-filter: blur(0px);
}
.chart-wrapper.loading::before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.548);
  z-index: 1;
  backdrop-filter: blur(2px);
}
</style>
