<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout :span="24">
      <translate>Monthly growth of Projects</translate>
      <template #graph>
        <chart
          :key="loadingChart"
          :chart-data="chartData"
          :options="chartOptions"
          :height="360"
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
  name: 'MonthlyGrowthOfProjects',
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
      base: '/api/kpi',
      currentlyLoading: true,
      datasetPreset: {
        borderColor: '#49BCE8',
        data: [],
        fill: false,
        lineTension: 0,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#49BCE8',
        pointBorderWidth: 4,
        pointHoverBackgroundColor: '#49BCE8',
        pointHoverBorderColor: '#49BCE8',
        pointHoverBorderWidth: 3,
        pointHoverRadius: 6,
        pointRadius: 5
      },
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              offset: true,
              gridLines: { drawOnChartArea: false, drawTicks: false },
              scaleLabel: {
                display: true,
                labelString: 'Months',
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { fontSize: 10, padding: 15 }
            }
          ],
          yAxes: [
            {
              gridLines: { drawTicks: false },
              scaleLabel: {
                display: true,
                labelString: 'Growth of users',
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { fontSize: 10, padding: 15 }
            }
          ]
        }
      },
      dataLegend: {
        items: []
      }
    }
  },
  methods: {
    async getProjectStatus() {
      let response = await this.$axios.get(
        `${this.base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response
    },
    getGrowth(projectStatuses) {
      let growthByMonth = projectStatuses.data.map(month => {
        return month.growth
      })
      return growthByMonth
    },
    getLabels(projectStatuses) {
      let labels = projectStatuses.data.map(month => {
        return (
          new Date(month.date).getFullYear() +
          '-' +
          new Date(month.date).toLocaleString('en-us', { month: 'short' })
        )
      })
      return labels
    },
    async loadChart() {
      //   console.log('User data response')
      //   console.log(await this.getProjectStatus())

      let apiProjectStatuses = await this.getProjectStatus()
      let growthData = await this.getGrowth(apiProjectStatuses)
      let labels = await this.getLabels(apiProjectStatuses)

      //   console.log('this.getLabels(apiProjectStatuses)')
      //   console.log(this.getLabels(apiProjectStatuses))

      //   console.log('this.getGrowth(apiProjectStatuses)')
      //   console.log(this.getGrowth(apiProjectStatuses))

      this.chartData.datasets = [{ ...this.datasetPreset, data: growthData }]
      this.chartData.labels = labels

      //   console.log("Result chart data")
      //   console.log(this.chartData)

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
// .chart-wrapper::before {
//   transition: 0.2s ease-out;
//   content: '';
//   display: block;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background-color: transparent;
//   z-index: 0;
//   backdrop-filter: blur(0px);
// }
// .chart-wrapper.loading::before {
//   content: '';
//   display: block;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(255, 255, 255, 0.548);
//   z-index: 1;
//   backdrop-filter: blur(2px);
// }
</style>
