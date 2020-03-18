<template>
  <div
    id="stagesHistory"
    class="StageHistory"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('History of project stage') | translate"
    >
      <line-chart :data="stageChartData.data" :options="stageChartData.options" />
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
];

const labels = [
  '2020-10-10',
  '2020-10-11',
  '2020-10-12',
  '2020-10-13',
  '2020-10-14',
  '2020-10-15',
  '2020-10-16',
  '2020-10-17',
  '2020-10-18',
  ['2020-10-19', 'Ended']
];

const data = [0, 1, 2, 3, 4, 5, 6, 7, 9, 9];

export default {
  data: () => ({
    stageChartData: {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            borderColor: '#008DC9',
            pointBackgroundColor: '#008DC9',
            fill: false,
            lineTension: 0,
            pointStyle: ['triangle'].concat(new Array(labels.length - 2).fill('circle')),
            pointRadius: [12].concat(new Array(labels.length - 2).fill(6)),
            pointHoverRadius: [14].concat(new Array(labels.length - 2).fill(8)),
            pointBorderColor: 'white',
            pointRotation: 90,
            data: data.slice(0, data.length - 1)
          },
          {
            // borderColor: '#D86422',
            // pointBackgroundColor: '#D86422',
            borderColor: '#558B2F',
            pointBackgroundColor: '#558B2F',
            fill: false,
            lineTension: 0,
            // borderDash: [10, 5],
            pointStyle: new Array(labels.length - 1).fill('circle').concat(['triangle']),
            pointRadius: new Array(labels.length - 1).fill(0).concat([12]),
            pointHoverRadius: new Array(labels.length - 1).fill(0).concat([14]),
            pointBorderColor: 'white',
            // pointRotation: 180,
            pointRotation: 270,
            data: new Array(labels.length - 2).fill(NaN).concat(data.slice(-2))
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        defaultFontColor: '#474747',
        defaultFontSize: 12,
        tooltips: {
          enabled: false
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            offset: true,
            gridLines: {
              display:false,
              drawBorder: false
            },
            ticks: {
              // fontColor: new Array(labels.length - 1).fill('#474747').concat(['#558B2F']),
              padding: 12
            }
          }],
          yAxes: [{
            gridLines: {
              drawBorder: false
            },
            ticks: {
              stepSize: 1,
              min: 0,
              max: 10,
              fontColor: '#9E9E9E',
              padding: 12,
              callback: function(value, index, values) {
                return phase[value] || '';
              }
            }
          }]
        }
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
