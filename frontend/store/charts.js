// utilities
import {
  dataInfoFill,
  fillArr,
  phaseInfo,
  lastLabelType,
  settings,
  splitLabel,
  randomData,
  randomNumber,
  legendGenerator,
  extract,
  objectToQueryString
} from '@/utilities/charts'
import { formatDate } from '@/utilities/projects'
import { isBefore, format } from 'date-fns'
import sumBy from 'lodash/sumBy'
import sortBy from 'lodash/sortBy'

export const state = () => ({
  stages: {
    chartData: {},
    options: {}
  },
  // general chart system
  // example for resumes widgets
  incoming: 0,
  previous: 0,
  // charts
  micro: {},
  polarA: {},
  lineA: {},
  lineB: {},
  lineC: {},
  barA: {},
  barB: {},
  horizontalBarA: {},
  horizontalBarB: {},
  doughnutA: {},
  doughnutB: {},
  doughnutC: {},
  doughnutD: {},
  // legends
  polarALegend: [],
  noStageDataSum: 0,
  doughnutALegend: [],
  doughnutBLegend: [],
  doughnutCLegend: [],
  doughnutDLegend: {},
  monthlyUserLegend: [],
  projectStatusLegend: [],
  countryTable: [],
  // back bar hfa system
  back: [],
  subtitle: {},
  // filters
  loading: false,
  filters: {
    country: undefined,
    investor: undefined,
    from: undefined,
    to: undefined
  },
  projectStructure: {}
})

export const actions = {
  getStageData ({ commit, rootState }, stages) {
    // phases
    const phases = [''].concat(stages.map(i => i.name))
    // notes
    const notes = [''].concat(stages.map(i => i.note))

    // labels
    const start = formatDate(rootState.project.start_date)
    const end = formatDate(rootState.project.end_date)
    const today = formatDate(new Date())

    const labels = [start].concat(
      stages.filter(i => i.checked).map(i => i.date)
    )
    // const lastLabel = labels[labels.length - 1];

    // data
    const data = [0].concat(
      stages.filter(i => i.checked).map(i => phases.indexOf(i.name))
    )
    const lastDataPoint = data[data.length - 1]

    // today and end date data points, if needed
    if ((end && isBefore(today, end)) || end === '1970-01-01') {
      data.push(lastDataPoint + 1)
      labels.push([today, 'Today'])
    }
    if (end && end !== '1970-01-01') {
      data.push(data[data.length - 1])
      labels.push([end, 'Ended'])
      notes.push(rootState.project.end_date_note)
    }

    const lLen = labels.length
    // start calc
    const startData = data.slice(0, 1)
    // end calc
    const endData =
      Array.isArray(labels[lLen - 1]) && labels[lLen - 1][1] === 'Ended'
        ? fillArr(lLen - 1, NaN).concat(data.slice(-1))
        : []
    // today calc
    const checkLabels = labels.filter(i => Array.isArray(i))
    const todayIncludes = checkLabels.filter(i => i[1] === 'Today')
    const todayData =
      todayIncludes.length > 0
        ? fillArr(lLen - checkLabels.length - 1, NaN).concat(
          checkLabels.length > 1 ? data.slice(-3, -1) : data.slice(-2)
        )
        : []
    // stages calc
    const stagesData =
      todayIncludes.length > 0 ? data.slice(0, -checkLabels.length) : data

    const { color, rotation, dash, point } = phaseInfo(lastLabelType(labels))

    const datasets = Object.freeze([
      {
        borderColor: '#558B2F',
        pointBackgroundColor: '#558B2F',
        fill: false,
        lineTension: 0,
        pointStyle: dataInfoFill(labels.length - 1, 'circle', 'triangle'),
        pointRadius: dataInfoFill(labels.length - 1, 6, 12),
        pointHoverRadius: dataInfoFill(labels.length - 1, 8, 14),
        pointBorderColor: 'white',
        pointRotation: 90,
        data: startData
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
        data: endData
      },
      {
        borderColor: '#008DC9',
        pointBackgroundColor: '#008DC9',
        fill: false,
        lineTension: 0,
        pointStyle: dataInfoFill(labels.length - 1, 'circle', 'circle'),
        pointRadius: dataInfoFill(labels.length - 1, 6, 0),
        pointHoverRadius: dataInfoFill(labels.length - 1, 8, 0),
        pointBorderColor: 'white',
        pointRotation: 90,
        data: stagesData
      },
      {
        borderColor: '#B9B9B9',
        pointBackgroundColor: 'white',
        fill: false,
        lineTension: 0,
        borderDash: [10, 5],
        pointStyle: dataInfoFill(labels.length, 'circle', 'circle', 'back'),
        pointRadius: dataInfoFill(labels.length, 5, 0, 'back'),
        pointHoverRadius: dataInfoFill(labels.length, 7, 0, 'back'),
        pointBorderColor: '#B9B9B9',
        pointBorderWidth: 2,
        pointRotation: 0,
        data: todayData
      }
    ])
    const chartData = { labels, datasets }

    commit('SET_STAGES_CHART_DATA', chartData)
    commit('SET_STAGES_OPTIONS', {
      maintainAspectRatio: false,
      defaultFontColor: '#474747',
      defaultFontSize: 12,
      tooltips: {
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {
            return null
          },
          title: (tooltipItem, data) => {
            const { xLabel, yLabel } = tooltipItem[0]
            if (phases[yLabel] === '') {
              return xLabel
            }
            if (Array.isArray(xLabel)) {
              return [xLabel[0], xLabel[1]]
            }
            return [xLabel, phases[yLabel]]
          },
          footer: (tooltipItem, data) => {
            const { xLabel, yLabel } = tooltipItem[0]
            if (xLabel.includes('Ended')) {
              return `Note: ${notes[notes.length - 1]}`.match(/.{1,38}/g)
            }
            return notes[yLabel]
              ? `Note: ${notes[yLabel]}`.match(/.{1,38}/g)
              : null
          }
        },
        backgroundColor: '#474747',
        xPadding: 12,
        yPadding: 12,
        titleMarginBottom: 0,
        footerMarginTop: 8,
        footerFontStyle: 'normal',
        footerAlign: 'center',
        titleAlign: 'center',
        titleFontSize: 12,
        bodyFontSize: 12,
        bodyAlign: 'center',
        displayColors: false
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            offset: true,
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              padding: 12
              // fontStyle: 'bold'
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              drawBorder: false
              // color: axisYColors(phases, labels, data)
            },
            ticks: {
              stepSize: 1,
              min: 0,
              max: stages.length,
              fontColor: '#9E9E9E',
              padding: 12,
              callback: function (value, index, values) {
                return value > 0 ? `${value}. ${phases[value]}` : phases[value]
              }
            }
          }
        ]
      }
    })
  },
  async getHealthFocusAreas ({ state, commit }, hfcID = 0) {
    const loadState = state.loading
    if (!state.loading) commit('SET_LOADING', true)    
    let catParam = ''
    let hfMode ='categories'
    let healthFocusList = []
    if (hfcID > 0) {
      catParam = `/${hfcID}`
      hfMode = 'hfa'
      healthFocusList = state.projectStructure.health_focus_areas.find(hfc => hfc.id === hfcID).health_focus_areas
    } else {
      healthFocusList = state.projectStructure.health_focus_areas
    }
    const hfaKPI = await this.$axios.get(`/api/kpi/health-categories${catParam}/${objectToQueryString(state.filters)}`)   
    let hfaLabels = []
    let hfaOccurence = []
    const hfcMonths = hfaKPI.data
    if (hfcMonths.length > 0) {
      Object.keys(hfcMonths[0][hfMode]).forEach(hfID => {
        const hfa = healthFocusList.find(h => h.id == hfID)
        if (hfa) {
          hfaLabels.push(hfa.name)
          let occurence = 0
          hfcMonths.forEach(m => occurence += m[hfMode][hfID])
          hfaOccurence.push(occurence)
        }
      })
    }
    if (!loadState) {
      commit('SET_LOADING', false)
    }
    return { hfaLabels, hfaOccurence }
  },
  async getDashboardData ({ state, commit, dispatch, rootGetters }, { func, refresh }) {
    commit('SET_LOADING', true)

    const base = '/api/kpi'
    const kpi = await Promise.all([
      this.$axios.get(`${base}/users/${objectToQueryString(state.filters)}`),
      this.$axios.get(`${base}/tokens/${objectToQueryString(state.filters)}`),
      this.$axios.get(`${base}/project-status/${objectToQueryString(state.filters)}`),
      this.$axios.get(`${base}/project-stages/${objectToQueryString(state.filters)}`),
      this.$axios.get('/api/projects/structure/'),
      this.$axios.get(`${base}/data-standards/${objectToQueryString(state.filters)}`),
      this.$axios.get(`${base}/hfa/${objectToQueryString(state.filters)}`),
      this.$axios.get(`${base}/health-categories/${objectToQueryString(state.filters)}`)
    ])    
    commit('setValue', { key: 'projectStructure', val: kpi[4].data })
    const { interoperability_standards, stages, health_focus_areas: healthcategory } = kpi[4].data
    const users = kpi[0].data
    const tokens = kpi[1].data
    const projectStatus = kpi[2].data
    
    // Prepare Data standards data
    const projectStages = stages.map(s => {
      return {
        ...s,
        total: sumBy(kpi[3].data.map(i => i.stages), s.id)
      }
    })    
    const monthsOfStandards = kpi[5].data
    const dataStandards = interoperability_standards.map((standard) => {
      return {
        ...standard,
        total: monthsOfStandards.reduce((total, m) => {
          const amount =  Object.keys(m.standards).find(key => m.standards[key] == standard.id)
          return amount ? total + parseInt(amount) : total
        }, 0)
      }
    })
    let totalsOfStandardsSorted = sortBy(dataStandards, ['total']).reverse().splice(0, 20)

    const noStageDataSum = kpi[3].data.reduce((sum, stage) => {
      return stage.stages.no_data + sum
    }, 0)
    commit('setValue', { key: 'noStageDataSum', val: noStageDataSum })
  
    // Prepare Health Focus Areas data
    let hfaLabels = []
    let hfaOccurence = []
    const hfcMonths = kpi[7].data
    if (hfcMonths.length > 0) {
      Object.keys(hfcMonths[0].categories).forEach((cat,index) => {
        const hc = healthcategory.find(h => h.id === index)
        if (hc) {
          hfaLabels.push(hc.name)
          let occurence = 0
          hfcMonths.forEach(m => occurence += m.categories[index])
          hfaOccurence.push(occurence)
        }
      })
    }

    const hfaMonths = kpi[6].data
    let hfaCoveredAreasSum = 0
    let hfaNotCoveredAreasSum = 0
    let hfaCoveredAreas = []
    let hfaNotCoveredAreas = []
    let hfaCoveredSubAreas = []
    let hfaNotCoveredSubAreas = []

    healthcategory.forEach(hc => {
      hc.health_focus_areas.forEach(ha => {
        let covered = false
        hfaMonths.forEach(m => {
          if (!covered) covered = m.hfa[hc.id][ha.id]
        })
        if (covered) {
          hfaCoveredSubAreas.push({
            ...ha,
            hfaCategory: hc
          })
          hfaCoveredAreasSum++
        } else {
          hfaNotCoveredSubAreas.push({
            ...ha,
            hfaCategory: hc
          })
          hfaNotCoveredAreasSum++
        }
      })
    })

    let lastHfaCategoryID = 0
    hfaCoveredSubAreas.forEach(hfaSub => {
      if (lastHfaCategoryID !== hfaSub.hfaCategory.id) {
        hfaCoveredAreas.push({
          name: hfaSub.hfaCategory.name,
          subareas: [hfaSub.name]
        })
        lastHfaCategoryID = hfaSub.hfaCategory.id
      } else {
        hfaCoveredAreas[hfaCoveredAreas.length-1].subareas.push(hfaSub.name)
      }
    })

    lastHfaCategoryID = 0
    hfaNotCoveredSubAreas.forEach(hfaSub => {
      if (lastHfaCategoryID !== hfaSub.hfaCategory.id) {
        hfaNotCoveredAreas.push({
          name: hfaSub.hfaCategory.name,
          subareas: [hfaSub.name]
        })
        lastHfaCategoryID = hfaSub.hfaCategory.id
      } else {
        hfaNotCoveredAreas[hfaNotCoveredAreas.length-1].subareas.push(hfaSub.name)
      }
    })
    
    // color sets (should be dynamic?)
    const colorSetA = ['#49BCE8']
    const colorSetB = ['#49BCE8', '#99CA67']
    // const colorSetC = ['#9ACB67', '#FFCF3F', '#BABABB', '#E84F48']
    const colorSetC = ['#BABABB', '#9ACB67', '#FFCF3F', '#49BCE8', '#E84F48']
    const colorSetD = ['#FFCF3F', '#FEAB7D', '#9ACB67', '#49BCE8']
    const colorSetE = ['#FFCF3F', '#EF8A85', '#9ACB67', '#5F72B5']
    const colorSetF = ['#9ACB67', '#E84F48']
    const colorSetG = [
      '#757575',
      '#1A527B',
      '#1577AC',
      '#4897B3',
      '#66C6D0',
      '#87F7EF',
      '#713ED2',
      '#E2D83B',
      '#1FA075',
      '#BF2999',
      '#D1632E',
      '#E5A131'
    ]

    // label sets (should be dynamic?)
    const projectsLabels = [
      'Draft Projects',
      'Published Projects',
      'Publishable Projects',
      'Unpublished Projects',
      'Incoherent Projects'
    ]
    const govermentContributionLabels = [
      'No, they have not yet contributed',
      'Yes, they are contributing in-kind people or time',
      'Yes, there is a financial contribution through MOH budget',
      'Yes, MOH is fully funding the project'
    ]
    const distributionStatuesLabels = [
      'How many active?',
      'How many projects have ended?',
      'How many projects are complete?',
      'How many projects are discontinued?'
    ]
    const coverageLabels = ['Covered', 'Not covered']
    const dataStandardsLabels = extract(totalsOfStandardsSorted, 'name', true)
    const stageLabels = extract(projectStages, 'name')

    // data generation
    // stages
    const polarAData = extract(projectStages, 'total')
    const monthlyUserActivity = [
      extract(users, 'registered'),
      extract(users, 'active')
    ]

    // projects status data generation
    const draft = extract(projectStatus, 'draft')
    const published = extract(projectStatus, 'published')
    const publishable = extract(projectStatus, 'ready_to_publish')
    const unpublished = extract(projectStatus, 'unpublished')
    const deletable = extract(projectStatus, 'to_delete')

    const projectStatusMonthly = [
      draft,
      published,
      publishable,
      unpublished,
      deletable
    ]

    const projectSum = arr => {
      return arr.reduce((acc, val) => acc + val, 0)
    }

    const doughnutAData = [
      projectSum(draft),
      projectSum(published),
      projectSum(publishable),
      projectSum(unpublished),
      projectSum(deletable)
    ]
    const doughnutBData = randomData(govermentContributionLabels.length)
    const doughnutCData = randomData(distributionStatuesLabels.length)

    // initialization for graph
    commit(
      'SET_MICRO_GRAPH',
      settings({
        type: 'micro',
        colors: { bg: '#E8F6FD', border: '#22ADE3' },
        labels: randomData(10),
        data: [randomData(10)]
      })
    )

    commit(
      'SET_POLARA_GRAPH',
      settings({
        type: 'polar',
        colors: colorSetG,
        labels: stageLabels,
        data: [polarAData]
      })
    )

    commit(
      'SET_LINEA_GRAPH',
      settings({
        type: 'line',
        colors: colorSetA,
        scales: { x: 'Months', y: 'Growth of project' },
        labels: extract(projectStatus, 'date').map(d => format(d, 'YYYY-MMM')),
        tooltip: 'New projects',
        data: [extract(projectStatus, 'growth')]
      })
    )

    commit(
      'SET_LINEB_GRAPH',
      settings({
        type: 'line',
        colors: colorSetB,
        scales: { x: 'Months', y: '# of users' },
        labels: extract(users, 'date').map(d => format(d, 'YYYY-MMM')),
        tooltip: 'Users',
        data: monthlyUserActivity
      })
    )

    commit(
      'SET_LINEC_GRAPH',
      settings({
        type: 'line',
        colors: colorSetA,
        scales: { x: 'Months', y: '# of API keys' },
        labels: extract(tokens, 'date').map(d => format(d, 'YYYY-MMM')),
        tooltip: 'API keys',
        data: [extract(tokens, 'tokens')]
      })
    )

    commit(
      'SET_BARA_GRAPH',
      settings({
        type: 'bar',
        colors: colorSetB,
        scales: { x: 'Months', y: 'Growth of users' },
        labels: extract(users, 'date').map(d => format(d, 'YYYY-MMM')),
        legendLabels: ['New users', 'Active users'],
        tooltip: '',
        data: monthlyUserActivity
      })
    )

    commit(
      'SET_BARB_GRAPH',
      settings({
        type: 'bar',
        colors: colorSetC,
        scales: { x: 'Months', y: '# of projects' },
        labels: extract(projectStatus, 'date').map(d => format(d, 'YYYY-MMM')),
        legendLabels: projectsLabels,
        tooltip: '',
        data: projectStatusMonthly,
        stacked: true,
        thickness: 40
      })
    )
    commit(
      'SET_HORIZONTALBARA_GRAPH',
      settings({
        type: 'horizontal-bar',
        colors: colorSetA,
        labels: dataStandardsLabels,
        legendLabels: [],
        tooltip: {
          title: 'Ocurrances:',
          subtitle: ''
        },
        data: [totalsOfStandardsSorted.map( t => t.total)]
      })
    )
    commit(
      'SET_HORIZONTALBARB_GRAPH',
      settings({
        type: 'horizontal-bar',
        colors: colorSetA,
        labels: hfaLabels,
        legendLabels: [],
        tooltip: {
          title: 'Ocurrances:',
          subtitle: 'Click to see Heatlh Focus Areas'
        },
        click: true,
        data: [hfaOccurence]
      })
    )
    commit(
      'SET_DOUGHNUTA_GRAPH',
      settings({
        type: 'doughnut',
        colors: colorSetC,
        labels: projectsLabels,
        data: doughnutAData
      })
    )
    commit(
      'SET_DOUGHNUTB_GRAPH',
      settings({
        type: 'doughnut',
        colors: colorSetD,
        labels: govermentContributionLabels,
        data: doughnutBData
      })
    )
    commit(
      'SET_DOUGHNUTC_GRAPH',
      settings({
        type: 'doughnut',
        colors: colorSetE,
        labels: distributionStatuesLabels,
        data: doughnutCData
      })
    )
    commit(
      'SET_DOUGHNUTD_GRAPH',
      settings({
        type: 'doughnut',
        colors: colorSetF,
        labels: coverageLabels,
        data: [hfaCoveredAreasSum, hfaNotCoveredAreasSum]
      })
    )
    // legends
    commit(
      'SET_POLARA_LEGEND',
      legendGenerator(stageLabels, colorSetG, polarAData)
    )
    commit(
      'SET_DOUGHNUTA_LEGEND',
      legendGenerator(projectsLabels, colorSetC, doughnutAData)
    )
    commit(
      'SET_DOUGHNUTB_LEGEND',
      legendGenerator(govermentContributionLabels, colorSetD, doughnutBData)
    )
    commit(
      'SET_DOUGHNUTC_LEGEND',
      legendGenerator(distributionStatuesLabels, colorSetE, doughnutCData)
    )
    commit(
      'SET_MONTHLY_USER_LEGEND',
      legendGenerator(['Monthly User Growth', 'Monthly Active User'], colorSetB)
    )
    // a lot of doubts here, nested info incoming
    commit('SET_DOUGHNUTD_LEGEND', {
      tabs: [
        // { name: this.$gettext("Covered"), color: "green", id: 1 },
        // { name: this.$gettext("Not Covered"), color: "red", id: 2 }
        { name: 'Covered', color: 'green', id: 1 },
        { name: 'Not Covered', color: 'red', id: 2 }
      ],
      contents: [
        {
          id: 1,
          icon: 'el-icon-check',
          color: 'green',
          areas: hfaCoveredAreas
        },
        {
          id: 2,
          icon: 'el-icon-close',
          color: 'red',
          areas: hfaNotCoveredAreas
        }
      ]
    })
    commit(
      'SET_PROJECT_STATUS_LEGEND',
      legendGenerator(projectsLabels, colorSetC)
    )
    commit(
      'SET_COUNTRY_TABLE',
      rootGetters['countries/getCountries'].map(country => {
        return {
          country: country.name,
          img: getFlagUrl(country.code),
          no: randomNumber(),
          pending: randomNumber(),
          yes: randomNumber()
        }
      })
    )

    // examples for random data
    commit('SET_INCOMING', randomNumber())
    commit('SET_PREVIOUS', randomNumber())
    // click function link
    commit('SET_BAR_CLICK', func)

    commit('SET_SUBTITLE', {})
    commit('SET_BACK', [])
    commit('SET_LOADING', false)
  },
  async handleBarClick ({ state, commit, dispatch }, { func, idx }) {
    const hc = state.projectStructure.health_focus_areas.find(hc => hc.name === state.horizontalBarB.chartData.labels[idx])
    const newStack = {
      label: state.horizontalBarB.chartData.labels[idx],
      value: state.horizontalBarB.chartData.datasets[0].data[idx]
    }
    commit('SET_BACK', [...state.back, newStack])
    commit('SET_SUBTITLE', newStack)
    const { hfaLabels, hfaOccurence } = await dispatch('getHealthFocusAreas', hc.id)
    const newDataSets = [{
      backgroundColor: '#49BCE8',
      barThickness: 'flex',
      data: hfaOccurence
    }]
    const updatedBar = {      
      options: {
        ...state.horizontalBarB.options,
        click: false
      },
      chartData: {
        datasets: newDataSets,
        labels: hfaLabels
      }
    }
    commit('SET_HORIZONTALBARB_GRAPH', updatedBar)
  },
  async handleBackClick ({ state, commit, dispatch }, { func }) {
    commit('SET_BACK', state.back.slice(0, state.back.length - 1))
    commit(
      'SET_SUBTITLE',
      state.back.length > 0 ? state.back[state.back.length - 1] : {}
    )
    const { hfaLabels, hfaOccurence } = await dispatch('getHealthFocusAreas')
    const newDataSets = [{
      backgroundColor: '#49BCE8',
      barThickness: 'flex',
      data: hfaOccurence
    }]
    const updatedBar = {
      options: {
        ...state.horizontalBarB.options,
        click: true
      },
      chartData: {
        datasets: newDataSets,
        labels: hfaLabels
      }
    }
    commit('SET_HORIZONTALBARB_GRAPH', updatedBar)
  },
  setFilters ({ state, commit }, filters) {
    commit('SET_FILTERS', filters)
  }
}

export const mutations = {
  setValue (state, { key, val }) {
    state[key] = val
  },
  SET_STAGES_CHART_DATA: (state, obj) => {
    state.stages.chartData = obj
  },
  SET_STAGES_OPTIONS: (state, obj) => {
    state.stages.options = obj
  },
  // general graphs
  SET_MICRO_GRAPH: (state, obj) => {
    state.micro = obj
  },
  SET_POLARA_GRAPH: (state, obj) => {
    state.polarA = obj
  },
  SET_BARA_GRAPH: (state, obj) => {
    state.barA = obj
  },
  SET_BARB_GRAPH: (state, obj) => {
    state.barB = obj
  },
  SET_HORIZONTALBARA_GRAPH: (state, obj) => {
    state.horizontalBarA = obj
  },
  SET_HORIZONTALBARB_GRAPH: (state, obj) => {
    state.horizontalBarB = obj
  },
  SET_LINEA_GRAPH: (state, obj) => {
    state.lineA = obj
  },
  SET_LINEB_GRAPH: (state, obj) => {
    state.lineB = obj
  },
  SET_LINEC_GRAPH: (state, obj) => {
    state.lineC = obj
  },
  SET_DOUGHNUTA_GRAPH: (state, obj) => {
    state.doughnutA = obj
  },
  SET_DOUGHNUTB_GRAPH: (state, obj) => {
    state.doughnutB = obj
  },
  SET_DOUGHNUTC_GRAPH: (state, obj) => {
    state.doughnutC = obj
  },
  SET_DOUGHNUTD_GRAPH: (state, obj) => {
    state.doughnutD = obj
  },
  SET_INCOMING: (state, val) => {
    state.incoming = val
  },
  SET_PREVIOUS: (state, val) => {
    state.previous = val
  },
  // legends
  SET_POLARA_LEGEND: (state, val) => {
    state.polarALegend = val
  },
  SET_DOUGHNUTA_LEGEND: (state, val) => {
    state.doughnutALegend = val
  },
  SET_DOUGHNUTB_LEGEND: (state, val) => {
    state.doughnutBLegend = val
  },
  SET_DOUGHNUTC_LEGEND: (state, val) => {
    state.doughnutCLegend = val
  },
  SET_DOUGHNUTD_LEGEND: (state, val) => {
    state.doughnutDLegend = val
  },
  SET_MONTHLY_USER_LEGEND: (state, val) => {
    state.monthlyUserLegend = val
  },
  SET_PROJECT_STATUS_LEGEND: (state, val) => {
    state.projectStatusLegend = val
  },
  SET_COUNTRY_TABLE: (state, val) => {
    state.countryTable = val
  },
  // click hfa system
  SET_BAR_CLICK: (state, func) => {
    state.horizontalBarB.options.onClick = func
  },
  SET_CLICK_LISTENER: (state, func) => {
    state.clickListener = func
  },
  SET_BACK: (state, val) => {
    state.back = val
  },
  SET_SUBTITLE: (state, val) => {
    state.subtitle = val
  },
  SET_FILTERS: (state, val) => {
    state.filters = val
  },
  SET_LOADING: (state, val) => {
    state.loading = val
  }
}

// tiny helper to get the url flag, to specific to be a utility
const getFlagUrl = code => {
  return `/static/flags/${code.toLowerCase()}.png`
}
