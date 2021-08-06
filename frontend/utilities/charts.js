// stages calculations
export const phaseInfo = type => {
  let info = {}
  switch (type) {
  case 'Ended':
    info = {
      color: '#D86422',
      rotation: 180,
      dash: [],
      point: 'triangle'
    }
    break
  case 'Start':
    info = {
      color: '#76BF41',
      rotation: 90,
      dash: [10, 5],
      point: 'triangle'
    }
    break
  default:
    // color = '#E0E0E0';
    info = {
      color: '#008DC9',
      rotation: 0,
      dash: [],
      point: 'circle'
    }
    break
  }
  return info
}

export const lastLabelType = arr => arr[arr.length - 1][1]

export const fillArr = (len, fill) => new Array(len).fill(fill)

export const axisYColors = (phases, labels, data) => {
  const axisColors = fillArr(phases.length, '#E0E0E0')
  axisColors[data[data.length - 1]] = phaseInfo(lastLabelType(labels)).color
  return axisColors.reverse()
}

export const dataInfoFill = (len, fill, change = undefined, type = 'front') => {
  const arrFill = fillArr(len, fill)

  if (change) {
    if (type === 'front') {
      arrFill[0] = change
      return arrFill
    }
    arrFill[arrFill.length - 1] = change
    return arrFill
  }
  return arrFill
}

// general setup for graph types
// tooltips
const customTooltip = {
  // Disable the on-canvas tooltip
  enabled: false,
  custom (tooltip) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip')

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'
      tooltipEl.innerHTML = '<section></section>'
      document.body.appendChild(tooltipEl)
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0
      return
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform')
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign)
    } else {
      tooltipEl.classList.add('no-transform')
    }

    function getBody (bodyItem) {
      return bodyItem.lines
    }

    // Set Text
    if (tooltip.body) {
      // const titleLines = tooltip.title || []
      const bodyLines = tooltip.body.map(getBody)

      let innerHtml = ''
      bodyLines.forEach(function (body, i) {
        const colors = tooltip.labelColors[i]
        let style = 'background:' + colors.backgroundColor
        style += '; border-color:' + colors.borderColor
        style += '; border-width: 2px'
        const span =
          '<span class="chartjs-tooltip-key" style="' + style + '"></span>'
        innerHtml += span + '<p>' + body + '</p>'
      })

      const htmlRoot = tooltipEl.querySelector('section')
      htmlRoot.innerHTML = innerHtml
    }

    const position = this._chart.canvas.getBoundingClientRect()

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.left =
      position.left + window.pageXOffset + tooltip.caretX + 'px'
    tooltipEl.style.top =
      position.top + window.pageYOffset + tooltip.caretY + 'px'
    tooltipEl.style.fontFamily = tooltip._fontFamily
    tooltipEl.style.fontSize = tooltip.fontSize
    tooltipEl.style.fontStyle = tooltip._fontStyle
    tooltipEl.style.pointerEvents = 'none'
  }
}
const customStackedTooltip = {
  // Disable the on-canvas tooltip
  enabled: false,
  custom (tooltip) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip')

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'
      tooltipEl.innerHTML = '<section></section>'
      document.body.appendChild(tooltipEl)
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0
      return
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform')
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign)
    } else {
      tooltipEl.classList.add('no-transform')
    }

    function getBody (bodyItem) {
      return bodyItem.lines
    }

    // Set Text
    if (tooltip.body) {
      // const titleLines = tooltip.title || []
      const bodyLines = tooltip.body.map(getBody)

      let innerHtml = ''
      bodyLines.forEach(function (body, i) {
        const colors = tooltip.labelColors[i]
        const style = `background: ${colors.backgroundColor}`
        const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`
        innerHtml += `<li>${span}${body}</li>`
      })

      const htmlRoot = tooltipEl.querySelector('section')
      htmlRoot.innerHTML = `<ul class="tooltip-list">${innerHtml}</ul>`
    }

    const position = this._chart.canvas.getBoundingClientRect()

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.left =
      position.left + window.pageXOffset + tooltip.caretX + 'px'
    tooltipEl.style.top =
      position.top + window.pageYOffset + tooltip.caretY + 'px'
    tooltipEl.style.fontFamily = tooltip._fontFamily
    tooltipEl.style.fontSize = tooltip.fontSize
    tooltipEl.style.fontStyle = tooltip._fontStyle
    tooltipEl.style.pointerEvents = 'none'
  }
}
const generalTooltipSettings = (tooltip, xTitle, type = 'line') => {
  return {
    backgroundColor: '#474747',
    displayColors: false,
    xPadding: 10,
    yPadding: 8,
    callbacks: {
      title (tooltipItems, data) {
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
      label (tooltipItems, data) {
        if (type === 'line') {
          return `${tooltipItems.label}`
        }
        return `${tooltip.subtitle}`
      }
    }
  }
}
const tooltipType = (stacked, tooltip, xTitle) => {
  if (stacked) {
    return { tooltips: { mode: 'index', ...customStackedTooltip } }
  }
  return {
    tooltips: {
      titleAlign: 'center',
      bodyAlign: 'center',
      ...generalTooltipSettings(tooltip, xTitle)
    }
  }
}

// general setups
const ticks = {
  fontSize: 10,
  padding: 15
}
const generalOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false
  }
}

// Lines and Bar config
const datasetConfigLine = (color, data) => {
  return {
    borderColor: color,
    lineTension: 0,
    fill: false,
    // points
    pointRadius: 5,
    pointBorderWidth: 4,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: color,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: color,
    pointHoverBorderWidth: 3,
    data
  }
}
const datasetConfigBar = (color, data, label, thickness = 'flex') => {
  return {
    backgroundColor: color,
    barThickness: thickness,
    label,
    data
  }
}
const scaleLabelConfigLine = label => {
  return {
    display: true,
    labelString: label,
    fontStyle: 'bold',
    fontColor: '#485465',
    lineHeight: 3
  }
}
const optionsLineBarConfig = ({ scales, tooltip, stacked }) => {
  console.log('🚀 ~ file: charts.js ~ line 278 ~ optionsLineBarConfig ~ stacked', stacked)
  console.log('🚀 ~ file: charts.js ~ line 278 ~ optionsLineBarConfig ~ tooltip', tooltip)
  console.log('🚀 ~ file: charts.js ~ line 278 ~ optionsLineBarConfig ~ scales', scales)
  return {
    ...generalOptions,
    scales: {
      xAxes: [
        {
          offset: true,
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false
          },
          scaleLabel: {
            ...scaleLabelConfigLine(scales.x)
          },
          ticks,
          stacked
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawTicks: false
          },
          scaleLabel: {
            ...scaleLabelConfigLine(scales.y)
          },
          ticks,
          stacked
        }
      ]
    },
    ...tooltipType(stacked, tooltip, scales.x)
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
          ticks
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks
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
const lineBarConfig = (datasets, options, labels = []) => {
  return {
    chartData: {
      labels,
      datasets
    },
    options
  }
}

// doughnut
const doughnutConfig = (colorSet, labels = [], data) => {
  return {
    chartData: {
      labels,
      datasets: [
        {
          backgroundColor: colorSet,
          pointRadius: 0,
          lineTension: 0,
          data
        }
      ]
    },
    options: {
      ...generalOptions,
      tooltips: { ...customTooltip }
    }
  }
}

// micro line chart
export const micro = (colors, labels, datasets) => {
  return {
    chartData: {
      labels,
      datasets: datasets.map(data => {
        return {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          pointRadius: 0,
          lineTension: 0,
          data
        }
      })
    },
    options: {
      ...generalOptions,
      tooltips: {
        enabled: false
      },
      animation: {},
      scales: {
        xAxes: [
          {
            display: false,
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  }
}

// polar area
export const polar = (colors, labels = [], datasets = []) => {
  return {
    chartData: {
      labels,
      datasets: datasets.map(data => {
        return {
          backgroundColor: colors,
          pointRadius: 0,
          lineTension: 0,
          data
        }
      })
    },
    options: {
      ...generalOptions,
      scale: {
        gridLines: {
          borderDash: [6],
          borderDashOffset: 10,
          color: '#D8D1C9',
          z: 1
        },
        ticks: {
          fontSize: 10,
          fontStyle: 'bold',
          fontColor: '#D8D1C9',
          z: 1,
          showLabelBackdrop: false,
          stepSize: 20,
          padding: 20
        }
      },
      tooltips: { ...customTooltip }
    }
  }
}

const datasetGen = ({ type, colors, data, legendLabels, thickness }) => {
  if (type === 'line') {
    return colors.map((color, i) => datasetConfigLine(color, data[i]))
  }
  return colors.map((color, i) =>
    datasetConfigBar(color, data[i], legendLabels[i], thickness)
  )
}
export const settings = config => {
  console.log('🚀 ~ file: charts.js ~ line 464 ~ config', config)
  const { type, colors, labels, data, tooltip, click } = config
  switch (type) {
  case 'line':
  case 'bar':
    return lineBarConfig(
      datasetGen(config),
      optionsLineBarConfig(config),
      labels
    )
  case 'horizontal-bar':
    return lineBarConfig(
      datasetGen(config),
      optionsHorizontalBarConfig(tooltip, click),
      labels
    )
  case 'doughnut':
    return doughnutConfig(colors, labels, data)
  case 'micro':
    return micro(colors, labels, data)
  case 'polar':
    return polar(colors, labels, data)
  }
}

// Data generation utilities
const chunkString = (str, len) => {
  const size = Math.ceil(str.length / len)
  const r = Array(size)
  let offset = 0

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len)
    offset += len
  }

  return r
}
export const splitLabel = str => {
  if (str.length > 30) {
    return chunkString(str, 30)
  }
  return str
}

export const randomData = (length, range = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * range))
}

export const randomNumber = (max = 100) =>
  Math.floor(Math.random() * Math.floor(max))

export const legendGenerator = (labels, colors, data = []) => {
  return labels.map((label, i) => {
    return { label, color: colors[i], value: data[i] || 0 }
  })
}

export const extract = (obj, key) => obj.map(d => d[key])

export const extractWithLabel = (obj, key, label) => {
  return {
    ...obj.map(d => d[key]),
    label
  }
}

export const objectToQueryString = queryParameters => {
  return queryParameters
    ? Object.entries(queryParameters).reduce(
      (queryString, [key, val], index) => {
        const symbol = queryString.length === 0 ? '?' : '&'
        queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : ''
        return queryString
      },
      ''
    )
    : ''
}
