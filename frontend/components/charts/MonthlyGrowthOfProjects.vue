<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }">
    <translate>Monthly growth of Projects</translate>
    <template #graph>
      <Chart
        type:="line-chart"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="360"
      />
    </template>
  </GraphLayout>
</template>

<script>
import { objectToQueryString, extract, tooltipType } from '@/utilities/charts'
import { format } from 'date-fns'
import Chart from '@/components/charts/common/Chart'
import GraphLayout from '@/components/charts/common/GraphLayout'
const base = '/api/kpi'

export default {
  name: 'MonthlyGrowthOfProjects',
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
        datasets: [{
          data: [],
          borderColor: '#49BCE8',
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
        }]
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
                fontSize: 10, padding: 15
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
                labelString: this.$gettext('Growth of projects'),
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
        ...tooltipType(false, this.$gettext('New projects'), this.$gettext('Months'))
      },
    }
  },
  methods: {
    async getProjectStatus() {
      const response = await this.$axios.get(
        `${base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    async loadChart() {
      const projectStatuses = await this.getProjectStatus()

      this.chartData.datasets[0].data = extract(projectStatuses, 'growth')
      this.chartData.labels = extract(projectStatuses, 'date').map(d => format(d, 'YYYY-MMM')),

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
