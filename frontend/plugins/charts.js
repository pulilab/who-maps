import Vue from 'vue';
import { Line, Doughnut, mixins, PolarArea, Bar } from 'vue-chartjs';

const chartMixin = {
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
}


Vue.component('line-chart', {
  extends: Line,
  mixins: [chartMixin],
});

Vue.component('doughnut', {
  extends: Doughnut,
  mixins: [chartMixin],
});

Vue.component('polar-area', {
  extends: PolarArea,
  mixins: [chartMixin],
});

Vue.component('bar-chart', {
  extends: Bar,
  mixins: [chartMixin],
});
