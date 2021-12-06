<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout :span="24" horizontal>
      <span class="kpiHeader">Distributions of projects’ stages 2</span>
      <template #graph>
        <chart
          :key="loadingChart"
          type="polar-area"
          :chart-data="chartData"
          :options="chartOptions"
        />
      </template>
      <template #legend>
        <DataLegend :items="dataLegend.items">
          <div>
            <span class="label">Projects with no stage data</span>
            <span class="dots" />
            <span class="value">{{ noStageDataCount }}</span>
          </div>
        </DataLegend>
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
      required: true,
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
      noStageDataCount: 0,
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [
              '#757575',
              '#1A527B',
              '#1577AC',
              '#4897B3',
              '#66C6D0',
              '#87F7EF',
              '#713ED2',
              '#E2D83B',
              '#1FA075',
              '#BF2999',
              '#D1632E',
              '#E5A131'
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
        maintainAspectRatio: false,
        scale: {
          gridLines: {
            borderDash: [6],
            borderDashOffset: 10,
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
        }
      },
      dataLegend: {
        items: []
      }
    }
  },
  methods: {
    async getProjectStages() {
      let response = await this.$axios.get(
        `${this.base}/project-stages/${objectToQueryString(this.filters)}`
      )
      return response
    },
    async getProjectStructure() {
      let response = await this.$axios.get('/api/projects/structure/')
      return response
    },
    getStageNames(projectStructure) {
      let names = projectStructure.data.stages.map(stage => stage.name)
      return names
    },
    getStagesCount(projectStagesFromPrevoiusYear) {
      //from the backend, the stages count data returned in monthly chunks for the previous year
      let stagesCountByMonth = projectStagesFromPrevoiusYear.data.map(
        month => month.stages
      )
      let stageKeys = Object.keys(stagesCountByMonth[0])

      //loading zeros to the stage summary
      let summary = {}
      stageKeys.map(stageKey => (summary[stageKey] = 0))

      stagesCountByMonth.map(monthlyStage => {
        //for each month
        stageKeys.map(stageKey => {
          //for each stage
          summary[stageKey] += monthlyStage[stageKey] //add the stage count to the summary
        })
      })
      return Object.values(summary) //converting to list of values
    },
    makeDataLegend(stageNames, stageCounts, colors) {
      return Object.keys(stageNames).map(index => {
        return {
          color: colors[index],
          label: stageNames[index],
          value: stageCounts[index]
        }
      })
    },
    async loadChart() {
      this.currentlyLoading = true
      let projectStructure = await this.getProjectStructure()
      let projectStages = await this.getProjectStages()

      let stageNames = this.getStageNames(projectStructure)
      const noStageData = 'Projects with no stage data'
      this.chartData.datasets[0].backgroundColor[stageNames.length] = ''
      stageNames.push(noStageData) //+we ad the 'projects with no stage data' label
      let stageCounts = this.getStagesCount(projectStages)

      this.noStageDataCount = stageCounts[stageCounts.length - 1]

      //removing projects with no stage data as the list element
      stageNames.pop()
      stageCounts.pop()

      this.dataLegend.items = this.makeDataLegend(
        stageNames,
        stageCounts,
        this.chartData.datasets[0].backgroundColor
      )

      this.chartData.labels = stageNames
      this.chartData.datasets[0].data = stageCounts

      //preset if loading
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
