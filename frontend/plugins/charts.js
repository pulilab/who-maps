import Vue from 'vue'
import { Bar, Line } from 'vue-chartjs'

Vue.component('bar-chart', {
  extends: Bar,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
})

Vue.component('line-chart', {
  extends: Line,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
})
