<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout :span="24">
      <translate>Monthly User Activity</translate>
      <template #graph>
        <chart
          :key="loadingChart"
          type="bar-chart"
          :chart-data="chartData"
          :options="chartOptions"
          :height="300"
        />
      </template>
      <template #legend>
        <data-legend :items="dataLegend.items" horizontal />
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
  name: 'MonthlyUserActivity',
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
        labels: [],
        datasets: []
      },
      chartOptions: {
        legend: {
          display: true
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
    async getUsers() {
      let response = await this.$axios.get(
        `${this.base}/users/${objectToQueryString(this.filters)}`
      )
      return response
    },
    getRegisteredUsers(userData) {
      let registeredUsers = userData.data.map(month => {
        return month.registered
      })
      return registeredUsers
    },
    getActiveUsers(userData) {
      let activeUsers = userData.data.map(month => {
        return month.active
      })
      return activeUsers
    },
    getLabels(userData) {
      let activeUsers = userData.data.map(month => {
        return (
          new Date(month.date).getFullYear() +
          '-' +
          new Date(month.date).toLocaleString('en-us', { month: 'short' })
        )
      })
      return activeUsers
    },
    async loadChart() {
      this.currentlyLoading = true
      console.log('User data response')
      let userDataResponse = await this.getUsers()

      let activeUsers = {
        backgroundColor: '#99CA67',
        barThickness: 'flex',
        data: this.getActiveUsers(userDataResponse),
        label: 'Active Users'
      }
      let registeredUsers = {
        backgroundColor: '#49BCE8',
        barThickness: 'flex',
        data: this.getRegisteredUsers(userDataResponse),
        label: 'Registered Users'
      }

      let graphLabels = this.getLabels(userDataResponse)

      this.chartData.datasets = [registeredUsers, activeUsers]
      this.chartData.labels = graphLabels

      if (Object.keys(this.chartDataInput).length) {
        this.chartData = this.chartDataInput
      }
      if (Object.keys(this.chartOptionsInput).length) {
        this.chartOptions = this.chartOptionsInput
      }

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
