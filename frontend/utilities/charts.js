// stages calculations
export const phaseInfo = type => {
  let info = {};
  switch (type) {
    case "Ended":
      info = {
        color: "#D86422",
        rotation: 180,
        dash: [],
        point: "triangle"
      };
      break;
    case "Start":
      info = {
        color: "#76BF41",
        rotation: 90,
        dash: [10, 5],
        point: "triangle"
      };
      break;
    default:
      // color = '#E0E0E0';
      info = {
        color: "#008DC9",
        rotation: 0,
        dash: [],
        point: "circle"
      };
      break;
  }
  return info;
};

export const lastLabelType = arr => arr[arr.length - 1][1];

export const fillArr = (len, fill) => new Array(len).fill(fill);

export const axisYColors = (phases, labels, data) => {
  const axisColors = fillArr(phases.length, "#E0E0E0");
  axisColors[data[data.length - 1]] = phaseInfo(lastLabelType(labels)).color;
  return axisColors.reverse();
};

export const dataInfoFill = (len, fill, change = undefined, type = "front") => {
  const arrFill = fillArr(len, fill);

  if (change) {
    if (type === "front") {
      arrFill[0] = change;
      return arrFill;
    }
    arrFill[arrFill.length - 1] = change;
    return arrFill;
  }
  return arrFill;
};

// general setup for graph types
// doughnut
const customTooltip = {
  // Disable the on-canvas tooltip
  enabled: false,
  custom(tooltip) {
    // Tooltip Element
    var tooltipEl = document.getElementById("chartjs-tooltip");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.innerHTML = "<section></section>";
      document.body.appendChild(tooltipEl);
    }
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove("above", "below", "no-transform");
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add("no-transform");
    }

    function getBody(bodyItem) {
      return bodyItem.lines;
    }

    // Set Text
    if (tooltip.body) {
      var titleLines = tooltip.title || [];
      var bodyLines = tooltip.body.map(getBody);

      var innerHtml = "";
      bodyLines.forEach(function(body, i) {
        var colors = tooltip.labelColors[i];
        var style = "background:" + colors.backgroundColor;
        style += "; border-color:" + colors.borderColor;
        style += "; border-width: 2px";
        var span =
          '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
        innerHtml += span + "<p>" + body + "</p>";
      });

      var htmlRoot = tooltipEl.querySelector("section");
      htmlRoot.innerHTML = innerHtml;
    }

    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left =
      position.left + window.pageXOffset + tooltip.caretX + "px";
    tooltipEl.style.top =
      position.top + window.pageYOffset + tooltip.caretY + "px";
    tooltipEl.style.fontFamily = tooltip._fontFamily;
    tooltipEl.style.fontSize = tooltip.fontSize;
    tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.pointerEvents = "none";
  }
};

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
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: { ...customTooltip }
    }
  };
};

// Lines and Bar config
const datasetConfigLine = (color, data) => {
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
    data
  };
};

const datasetConfigBar = (color, data) => {
  return {
    backgroundColor: color,
    data
  };
};

const scaleLabelConfigLine = label => {
  return {
    display: true,
    labelString: label,
    fontStyle: "bold",
    fontColor: "#485465",
    lineHeight: 3
  };
};

const tooltipsCallbacks = (label, xTitle, type = "line") => {
  return {
    title(item) {
      if (type === "line") {
        return `${item[0].yLabel} ${label}`;
      }
      return `${label.title} ${item[0].value}`;
    },
    label(item) {
      if (type === "line") {
        return `${item.label} ${xTitle}`;
      }
      return `${label.subtitle}`;
    }
  };
};

const optionsLineBarConfig = (xTitle, yTitle, tooltip) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          offset: true,
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false
          },
          scaleLabel: {
            ...scaleLabelConfigLine(xTitle)
          },
          ticks: {
            fontSize: 10,
            padding: 15
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawTicks: false
          },
          scaleLabel: {
            ...scaleLabelConfigLine(yTitle)
          },
          ticks: {
            fontSize: 10,
            padding: 15
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: "#474747",
      displayColors: false,
      xPadding: 10,
      yPadding: 8,
      titleAlign: "center",
      bodyAlign: "center",
      callbacks: tooltipsCallbacks(tooltip, xTitle)
    }
  };
};

const optionsHorizontalBarConfig = (tooltip, click = false) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawTicks: false
          },

          ticks: {
            fontSize: 10,
            padding: 15
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            fontSize: 10,
            padding: 15
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: "#474747",
      displayColors: false,
      xPadding: 10,
      yPadding: 8,
      callbacks: tooltipsCallbacks(tooltip, "", "bar")
    },
    onHover: event => {
      if (click) {
        event.target.style.cursor = "pointer";
      }
    }
  };
};

const lineBarConfig = (datasets, options, labels = []) => {
  return {
    chartData: {
      labels,
      datasets
    },
    options
  };
};

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
        };
      })
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
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
  };
};

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
        };
      })
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scale: {
        gridLines: {
          borderDash: [6],
          borderDashOffset: 10,
          color: "#D8D1C9",
          z: 1
        },
        ticks: {
          fontSize: 10,
          fontStyle: "bold",
          fontColor: "#D8D1C9",
          z: 1,
          showLabelBackdrop: false,
          stepSize: 20,
          padding: 20
        }
      },
      tooltips: { ...customTooltip }
    }
  };
};

export const settings = config => {
  const { type, colors, scales, labels, tooltip, click, data } = config;
  let datasets, options;
  switch (type) {
    case "line":
      datasets = colors.map((color, i) => datasetConfigLine(color, data[i]));
      options = optionsLineBarConfig(scales.x, scales.y, tooltip);
      return lineBarConfig(datasets, options, labels);
    case "bar":
      datasets = colors.map((color, i) => datasetConfigBar(color, data[i]));
      options = optionsLineBarConfig(scales.x, scales.y, tooltip);
      return lineBarConfig(datasets, options, labels);
    case "horizontal-bar":
      datasets = colors.map((color, i) => datasetConfigBar(color, data[i]));
      options = optionsHorizontalBarConfig(tooltip, click);
      return lineBarConfig(datasets, options, labels);
    case "doughnut":
      return doughnutConfig(colors, labels, data);
    case "micro":
      return micro(colors, labels, data);
    case "polar":
      return polar(colors, labels, data);
  }
};

// break line in chunks
const chunkString = (str, len) => {
  const size = Math.ceil(str.length / len);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len);
    offset += len;
  }

  return r;
};
export const splitLabel = str => {
  if (str.length > 30) {
    return chunkString(str, 30);
  }
  return str;
};

export const randomData = (length, range = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * range));
};

export const randomNumber = (max = 100) =>
  Math.floor(Math.random() * Math.floor(max));

export const legendGenerator = (labels, colors, data) => {
  return labels.map((label, i) => {
    return { label, color: colors[i], value: data[i] };
  });
};
