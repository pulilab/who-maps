<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout :span="24">
      <translate>
        Top {top} ‘Data standards’ (by occurrences)
      </translate>
      <template #graph>
        <horizontal-bar
          :key="loadingChart"
          :chart-data="chartData"
          :options="chartOptions"
          :height="300"
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
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [
            { gridLines: { drawTicks: false }, ticks: { min: 0, stepSize: 10 } }
          ],
          yAxes: [
            {
              gridLines: { drawOnChartArea: false, drawTicks: false },
              ticks: { fontSize: 10, padding: 15 }
            }
          ]
        },
        tooltips: {
          backgroundColor: '#474747',
          displayColors: false,
          xPadding: 10,
          yPadding: 8,
          callbacks: {}
        }
      },
      dataLegend: {
        items: []
      }
    }
  },
  methods: {
    async getProjectStructure() {
      let response = await this.$axios.get('/api/projects/structure/')
      return response
    },
    async getDataStandards() {
      let response = await this.$axios.get(
        `${this.base}/data-standards/${objectToQueryString(this.filters)}`
      )
      return response
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
      this.currentlyLoading = true
      console.log('User data getProjectStructure')
      let projectStructure = await this.getProjectStructure()
      let dataStandards = await this.getDataStandards()
      console.log(projectStructure)
      console.log(projectStructure.data.interoperability_standards)
      console.log(dataStandards.data)

      let mergedStandards = dataStandards.data.reduce((acc, curr) => {
        for (let key in curr.standards) {
          if (acc[key]) {
            acc[key] += curr.standards[key]
          } else {
            acc[key] = curr.standards[key]
          }
        }
        return acc
      }, {})

      let labels = projectStructure.data.interoperability_standards.map(
        standard => {
          return standard.name
        }
      )

      console.log('labels it is')
      console.log(labels)
      console.log('mergedStandards it is')
      console.log(mergedStandards)

      this.chartData.datasets = [
        {
          backgroundColor: '#49BCE8',
          data: Object.values(mergedStandards),
          barThickness: 'flex'
        }
      ]

      this.chartData.labels = labels

      console.log('chartData resulting in')
      console.log(this.chartData)

      //   let apiProjectStatuses = await this.getProjectStatus()
      //   let growthData = await this.getGrowth(apiProjectStatuses)
      //   let labels = await this.getLabels(apiProjectStatuses)

      //   console.log('this.getLabels(apiProjectStatuses)')
      //   console.log(this.getLabels(apiProjectStatuses))

      //   console.log('this.getGrowth(apiProjectStatuses)')
      //   console.log(this.getGrowth(apiProjectStatuses))

      //   this.chartData.datasets = [{ ...this.datasetPreset, data: growthData }]
      //   this.chartData.labels = labels

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
