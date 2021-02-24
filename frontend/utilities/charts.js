// stages calculations
export const phaseInfo = (type) => {
  let info = {};
  switch (type) {
    case 'Ended':
      info = {
        color: '#D86422',
        rotation: 180,
        dash: [],
        point: 'triangle'
      };
      break;
    case 'Start':
      info = {
        color: '#76BF41',
        rotation: 90,
        dash: [10, 5],
        point: 'triangle'
      };
      break;
    default:
      // color = '#E0E0E0';
      info = {
        color: '#008DC9',
        rotation: 0,
        dash: [],
        point: 'circle'
      };
      break;
  };
  return info;
};

export const lastLabelType = (arr) => arr[arr.length - 1][1];

export const fillArr = (len, fill) => new Array(len).fill(fill);

export const axisYColors = (phases, labels, data) => {
  const axisColors = fillArr(phases.length, '#E0E0E0');
  axisColors[data[data.length - 1]] = phaseInfo(lastLabelType(labels)).color;
  return axisColors.reverse();
};

export const dataInfoFill = (len, fill, change = undefined, type = 'front') => {
  const arrFill = fillArr(len, fill);

  if (change) {
    if (type === 'front') {
      arrFill[0] = change;
      return arrFill;
    }
    arrFill[arrFill.length - 1] = change;
    return arrFill;
  }
  return arrFill;
};

// general graph setups
export const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// doughnut
const colorSetA = ["#9ACB67", "#FFCF3F", "#BABABB", "#E84F48"];
const colorSetB = ["#FFCF3F", "#FEAB7D", "#9ACB67", "#49BCE8"];
const colorSetC = ["#FFCF3F", "#EF8A85", "#9ACB67", "#5F72B5"];
const colorSetD = ["#9ACB67", "#E84F48"];
const colorSetE = ["#FFCE3D", "#FEAB7D", "#49BCE8", "#5F72B5", "#9ACB67"];

const customTooltip = {
  // Disable the on-canvas tooltip
  enabled: false,
  custom(tooltip) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = '<section></section>'
      document.body.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
      return bodyItem.lines;
    }

    // Set Text
    if (tooltip.body) {
      var titleLines = tooltip.title || [];
      var bodyLines = tooltip.body.map(getBody);

      var innerHtml = '';
      bodyLines.forEach(function(body, i) {
        var colors = tooltip.labelColors[i];
        var style = 'background:' + colors.backgroundColor;
        style += '; border-color:' + colors.borderColor;
        style += '; border-width: 2px';
        var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
        innerHtml += span + '<p>' + body + '</p>';
      });

      var htmlRoot = tooltipEl.querySelector('section');
      htmlRoot.innerHTML = innerHtml;
    }

    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY + 'px';
    tooltipEl.style.fontFamily = tooltip._fontFamily;
    tooltipEl.style.fontSize = tooltip.fontSize;
    tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.pointerEvents = 'none';
  }

}

const doughnutConfig = (colorSet, labels = []) => {
  return {
    chartData: {
      labels,
      datasets: [
        {
          backgroundColor: colorSet,
          pointRadius: 0,
          lineTension: 0,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {...customTooltip }
    },
  }
};

export const doughnutA = doughnutConfig(colorSetA);
export const doughnutB = doughnutConfig(colorSetB);
export const doughnutC = doughnutConfig(colorSetC);
export const doughnutD = doughnutConfig(colorSetD);

// Lines and Bar config
const datasetConfigLine = (color) => {
  return {
    borderColor: color,
    lineTension: 0,
    fill: false,
    // points
    pointRadius: 5,
    pointBorderWidth: 4,
    pointBackgroundColor: "#ffffff",
    pointBorderColor: color,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: color,
    pointHoverBorderWidth: 3,
  };
};

const scaleLabelConfigLine = (label) => {
  return {
    display: true,
    labelString: label,
    fontStyle: "bold",
    fontColor: "#485465",
    lineHeight: 3,
  };
};

const optionsLineBarConfig = (xTitle, yTitle) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          offset: true,
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false,
          },
          scaleLabel: {
            ...scaleLabelConfigLine(xTitle),
          },
          ticks: {
            fontSize: 10,
            padding: 15,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawTicks: false,
          },
          scaleLabel: {
            ...scaleLabelConfigLine(yTitle),
          },
          ticks: {
            fontSize: 10,
            padding: 15,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: "#474747",
      displayColors: false,
      xPadding: 10,
      yPadding: 8,
      titleAlign: "center",
      bodyAlign: "center",
      callbacks: {
        title(item) {
          return `${item[0].yLabel} API keys`
        },
        label(item) {
          return `${item.label} ${xTitle}`
        },
      }
    },
  };
};

const optionsHorizontalBarConfig = () => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawTicks: false,
          },

          ticks: {
            fontSize: 10,
            padding: 15,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            fontSize: 10,
            padding: 15,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: "#474747",
      displayColors: false,
      xPadding: 10,
      yPadding: 8,
      callbacks: {
        title(item) {
          return `Ocurrances: ${item[0].value}`
        },
        label(item) {
          return "Click to see Heatlh Focus Areas"
        },
      }
    },
    onHover: (event) => {
      event.target.style.cursor = 'pointer';
    },
  };
};

const lineBarConfig = (datasets, options, labels = monthLabels) => {
  return {
    chartData: {
      labels,
      datasets,
    },
    options,
  }
};

export const lineA = lineBarConfig(
  [datasetConfigLine("#49BCE8")],
  optionsLineBarConfig("2019", "Growth of project")
);
export const lineB = lineBarConfig(
  [datasetConfigLine("#49BCE8"), datasetConfigLine("#99CA67")],
  optionsLineBarConfig("2019", "# of users")
);
export const horizontalBarA = lineBarConfig(
  [{ backgroundColor: "#49BCE8" }],
  optionsHorizontalBarConfig()
);
export const barA = lineBarConfig(
  [ { backgroundColor: "#49BCE8" }, { backgroundColor: "#99CA67" }],
  optionsLineBarConfig("2018", "Growth of users")
);

// micro line chart
export const micro = {
  chartData: {
    labels: [],
    datasets: [
      {
        backgroundColor: "#E8F6FD",
        borderColor: "#22ADE3",
        pointRadius: 0,
        lineTension: 0,
      },
    ],
  },
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
};

// polar area
export const polarA = {
  chartData: {
    labels: [],
    datasets: [
      {
        backgroundColor: colorSetE,
        pointRadius: 0,
        lineTension: 0,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scale: {
      gridLines: {
        borderDash: [6],
        borderDashOffset: 10,
        color: "#D8D1C9",
        z: 1,
      },
      ticks: {
        fontSize: 10,
        fontStyle: "bold",
        fontColor: "#D8D1C9",
        z: 1,
        showLabelBackdrop: false,
        stepSize: 20,
        padding: 20,
      },
    },
    tooltips: {...customTooltip }
  },
};

// export full general config
export const chartsSetup = {
  micro,
  doughnutA,
  doughnutB,
  doughnutC,
  doughnutD,
  lineA,
  lineB,
  horizontalBarA,
  barA,
  polarA,
};
