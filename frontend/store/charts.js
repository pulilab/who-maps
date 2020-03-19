// utilities
import { axisYColors, dataInfoFill, fillArr, phaseInfo, lastLabelType } from '@/utilities/charts';

export const state = () => ({
  chartdata: {},
  options: {}
});

export const actions = {
  async getStageData ({ commit }) {

    const phases = [
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
      ['2020-10-19', 'Discontinued']
    ];

    const data = [0, 1, 2, 3, 4, 5, 6, 7, 9, 9];

    const { color, rotation, dash, point } = phaseInfo(lastLabelType(labels));

    commit(
      'SET_CHART_DATA',
      {
        labels,
        datasets: [
          {
            borderColor: '#008DC9',
            pointBackgroundColor: '#008DC9',
            fill: false,
            lineTension: 0,
            pointStyle: dataInfoFill(labels.length - 1, 'circle', 'triangle'),
            pointRadius: dataInfoFill(labels.length - 1, 6, 12),
            pointHoverRadius: dataInfoFill(labels.length - 1, 8, 14),
            pointBorderColor: 'white',
            pointRotation: 90,
            data: data.slice(0, data.length - 1)
          },
          {
            borderColor: color,
            pointBackgroundColor: color,
            fill: false,
            lineTension: 0,
            borderDash: dash,
            pointStyle: dataInfoFill(labels.length, 'circle', point, 'back'),
            pointRadius: dataInfoFill(labels.length, 0, 12, 'back'),
            pointHoverRadius: dataInfoFill(labels.length, 0, 14, 'back'),
            pointBorderColor: 'white',
            pointRotation: rotation,
            data: fillArr(labels.length - 2, NaN).concat(data.slice(-2))
          }
        ]
      }
    );
    commit(
      'SET_OPTIONS',
      {
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
              padding: 12,
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            gridLines: {
              drawBorder: false,
              color: axisYColors(phases, labels, data)
            },
            ticks: {
              stepSize: 1,
              min: 0,
              max: 10,
              fontColor: '#9E9E9E',
              padding: 12,
              callback: function(value, index, values) {
                return phases[value] || '';
              }
            }
          }]
        }
      }
    )
  }
};

export const mutations = {
  SET_CHART_DATA: (state, obj) => {
    state.chartdata = obj;
  },
  SET_OPTIONS: (state, obj) => {
    state.options = obj;
  },
};
