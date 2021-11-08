<template>
  <graph-layout :span="24" v-if="topDataStandards">
    <translate :parameters="{ top: dataStandardsCount }" class="kpiHeader">
      Top {top} ‘Data standards’ (by occurrences)
    </translate>
    <template #graph>
      <horizontal-bar v-if="topDataStandards" :chart-data="topDataStandards.chartData || {}" :options="topDataStandards.options" :height="400" />
    </template>
  </graph-layout>
</template>

<script>
import { objectToQueryString } from '@/utilities/charts'
import GraphLayout from '@/components/common/charts/widgets/GraphLayout'
import { mapState } from 'vuex'
import sortBy from 'lodash/sortBy'

export default {
  name: 'TopDataStandards',
  components: {
    GraphLayout
  },
  data() {
    return {
      topDataStandards: false
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapState({
      state: state => state.charts.polarA
    })
  },
  methods: {
    chunkString(str, n) {
      let arr = str?.split(' ')
      let result = []
      let subStr = arr[0]
      for (let i = 1; i < arr.length; i++) {
        let word = arr[i]
        if (subStr.length + word.length + 1 <= n) {
          subStr = subStr + ' ' + word
        } else {
          result.push(subStr)
          subStr = word
        }
      }
      if (subStr.length) {
        result.push(subStr)
      }
      return result
    },
    async fetchData() {

      const base = '/api/kpi'
      const dataStandardsResponse = await this.$axios.get('/api/projects/structure/')
      const hfa = await this.$axios.get(`${base}/data-standards/${objectToQueryString(this.state.filters)}`)
      const monthsOfStandards = hfa.data
      const interoperability_standards = dataStandardsResponse.data.interoperability_standards

      const splitLabel = str => {
        if (str.length > 30) {
          return this.chunkString(str, 30)
        }
        return str
      }
      const lineBarConfig = (datasets, options, labels = []) => {
        return {
          chartData: {
            labels,
            datasets
          },
          options
        }
      }
      const datasetGen = ({ type, colors, data, legendLabels, thickness }) => {
        if (type === 'line') {
          return colors.map((color, i) => datasetConfigLine(color, data[i]))
        }
        return colors.map((color, i) => datasetConfigBar(color, data[i], legendLabels[i], thickness))
      }
      const datasetConfigBar = (color, data, label, thickness = 'flex') => {
        return {
          backgroundColor: color,
          barThickness: thickness,
          label,
          data
        }
      }
      const optionsHorizontalBarConfig = (tooltip, click = false) => {
        return {
          ...generalOptions,
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawTicks: false
                },
                ticks: {
                  min: 0,
                  stepSize: 10
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  drawOnChartArea: false,
                  drawTicks: false
                }
              }
            ]
          },
          tooltips: {
            ...generalTooltipSettings(tooltip, '', 'bar')
          },
          onHover: event => {
            if (click) {
              event.target.style.cursor = 'pointer'
            }
          }
        }
      }
      const generalOptions = {
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
      const generalTooltipSettings = (tooltip, xTitle, type = 'line') => {
        return {
          backgroundColor: '#474747',
          displayColors: false,
          xPadding: 10,
          yPadding: 8,
          callbacks: {
            title(tooltipItems, data) {
              let title = ''
              if (type === 'line') {
                if (tooltip) {
                  title = `${tooltipItems[0].yLabel} ${tooltip}`
                } else {
                  title = `${tooltipItems[0].value} ${data.datasets[tooltipItems[0].datasetIndex].label}`
                }
              } else {
                title = `${tooltip.title} ${tooltipItems[0].value}`
              }
              return title
            },
            label(tooltipItems, data) {
              if (type === 'line') {
                return `${tooltipItems.label}`
              }
              return `${tooltip.subtitle}`
            }
          }
        }
      }

      const dataStandards = interoperability_standards.map(standard => {
        return {
          ...standard,
          total: monthsOfStandards.reduce((total, m) => {
            const amount = Object.keys(m.standards).find(key => m.standards[key] == standard.id)
            return amount ? total + parseInt(amount) : total
          }, 0)
        }
      })

      let totalsOfStandardsSorted = sortBy(dataStandards, ['total'])
        .reverse()
        .splice(0, 20)

      const extract = (obj, key, split = false) => obj.map(d => (split ? splitLabel(d[key]) : d[key]))

      const settings = config => {
        const { type, colors, labels, data, tooltip, click } = config
        switch (type) {
          case 'line':
          case 'bar':
            return lineBarConfig(datasetGen(config), optionsLineBarConfig(config), labels)
          case 'horizontal-bar':
            return lineBarConfig(datasetGen(config), optionsHorizontalBarConfig(tooltip, click), labels)
          case 'doughnut':
            return doughnutConfig(colors, labels, data)
          case 'micro':
            return micro(colors, labels, data)
          case 'polar':
            return polar(colors, labels, data)
        }
      }

      //   console.log("interoperability thingy:")
      //   console.log(dataStandardsResponse)
      //   console.log(interoperability_standards)

      const dataStandardsLabels = extract(totalsOfStandardsSorted, 'name', true)

      const colorSetA = ['#49BCE8']

      this.topDataStandards = settings({
        type: 'horizontal-bar',
        colors: colorSetA,
        labels: dataStandardsLabels,
        legendLabels: [],
        tooltip: {
          title: 'Ocurrances:',
          subtitle: ''
        },
        data: [totalsOfStandardsSorted.map(t => t.total)]
      })
    },
    dataStandardsCount() {
      return this.topDataStandards.chartData?.datasets[0].data.length > 0 ? this.topDataStandards.chartData.datasets[0].data.length : 0
    }
  }
}
</script>

<style></style>
