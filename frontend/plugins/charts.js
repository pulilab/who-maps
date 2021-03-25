/* eslint-disable vue/one-component-per-file */
import Vue from 'vue'
import {
  Line,
  Doughnut,
  mixins,
  PolarArea,
  Bar,
  HorizontalBar
} from 'vue-chartjs'

const chartMixin = {
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData (chartdata) {
      this.renderChart(chartdata, this.options)
    }
  }
}

Vue.component('LineChart', {
  extends: Line,
  mixins: [chartMixin]
})

Vue.component('Doughnut', {
  extends: Doughnut,
  mixins: [chartMixin]
})

Vue.component('PolarArea', {
  extends: PolarArea,
  mixins: [chartMixin]
})

Vue.component('BarChart', {
  extends: Bar,
  mixins: [chartMixin]
})

Vue.component('HorizontalBar', {
  extends: HorizontalBar,
  mixins: [chartMixin]
})
