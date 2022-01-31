<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" v-if="!firstLoad">
    <translate>Project statuses per month</translate>
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
      <DataLegend :items="chartLegend" horizontal />
    </template>
  </GraphLayout>  
</template>

<script>
import { format } from 'date-fns'
import { objectToQueryString, extract, customStackedTooltip, legendGenerator } from '@/utilities/charts'
import Chart from '@/components/charts/common/Chart'
import GraphLayout from '@/components/charts/common/GraphLayout'
import DataLegend from '@/components/charts/utilities/DataLegend.vue'

const base = '/api/kpi'
const chartColors = ['#BABABB', '#9ACB67', '#FFCF3F', '#49BCE8', '#E84F48']
const projectsLabels = [
  'Draft Projects',
  'Published Projects',
  'Publishable Projects',
  'Unpublished Projects',
  'Incoherent Projects'
]
    
export default {
  name: 'ProjectStatusesPerMonth',
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
      firstLoad: true,
      loadingChart: 0,
      currentlyLoading: true,
      chartData: {
        labels: projectsLabels,
        datasets: []
      },
      chartOptions: {
        legend: {
          display: false
        },
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
              },
              stacked: true
            }
          ],
          yAxes: [
            {
              gridLines: {
                drawTicks: false
              },
              scaleLabel: {
                display: true,
                labelString: this.$gettext('# of projects'),
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: {
                fontSize: 10,
                padding: 15
              },
              stacked: true
            }
          ]
        },
        maintainAspectRatio: false,        
        tooltips: {
          enabled: false,
          mode: 'index',
          ...customStackedTooltip
        }
      },
      chartLegend: {}
    }
  },
  methods: {
    async getProjectStatusPerMonth() {
      const response = await this.$axios.get(
        `${base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    generateDataset(colors,data,projectsLabels) {
      return colors.map((color,i) => {
        return {
          backgroundColor: color,
          barThickness: 40,
          label: projectsLabels[i],
          data: data[i]
        }
      })
    },
    async loadChart() {
      this.currentlyLoading = true
      const projectStatus = await this.getProjectStatusPerMonth()
      this.chartData.labels = extract(projectStatus, 'date').map(d => format(d, 'YYYY-MMM'))
      const projectStatusMonthly = [
        extract(projectStatus, 'draft'),
        extract(projectStatus, 'published'),
        extract(projectStatus, 'ready_to_publish'),
        extract(projectStatus, 'unpublished'),
        extract(projectStatus, 'to_delete')
      ]
      
      this.chartData.datasets = this.generateDataset(chartColors,projectStatusMonthly,projectsLabels)
      this.chartLegend = legendGenerator(projectsLabels,chartColors)

      //re-render chart
      this.loadingChart++
      this.currentlyLoading = false
    }
  },
  async mounted() {
    await this.loadChart()
    this.firstLoad = false
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