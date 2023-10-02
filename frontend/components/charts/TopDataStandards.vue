<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" :loading="currentlyLoading" style="min-height: 463px">
    <translate :parameters="{ top }" class="kpiHeader">
      Top {top} ‘Data standards’ (by occurrences)
    </translate>
    <template #graph>
      <Chart
        type="horizontal-bar"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="dataStandardHeight"
      />
    </template>
  </GraphLayout>
</template>

<script>
import sortBy from 'lodash/sortBy'
import { objectToQueryString, extract } from '@/utilities/charts'
import { getNestedList } from '@/utilities/projects'
import GraphLayout from '@/components/charts/common/GraphLayout'
import Chart from '@/components/charts/common/Chart'

const base = '/api/kpi'

export default {
  name: 'TopDataStandards',
  components: {
    GraphLayout,
    Chart
  },
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
    top: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      loadingChart: 0,
      currentlyLoading: true,
      interoperabilityStandards: {},
      chartData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: '#49BCE8',
          barThickness: 'flex'
        }]
      },
      chartOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawTicks: false
              },
              ticks: {
                min: 0,
                stepSize: 10
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
                drawTicks: false
              },
              ticks: {
                fontSize: 10,
                padding: 15
              }
            }
          ]
        },
        tooltips: {
          backgroundColor: '#474747',
          displayColors: false,
          xPadding: 10,
          yPadding: 8,
          title: 'Ocurrances:',
          subtitle: ''
        },
      },
    }
  },
  computed: {
    dataStandardsCount() {
      return this.chartData?.datasets[0].data.length > 0
        ? this.chartData.datasets[0].data.length
        : 0
    },
    dataStandardHeight() {
      return this.top
        ? this.top * 40
        : this.dataStandardsCount > 0 ? this.dataStandardsCount * 40 : 800
    },
  },
  methods: {
    async getProjectStructure() {
      const response = await this.$axios.get('/api/projects/structure/')
      return response.data
    },
    async getMonthOfDataStandards() {
      const response = await this.$axios.get(
        `${base}/data-standards/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    generateDataStandars(months) {
      const flatStandards = getNestedList(this?.interoperabilityStandards, 'standards')
      return flatStandards.map(standard => {
        return {
          ...standard,
          total: months.reduce((total, m) => {
            const amount = Object.keys(m.standards).find(key => m.standards[key] == standard.id)
            return amount ? total + parseInt(amount) : total
          }, 0)
        }
      })
    },
    async loadChart() {
      this.currentlyLoading = true

      const monthsOfStandards = await this.getMonthOfDataStandards()
      const dataStandards = await this.generateDataStandars(monthsOfStandards)
      const totalsOfStandardsSorted = sortBy(dataStandards, ['total'])
        .reverse()
        .splice(0, this.top)

      this.chartData.labels = extract(totalsOfStandardsSorted, 'name', true)
      this.chartData.datasets[0].data = totalsOfStandardsSorted.map(t => t.total)

      this.loadingChart++
      this.currentlyLoading = false
    }
  },
  async mounted() {
    const projectStructure = await this.getProjectStructure()
    this.interoperabilityStandards = projectStructure.interoperability_standards
    await this.loadChart()
  },
  watch: {
    filters: async function(newValue, oldValue) {
      await this.loadChart()
    }
  }
}
</script>