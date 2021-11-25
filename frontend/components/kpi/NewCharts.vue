<template>
  <div>
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
        <DataLegend :items="dataLegend.items"> </DataLegend>
      </template>
    </graph-layout>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
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
  name: 'NewCharts',
  data() {
    return {
      loadingChart: 0,
      base: '/api/kpi',
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
  computed: {
    ...mapState({
      filters: state => state.charts.filters
    })
  },
  methods: {
    async callForProjectStages() {
      let response = await this.$axios.get(
        `${this.base}/project-stages/${objectToQueryString(this.filters)}`
      )
      return response
    },
    async callForProjectStructure() {
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
    }
  },
  async mounted() {
    let projectStructure = await this.callForProjectStructure()
    let projectStages = await this.callForProjectStages()

    let stageNames = this.getStageNames(projectStructure)
    const noStageData = 'Projects with no stage data'
    this.chartData.datasets[0].backgroundColor[stageNames.length] = ''
    stageNames.push(noStageData) //+we ad the 'projects with no stage data' label
    let stageCounts = this.getStagesCount(projectStages)

    this.dataLegend.items = this.makeDataLegend(
      stageNames,
      stageCounts,
      this.chartData.datasets[0].backgroundColor
    )

    //removing projects with no stage data as the list element
    stageNames.pop()
    stageCounts.pop()

    this.chartData.labels = stageNames
    this.chartData.datasets[0].data = stageCounts

    //re-render chart
    this.loadingChart++
  }
}
</script>
