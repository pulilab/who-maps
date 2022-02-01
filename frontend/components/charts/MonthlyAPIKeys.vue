<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }">
    <translate>Monthly growth of API keys</translate>
    <template #graph>
      <Chart
        type:="line-chart"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="300"
      />
    </template>
  </GraphLayout>
</template>

<script>
import { format } from 'date-fns'
import { objectToQueryString, extract } from '@/utilities/charts'
import Chart from '@/components/charts/common/Chart'
import GraphLayout from '@/components/charts/common/GraphLayout'
const base = '/api/kpi'

export default {
  name: 'MonthlyAPIKeys',
  components: {
    Chart,
    GraphLayout
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
                labelString: this.$gettext('# of API keys'),
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { fontSize: 10, padding: 15 }
            }
          ]
        },
        tooltip: this.$gettext('API keys'),
        tooltips: {
          titleAlign: 'top',
          bodyAlign: 'center',
          backgroundColor: '#474747',
          displayColors: false,
          xPadding: 10,
          yPadding: 8,
          callbacks: {}
        }        
      },
    }
  },
  methods: {
    async getTokens() {
      const response = await this.$axios.get(
        `${base}/tokens/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    setTokens(tokens) {
      return {
        data: extract(tokens, 'tokens'),
        borderColor: '#49BCE8',
        fill: false,
        lineTension: 0,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#49BCE8',
        pointBorderWidth: 4,
        pointHoverBackgroundColor: '#49BCE8',
        pointHoverBorderColor:'#49BCE8',
        pointHoverBorderWidth: 3,
        pointHoverRadius: 6,
        pointRadius: 5
      }
    },
    async loadChart() {
      this.currentlyLoading = true
      const tokens = await this.getTokens()
      this.chartData.datasets = [this.setTokens(tokens)]
      this.chartData.labels = extract(tokens, 'date').map(d => format(d, 'YYYY-MMM'))

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