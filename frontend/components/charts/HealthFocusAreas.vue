<template>
  <GraphLayout v-bind="{ ...$props, ...$attrs }" class="chart-wrapper" :loading="currentlyLoading">
    <translate v-if="!showHFA" key="categories">Health Focus Categories (by occurrences)</translate>
    <translate v-else key="areas">Health Focus Areas (by occurrences)</translate>
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
        v-if="showHFA"
        type="text"
        icon="el-icon-arrow-left"
        @click="handleBackClick"
      >
        <translate>Back</translate>
      </el-button>
    </template>
    <template #subtitle>
      <Subtitle :item="subtitle" />
    </template>
    <template #graph>
      <Chart
        type="horizontal-bar"
        :key="loadingChart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="480"
      />
    </template>
  </GraphLayout>
</template>

<script>
import { objectToQueryString, optionsHorizontalBarConfig } from '@/utilities/charts'
import GraphLayout from '@/components/charts/common/GraphLayout'
import Chart from '@/components/charts/common/Chart'
import Subtitle from '@/components/charts/utilities/Subtitle'
const base = '/api/kpi'

export default {
  components: {
    GraphLayout,
    Chart,
    Subtitle
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
      showHFA: false,
      subtitle: {},
      mainBarOptions: {
        ...optionsHorizontalBarConfig({
          title: this.$gettext('Ocurrances:'),
          subtitle: this.$gettext('Click to see Heatlh Focus Areas')
        }, true),
        onClick: this.handleBarClick
      },
      subBarOptions: {
        ...optionsHorizontalBarConfig({
          title: this.$gettext('Ocurrances:'),
          subtitle: ''
        }, false)
      },
      chartData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: '#49BCE8',
          barThickness: 'flex'
        }]
      },
      chartOptions: {
        ...optionsHorizontalBarConfig({
          title: this.$gettext('Ocurrances:'),
          subtitle: this.$gettext('Click to see Heatlh Focus Areas')
        }, true),
        onClick: this.handleBarClick
      }
    }
  },
  methods: {    
    async getProjectStructure() {
      let response = await this.$axios.get('/api/projects/structure/')
      return response.data
    },
    async getHealthFocusAreas(hfcID = 0) {
      let catParam = ''
      let hfMode = 'categories'
      let healthFocusList = []
      if (hfcID > 0) {
        catParam = `/${hfcID}`
        hfMode = 'hfa'
        healthFocusList = this.healthCategory.find(hfc => hfc.id === hfcID).health_focus_areas
      } else {
        healthFocusList = this.healthCategory
      }
      const hfaKPI = await this.$axios.get(
        `${base}/health-categories${catParam}/${objectToQueryString(this.filters)}`
      )
      let hfaLabels = []
      let hfaOccurence = []
      const hfcMonths = hfaKPI.data
      if (hfcMonths.length > 0) {
        Object.keys(hfcMonths[0][hfMode]).forEach(hfID => {
          const hfa = healthFocusList.find(h => h.id == hfID)
          if (hfa) {
            hfaLabels.push(hfa.name)
            let occurence = 0
            hfcMonths.forEach(m => (occurence += m[hfMode][hfID]))
            hfaOccurence.push(occurence)
          }
        })
      }
      return { hfaLabels, hfaOccurence }
    },
    async handleBarClick(point, event) {
      const healthCategoryIndex = event[0]._index
      const clickedHealthCategory = this.healthCategory.find(
        hc => hc.name === this.chartData.labels[healthCategoryIndex]
      )
      this.chartOptions = this.subBarOptions
      this.subtitle = {
        label: clickedHealthCategory.name,
        value: this.chartData.datasets[0].data[healthCategoryIndex]
      }
      await this.loadChart(clickedHealthCategory.id)
      this.showHFA = true
    },
    async handleBackClick() {
      this.chartOptions = this.mainBarOptions
      this.subtitle = {}
      await this.loadChart()
      this.showHFA = false
    },
    async loadChart(hfcID = 0) {
      this.currentlyLoading = true
      const { hfaLabels, hfaOccurence } = await this.getHealthFocusAreas(hfcID)

      this.chartData.labels = hfaLabels
      this.chartData.datasets[0].data = hfaOccurence

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
      this.handleBackClick()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/variables.less';

.info-ref {
  cursor: pointer;
  color: @colorBrandPrimary;
  margin-left: 0.5em;
  &:hover {
    color: @colorBrandPrimaryLight;
  }
}

</style>