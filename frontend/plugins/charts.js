import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';

// Vue.component('bar-chart', {
//   extends: Bar,
//   props: ['data', 'options'],
//   mounted () {
//     this.renderChart(this.data, this.options);
//   }
// });

Vue.component('line-chart', {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData(chartdata) {
      this.renderChart(chartdata, this.options);
    }
  },
});
