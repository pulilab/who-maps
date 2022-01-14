<template>
  <div class="chart-wrapper" v-bind:class="[currentlyLoading ? 'loading' : '']">
    <graph-layout>
      <!-- <translate v-if="back.length === 0" key="categories" class="kpiHeader"
        >Health Focus Categories (by occurrences)</translate
      > -->
      <translate key="areas" class="kpiHeader"
        >Health Focus Areas (by occurrences)</translate
      >
      <el-popover
        placement="bottom"
        width="480"
        popper-class="hfa-info-popover"
        class="hfa-info"
        trigger="click"
      >
        <div>
          <h2>
            <translate>Health Focus Categories</translate>
          </h2>
          <p>
            <translate
              >At first level in the Health Focus Categories every project can
              contain the a Health Focus Category only once.</translate
            >
          </p>
          <h2><translate>Health Focus Areas</translate></h2>
          <p>
            <translate
              >Health Focus Areas as sublevel of Health Focus Categories can
              contain multiple Health Focus Areas. Because of this, it may
              happen that the sum of the visible Health Focus Areas are more
              than the sum of Health Focus Categories, although the individual
              Health Focus Areas cannot exceed the number of Health Focus
              Categories displayed.</translate
            >
          </p>
        </div>
        <fa slot="reference" icon="info-circle" class="info-ref" />
      </el-popover>
      <template #back>
        <el-button
          type="text"
          icon="el-icon-arrow-left"
        >
          <translate>Back</translate>
        </el-button>
      </template>
      <template #graph>
        <horizontal-bar
          v-if="chartData"
          :chart-data="chartData"
          :options="chartOptions"
          :height="480"
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
// import Subtitle from '@/components/common/charts/utilities/Subtitle'

export default {
  components: {
    Chart,
    DataLegend,
    GraphLayout,
    // Subtitle
  },
  name: 'ClickableHorizontalBarChart',
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
    async getHealthCategories() {
      let catParam = '/0'
      let response = await this.$axios.get(
        `/api/kpi/health-categories${catParam}/${objectToQueryString(
          this.filters
        )}`
      )
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
      let healthCategories = await this.getHealthCategories()
      let projectStructure = await this.getProjectStructure()
      let dataStandards = await this.getDataStandards()
      console.log('healthCategorieshealthCategorieshealthCategories')
      console.log(healthCategories)
      console.log('projectStructureprojectStructureprojectStructure')
      console.log(projectStructure)


      console.log('healthCategorieshealthCategorieshealthCategories ###########')
      let topCategories = {}
      healthCategories.data.map((month) => {
          console.log(month.date)
        let keys = Object.keys(month.hfa)
        keys.map((key) => {
            let insideKeysForCount = Object.keys(month.hfa[key])
            let insideCount = 0
            insideCount = Object.values(month.hfa[key]).length
            if(topCategories[key] == NaN || typeof topCategories[key] == 'undefined') topCategories[key] = 0
            topCategories[key] += insideCount
        })
      })
      console.log("topCategories summer")
      console.log(topCategories)
      console.log('projectStructureprojectStructureprojectStructure ###########')
      projectStructure.data.health_focus_areas.map((projectHfa) => {
          console.log(projectHfa.name)
      })
    //   console.log(dataStandards.data)

    //   this.chartData.labels = labels

      console.log('chartData resulting in')
      console.log(this.chartData)

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
