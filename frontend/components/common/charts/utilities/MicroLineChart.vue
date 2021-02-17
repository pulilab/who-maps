<template>
  <line-chart
    v-if="loaded"
    :chart-data="chartData"
    :options="options"
    :width="width"
    :height="height"
  />
</template>

<script>
var delayed = false;
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    loaded: false,
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      animation: {},
      scales: {
        xAxes: [
          {
            display: false,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  }),
  computed: {
    chartData() {
      return {
        labels: this.data,
        datasets: [
          {
            backgroundColor: "#E8F6FD",
            borderColor: "#22ADE3",
            data: this.data,
            label: "Dataset",
            pointRadius: 0,
            lineTension: 0,
          },
        ],
      };
    },
  },
  async created() {
    await setTimeout(() => {
      this.loaded = true;
    }, 250);
  },
  beforeDestroy() {
    this.loaded = false;
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
