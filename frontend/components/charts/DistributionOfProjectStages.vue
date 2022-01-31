<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" horizontal >
    <translate class="kpiHeader">Distributions of projects’ stages</translate>
    <template #graph>
      <Chart
        type="polar-area"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
      />
    </template>
    <template #legend>
      <DataLegend :items="dataLegend.items">
        <div>
          <translate class="label">Projects with no stage data</translate>
          <span class="dots" />
          <span class="value">{{ dataLegend.noStageDataSum }}</span>
        </div>
      </DataLegend>
    </template>
  </GraphLayout>
</template>

<script>
import sumBy from 'lodash/sumBy'
import { objectToQueryString, extract, legendGenerator, customTooltip } from '@/utilities/charts'
import Chart from '@/components/charts/common/Chart'
import DataLegend from '@/components/charts/utilities/DataLegend'
import GraphLayout from '@/components/charts/common/GraphLayout'
const chartColors = ['#757575','#1A527B','#1577AC','#4897B3','#66C6D0','#87F7EF','#713ED2','#E2D83B','#1FA075','#BF2999','#D1632E','#E5A131']
const base = '/api/kpi'

export default {
  name: 'DistributionOfProjectStages',
  components: {
    Chart,
    DataLegend,
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
      stages: [],
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor:chartColors,
            lineTension: 0,
            pointRadius: 0,
            data: []
          }
        ]
      },
      chartOptions: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        scale: {
          gridLines: {
            borderDash: [6],
            borderDashOffset: 10,
            color:"#D8D1C9",
            z: 1
          },
          ticks: {
            fontSize: 10,
            padding: 20,
            stepSize: 20,
            z: 1,
            fontColor: '#D8D1C9',
            fontStyle: 'bold',
            showLabelBackdrop: false
          }
        },
        tooltips: { 
          ...customTooltip          
        }
      },
      dataLegend: {
        items: [],
        noStageDataSum: 0
      }
    }
  },
  methods: {
    async getProjectStructure() {
      const response = await this.$axios.get('/api/projects/structure/')
      return response.data
    },    
    async getProjectStages() {
      const response = await this.$axios.get(
        `${base}/project-stages/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    convertProjectStages(stages, stageData) {
      // create a new list of stages and summerize based on the stages
      return stages.map(stage => {
        return {
          ...stage,
          total: sumBy(stageData.map(i => i.stages), stage.id)
        }
      })
    },
    getNoStageDataSum(data) {
      return data.reduce((sum, stage) => {
        return stage.stages.no_data + sum
      }, 0)
    },
    async loadChart() {
      this.currentlyLoading = true
      const stageData = await this.getProjectStages()
      const projectStages = this.convertProjectStages(this.stages, stageData)

      this.chartData.labels = extract(projectStages, 'name')
      this.chartData.datasets[0].data = extract(projectStages, 'total')
      this.dataLegend.items = legendGenerator(
        this.chartData.labels,
        chartColors,
        this.chartData.datasets[0].data
      )
      this.dataLegend.noStageDataSum = this.getNoStageDataSum(stageData)      

      //re-render chart
      this.loadingChart++
      this.currentlyLoading = false
    }
  },
  async mounted() {
    const projectStructure = await this.getProjectStructure()
    this.stages = projectStructure.stages
    await this.loadChart()
  },
  watch: {
    filters: async function(newValue, oldValue) {
      await this.loadChart()
    }
  }
}
</script>