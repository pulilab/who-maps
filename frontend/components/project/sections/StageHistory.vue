<template>
  <div
    id="stagesHistory"
    class="StageHistory"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('History of project stage') | translate"
    >
      <line-chart :data="barChartData" :options="options" />
      <el-row
        :gutter="20"
        type="flex"
      >
        <el-col :span="12">
        </el-col>

        <el-col :span="12">
        </el-col>
      </el-row>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from '../CollapsibleCard';

const phase = [
    'Opportunity and Ideation',
    'Preparation',
    'Analysis and Design',
    'Implementation Planning',
    'Developing or Adapting Solution',
    'Piloting and Evidence Generation',
    'Package and Champion',
    'Deploying',
    'Scaling up',
    'Scale and Handover',
    'Under Review'
  ]

export default {
  data: () => ({
    barChartData: {
      labels: ['2020-10-10', '2020-10-11', '2020-10-12', '2020-10-13', '2020-10-14'],
      datasets: [
        {
          label: 'Data One',
          borderColor: '#008DC9',
          fill: false,
          lineTension: 0,
          data: [0, 1, 2, 3],
          pointStyle: ['triangle', 'circle', 'circle', 'circle'],
          pointRadius: [12, 6, 6, 6],
          pointBorderColor: 'white',
          pointHoverRadius: [14, 8, 8, 8],
          pointBackgroundColor: '#008DC9',
          pointRotation: 90,
        },
        {
          label: 'Data One',
          borderColor: '#D86422',
          pointBackgroundColor: '#D86422',
          borderDash: [10,5],
          pointStyle: ['triangle', 'circle', 'circle', 'circle', 'triangle'],
          pointRotation: 180,
          pointRadius: [0, 0, 0, 0, 12],
          pointHoverRadius: [0, 0, 0, 0, 14],
          pointBorderColor: 'white',
          // borderColor: '#558B2F',
          // pointBackgroundColor: '#558B2F',
          fill: false,
          lineTension: 0,
          data: [0, 1, 2, 3, 4]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display:false,
            drawBorder: false
          },
          ticks: {
            beginAtZero: false,
            fontSize: 12,
            fontColor: '#474747',
            padding: 10
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            stepSize: 1,
            min: 0,
            max: 10,
            beginAtZero: true,
            fontSize: 12,
            fontColor: '#9E9E9E',
            padding: 10,
            callback: function(value, index, values) {
              return phase[value] || '';
            }
          }
        }]
      }
    }
  }),
  components: {
    CollapsibleCard
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";
</style>
