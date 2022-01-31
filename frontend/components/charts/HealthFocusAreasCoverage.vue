<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" class="chart-wrapper" :loading="currentlyLoading">
    <translate>Coverage of Health Focus Areas</translate>
    <template #graph>
      <Chart
        type="doughnut"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :width="160"
        :height="160"
      />
    </template>
    <template #legend>
      <TabLegend :legend="tabLegend" horizontal />
    </template>
  </GraphLayout>
</template>

<script>
import { objectToQueryString, customTooltip } from '@/utilities/charts'
import GraphLayout from '@/components/charts/common/GraphLayout'
import Chart from '@/components/charts/common/Chart'
import TabLegend from '@/components/charts/utilities/TabLegend'
const base = '/api/kpi'
const chartColors = ['#9ACB67', '#E84F48']

export default {
  name: 'HealthFocusAreasCoverage',
  components: {
    GraphLayout,
    Chart,
    TabLegend
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
      healthCategory: [],
      chartData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor:chartColors,
          lineTension: 0,
          pointRadius: 0
        }]
      },
      chartOptions: {
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        tooltips: {
          ...customTooltip
        }
      },      
      tabLegend: {
        tabs: [
          { name: this.$gettext("Covered"), color: "green", id: 1 },
          { name: this.$gettext("Not Covered"), color: "red", id: 2 }
        ],
        contents: [
          {
            id: 1,
            icon: 'el-icon-check',
            color: 'green',
            areas: 0
          },
          {
            id: 2,
            icon: 'el-icon-close',
            color: 'red',
            areas: 0
          }
        ]
      }
    }
  },
  methods: {
    async getProjectStructure() {
      const response = await this.$axios.get('/api/projects/structure/')
      return response.data
    },
    async getHealtFocusAreas() {
      const response =  await this.$axios.get(`${base}/hfa/${objectToQueryString(this.filters)}`)
      return response.data
    },
    getHFACoverage(hfaMonths) {
      let hfaCoveredAreasSum = 0
      let hfaNotCoveredAreasSum = 0
      let hfaCoveredAreas = []
      let hfaNotCoveredAreas = []
      let hfaCoveredSubAreas = []
      let hfaNotCoveredSubAreas = []

      this.healthCategory.forEach(hc => {
        hc.health_focus_areas.forEach(ha => {
          let covered = false
          hfaMonths.forEach(m => {
            if (!covered) covered = m.hfa[hc.id][ha.id]
          })
          if (covered) {
            hfaCoveredSubAreas.push({
              ...ha,
              hfaCategory: hc
            })
            hfaCoveredAreasSum++
          } else {
            hfaNotCoveredSubAreas.push({
              ...ha,
              hfaCategory: hc
            })
            hfaNotCoveredAreasSum++
          }
        })
      })      

      let lastHfaCategoryID = 0
      hfaCoveredSubAreas.forEach(hfaSub => {
        if (lastHfaCategoryID !== hfaSub.hfaCategory.id) {
          hfaCoveredAreas.push({
            name: hfaSub.hfaCategory.name,
            subareas: [hfaSub.name]
          })
          lastHfaCategoryID = hfaSub.hfaCategory.id
        } else {
          hfaCoveredAreas[hfaCoveredAreas.length - 1].subareas.push(hfaSub.name)
        }
      })

      lastHfaCategoryID = 0
      hfaNotCoveredSubAreas.forEach(hfaSub => {
        if (lastHfaCategoryID !== hfaSub.hfaCategory.id) {
          hfaNotCoveredAreas.push({
            name: hfaSub.hfaCategory.name,
            subareas: [hfaSub.name]
          })
          lastHfaCategoryID = hfaSub.hfaCategory.id
        } else {
          hfaNotCoveredAreas[hfaNotCoveredAreas.length - 1].subareas.push(
            hfaSub.name
          )
        }
      })

      return { hfaCoveredAreasSum, hfaNotCoveredAreasSum, hfaCoveredAreas, hfaNotCoveredAreas }
    },
    async loadChart() {
      this.currentlyLoading = true
      const hfaMonths = await this.getHealtFocusAreas()
      const { hfaCoveredAreasSum, hfaNotCoveredAreasSum, hfaCoveredAreas, hfaNotCoveredAreas } = this.getHFACoverage(hfaMonths)

      this.chartData.datasets[0].data = [hfaCoveredAreasSum, hfaNotCoveredAreasSum]
      this.chartData.labels = [
        this.$gettext('Covered'),
        this.$gettext('Not covered')
      ]
      this.tabLegend.contents[0].areas = hfaCoveredAreas
      this.tabLegend.contents[1].areas = hfaNotCoveredAreas

      //re-render chart
      this.loadingChart++
      this.currentlyLoading = false
    }
  },
  async mounted() {
    const { health_focus_areas } = await this.getProjectStructure()
    this.healthCategory = health_focus_areas
    await this.loadChart()
  },
  watch: {
    filters: async function(newValue, oldValue) {
      await this.loadChart()
    }
  }  
}
</script>