<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" class="chart-wrapper" :loading="currentlyLoading">
    <translate>Monthly User Activity</translate>
    <template #graph>
      <Chart
        type="bar-chart"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="300"
      />
    </template>
    <template #legend>
      <DataLegend :items="dataLegend" horizontal />
    </template>
  </GraphLayout>
</template>

<script>
import { format } from 'date-fns'
import { objectToQueryString, extract, tooltipType, legendGenerator } from '@/utilities/charts'
import GraphLayout from '@/components/charts/common/GraphLayout'
import Chart from '@/components/charts/common/Chart'
import DataLegend from '@/components/charts/utilities/DataLegend'
const base = '/api/kpi'
const chartColors = ['#49BCE8', '#99CA67']

export default {
  name: 'MonthlyUserActivity',
  components: {
    GraphLayout,
    Chart,
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
              gridLines: { 
                drawOnChartArea: false, 
                drawTicks: false 
              },
              scaleLabel: {
                display: true,
                labelString: this.$gettext('Months'),
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { 
                fontSize: 10, 
                padding: 15 
              }
            }
          ],
          yAxes: [
            {
              gridLines: { 
                drawTicks: false 
              },
              scaleLabel: {
                display: true,
                labelString: this.$gettext('Growth of users'),
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { 
                fontSize: 10, 
                padding: 15 
              }
            }
          ]
        },
        ...tooltipType(false,'', this.$gettext('Months'))
      },      
      dataLegend: []
    }
  },
  methods: {
    async getUsers() {
      const response = await this.$axios.get(
        `${base}/users/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    async loadChart() {
      this.currentlyLoading = true
      const userData = await this.getUsers()

      const registeredUsers = {
        backgroundColor: chartColors[0],
        barThickness: 'flex',
        data: userData.map(month => month.registered),
        label: 'Registered Users'
      }
      const activeUsers = {
        backgroundColor: chartColors[1],
        barThickness: 'flex',
        data: userData.map(month => month.active),
        label: 'Active Users'
      }

      this.chartData.datasets = [registeredUsers, activeUsers]
      this.chartData.labels = extract(userData, 'date').map(d => format(d, 'YYYY-MMM')),
      this.dataLegend = legendGenerator([
        this.$gettext('Monthly User Growth'),
        this.$gettext('Monthly Active User')
      ], chartColors)

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