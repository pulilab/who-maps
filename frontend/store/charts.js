// utilities
import {
  dataInfoFill,
  fillArr,
  phaseInfo,
  lastLabelType
} from "@/utilities/charts";
import { formatDate } from "@/utilities/projects";
import { isBefore } from "date-fns";

// chart utilities
import {
  settings,
  splitLabel,
  randomData,
  randomNumber,
  legendGenerator
} from "@/utilities/charts";

const colorSetA = ["#49BCE8"];
const hfaLabels = [
  "Adolescent and Youth Health",
  "Civil registration and vital statistics",
  "Coronavirus",
  "Cross cutting",
  "Environmental health",
  "Humanitarian health",
  "Infectious diseases (non-vector borne)",
  "Injury prevention and management",
  "Maternal health",
  "Newborn and Child Health",
  "Non-communicable diseases",
  "Nutrition and metabolic disorders",
  "Sexual and reproductive health"
];

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
  horizontalBarA: {},
  horizontalBarB: {},
  doughnutA: {},
  doughnutB: {},
  doughnutC: {},
  doughnutD: {},
  // legends
  polarALegend: [],
  doughnutALegend: [],
  doughnutBLegend: [],
  doughnutCLegend: []
});

export const actions = {
  getStageData({ commit, rootState }, stages) {
    // phases
    const phases = [""].concat(stages.map(i => i.name));
    // notes
    const notes = [""].concat(stages.map(i => i.note));

    // labels
    const start = formatDate(rootState.project.start_date);
    const end = formatDate(rootState.project.end_date);
    const today = formatDate(new Date());

    const labels = [start].concat(
      stages.filter(i => i.checked).map(i => i.date)
    );
    // const lastLabel = labels[labels.length - 1];

    // data
    const data = [0].concat(
      stages.filter(i => i.checked).map(i => phases.indexOf(i.name))
    );
    const lastDataPoint = data[data.length - 1];

    // today and end date data points, if needed
    if ((end && isBefore(today, end)) || end === "1970-01-01") {
      data.push(lastDataPoint + 1);
      labels.push([today, "Today"]);
    }
    if (end && end !== "1970-01-01") {
      data.push(data[data.length - 1]);
      labels.push([end, "Ended"]);
      notes.push(rootState.project.end_date_note);
    }

    const lLen = labels.length;
    // start calc
    const startData = data.slice(0, 1);
    // end calc
    const endData =
      Array.isArray(labels[lLen - 1]) && labels[lLen - 1][1] === "Ended"
        ? fillArr(lLen - 1, NaN).concat(data.slice(-1))
        : [];
    // today calc
    const checkLabels = labels.filter(i => Array.isArray(i));
    const todayIncludes = checkLabels.filter(i => i[1] === "Today");
    const todayData =
      todayIncludes.length > 0
        ? fillArr(lLen - checkLabels.length - 1, NaN).concat(
            checkLabels.length > 1 ? data.slice(-3, -1) : data.slice(-2)
          )
        : [];
    // stages calc
    const stagesData =
      todayIncludes.length > 0 ? data.slice(0, -checkLabels.length) : data;

    const { color, rotation, dash, point } = phaseInfo(lastLabelType(labels));

    const datasets = Object.freeze([
      {
        borderColor: "#558B2F",
        pointBackgroundColor: "#558B2F",
        fill: false,
        lineTension: 0,
        pointStyle: dataInfoFill(labels.length - 1, "circle", "triangle"),
        pointRadius: dataInfoFill(labels.length - 1, 6, 12),
        pointHoverRadius: dataInfoFill(labels.length - 1, 8, 14),
        pointBorderColor: "white",
        pointRotation: 90,
        data: startData
      },
      {
        borderColor: color,
        pointBackgroundColor: color,
        fill: false,
        lineTension: 0,
        borderDash: dash,
        pointStyle: dataInfoFill(labels.length, "circle", point, "back"),
        pointRadius: dataInfoFill(labels.length, 0, 12, "back"),
        pointHoverRadius: dataInfoFill(labels.length, 0, 14, "back"),
        pointBorderColor: "white",
        pointRotation: rotation,
        data: endData
      },
      {
        borderColor: "#008DC9",
        pointBackgroundColor: "#008DC9",
        fill: false,
        lineTension: 0,
        pointStyle: dataInfoFill(labels.length - 1, "circle", "circle"),
        pointRadius: dataInfoFill(labels.length - 1, 6, 0),
        pointHoverRadius: dataInfoFill(labels.length - 1, 8, 0),
        pointBorderColor: "white",
        pointRotation: 90,
        data: stagesData
      },
      {
        borderColor: "#B9B9B9",
        pointBackgroundColor: "white",
        fill: false,
        lineTension: 0,
        borderDash: [10, 5],
        pointStyle: dataInfoFill(labels.length, "circle", "circle", "back"),
        pointRadius: dataInfoFill(labels.length, 5, 0, "back"),
        pointHoverRadius: dataInfoFill(labels.length, 7, 0, "back"),
        pointBorderColor: "#B9B9B9",
        pointBorderWidth: 2,
        pointRotation: 0,
        data: todayData
      }
    ]);
    const chartData = { labels, datasets };

    commit("SET_STAGES_CHART_DATA", chartData);
    commit("SET_STAGES_OPTIONS", {
      maintainAspectRatio: false,
      defaultFontColor: "#474747",
      defaultFontSize: 12,
      tooltips: {
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {
            return null;
          },
          title: (tooltipItem, data) => {
            const { xLabel, yLabel } = tooltipItem[0];
            if (phases[yLabel] === "") {
              return xLabel;
            }
            if (Array.isArray(xLabel)) {
              return [xLabel[0], xLabel[1]];
            }
            return [xLabel, phases[yLabel]];
          },
          footer: (tooltipItem, data) => {
            const { xLabel, yLabel } = tooltipItem[0];
            if (xLabel.includes("Ended")) {
              return `Note: ${notes[notes.length - 1]}`.match(/.{1,38}/g);
            }
            return notes[yLabel]
              ? `Note: ${notes[yLabel]}`.match(/.{1,38}/g)
              : null;
          }
        },
        backgroundColor: "#474747",
        xPadding: 12,
        yPadding: 12,
        titleMarginBottom: 0,
        footerMarginTop: 8,
        footerFontStyle: "normal",
        footerAlign: "center",
        titleAlign: "center",
        titleFontSize: 12,
        bodyFontSize: 12,
        bodyAlign: "center",
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
              fontColor: "#9E9E9E",
              padding: 12,
              callback: function(value, index, values) {
                return value > 0 ? `${value}. ${phases[value]}` : phases[value];
              }
            }
          }
        ]
      }
    });
  },
  getDashboardData({ commit }) {
    // start of data that should come from somewhere
    // color sets (should be dynamic?)
    const colorSetB = ["#49BCE8", "#99CA67"];
    const colorSetC = ["#9ACB67", "#FFCF3F", "#BABABB", "#E84F48"];
    const colorSetD = ["#FFCF3F", "#FEAB7D", "#9ACB67", "#49BCE8"];
    const colorSetE = ["#FFCF3F", "#EF8A85", "#9ACB67", "#5F72B5"];
    const colorSetF = ["#9ACB67", "#E84F48"];
    const colorSetG = ["#FFCE3D", "#FEAB7D", "#49BCE8", "#5F72B5", "#9ACB67"];

    // labels set (should be dynamic?)
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const projectsLabels = [
      "Published Projects",
      "Publishable Projects",
      "Unpublished Projects",
      "Deleteble Projects"
    ];
    const govermentContributionLabels = [
      "No, they have not yet contributed",
      "Yes, they are contributing in-kind people or time",
      "Yes, there is a financial contribution through MOH budget",
      "Yes, MOH is fully funding the project"
    ];
    const distributionStatuesLabels = [
      "How many active?",
      "How many projects have ended?",
      "How many projects are complete?",
      "How many projects are discontinued?"
    ];
    const coverageLabels = ["Covered", "Not covered"];
    const dataStandardsLabels = [
      splitLabel("GML Geography Markup Language"),
      splitLabel("SVS - Sharing Value Sets"),
      splitLabel("SNOMED"),
      splitLabel("ADX - Aggregate Data Exchange"),
      splitLabel("CIEL"),
      splitLabel("CPT"),
      splitLabel("PIX or PIXm - (Mobile) Patient Identifier Cross Reference"),
      splitLabel("ISO 3166"),
      splitLabel("ISCO 08"),
      splitLabel("mACM - Mobile Alert Communication Management")
    ];
    const stageLabels = [
      "Opportunity and Ideation",
      "Preparation and Scoping",
      "Analysis and Design",
      "Implementation planning",
      "Hand over or Complete"
    ];
    // end of data that should come from somewhere

    // data generation
    const polarAData = randomData(stageLabels.length);
    const doughnutAData = randomData(projectsLabels.length);
    const doughnutBData = randomData(govermentContributionLabels.length);
    const doughnutCData = randomData(distributionStatuesLabels.length);
    const doughnutDData = randomData(coverageLabels.length);

    // initialization for graph
    commit(
      "SET_MICRO_GRAPH",
      settings({
        type: "micro",
        colors: { bg: "#E8F6FD", border: "#22ADE3" },
        labels: randomData(10),
        data: [randomData(10)]
      })
    );
    commit(
      "SET_POLARA_GRAPH",
      settings({
        type: "polar",
        colors: colorSetG,
        labels: stageLabels,
        data: [polarAData]
      })
    );
    commit(
      "SET_LINEA_GRAPH",
      settings({
        type: "line",
        colors: colorSetA,
        scales: { x: "2019", y: "Growth of project" },
        labels: monthLabels,
        tooltip: "Projects",
        data: [randomData(monthLabels.length)]
      })
    );
    commit(
      "SET_LINEB_GRAPH",
      settings({
        type: "line",
        colors: colorSetB,
        scales: { x: "2019", y: "# of users" },
        labels: monthLabels,
        tooltip: "Users",
        data: [randomData(monthLabels.length), randomData(monthLabels.length)]
      })
    );
    commit(
      "SET_LINEC_GRAPH",
      settings({
        type: "line",
        colors: colorSetA,
        scales: { x: "2017", y: "# of API keys" },
        labels: monthLabels,
        tooltip: "API keys",
        data: [randomData(monthLabels.length)]
      })
    );
    commit(
      "SET_BARA_GRAPH",
      settings({
        type: "bar",
        colors: colorSetB,
        scales: { x: "2018", y: "Growth of users" },
        labels: monthLabels,
        tooltip: "New users",
        data: [randomData(monthLabels.length), randomData(monthLabels.length)]
      })
    );
    commit(
      "SET_HORIZONTALBARA_GRAPH",
      settings({
        type: "horizontal-bar",
        colors: colorSetA,
        labels: dataStandardsLabels,
        tooltip: {
          title: "Ocurrances:",
          subtitle: ""
        },
        data: [randomData(monthLabels.length)]
      })
    );
    commit(
      "SET_HORIZONTALBARB_GRAPH",
      settings({
        type: "horizontal-bar",
        colors: colorSetA,
        labels: hfaLabels,
        tooltip: {
          title: "Ocurrances:",
          subtitle: "Click to see Heatlh Focus Areas"
        },
        click: true,
        data: [randomData(hfaLabels.length)]
      })
    );
    commit(
      "SET_DOUGHNUTA_GRAPH",
      settings({
        type: "doughnut",
        colors: colorSetC,
        labels: projectsLabels,
        data: doughnutAData
      })
    );
    commit(
      "SET_DOUGHNUTB_GRAPH",
      settings({
        type: "doughnut",
        colors: colorSetD,
        labels: govermentContributionLabels,
        data: doughnutBData
      })
    );
    commit(
      "SET_DOUGHNUTC_GRAPH",
      settings({
        type: "doughnut",
        colors: colorSetE,
        labels: distributionStatuesLabels,
        data: doughnutCData
      })
    );
    commit(
      "SET_DOUGHNUTD_GRAPH",
      settings({
        type: "doughnut",
        colors: colorSetF,
        labels: coverageLabels,
        data: doughnutDData
      })
    );
    // legends
    commit(
      "SET_POLARA_LEGEND",
      legendGenerator(stageLabels, colorSetG, polarAData)
    );
    commit(
      "SET_DOUGHNUTA_LEGEND",
      legendGenerator(projectsLabels, colorSetC, doughnutAData)
    );
    commit(
      "SET_DOUGHNUTB_LEGEND",
      legendGenerator(govermentContributionLabels, colorSetD, doughnutBData)
    );
    commit(
      "SET_DOUGHNUTC_LEGEND",
      legendGenerator(distributionStatuesLabels, colorSetE, doughnutCData)
    );
    // commit(
    //   "SET_DOUGHNUTD_LEGEND",
    //   legendGenerator(coverageLabels, colorSetF, doughnutDData)
    // );

    commit("SET_INCOMING", randomNumber());
    commit("SET_PREVIOUS", randomNumber());
  },
  setBarClick({ commit }, fun) {
    commit("SET_BAR_CLICK", fun);
  },
  setHorizontalBarBData({ commit, dispatch }) {
    dispatch("getDashboardData");
  }
};

export const mutations = {
  SET_STAGES_CHART_DATA: (state, obj) => {
    state.stages.chartData = obj;
  },
  SET_STAGES_OPTIONS: (state, obj) => {
    state.stages.options = obj;
  },
  // general graphs
  SET_MICRO_GRAPH: (state, obj) => {
    state.micro = obj;
  },
  SET_POLARA_GRAPH: (state, obj) => {
    state.polarA = obj;
  },
  SET_BARA_GRAPH: (state, obj) => {
    state.barA = obj;
  },
  SET_HORIZONTALBARA_GRAPH: (state, obj) => {
    state.horizontalBarA = obj;
  },
  SET_HORIZONTALBARB_GRAPH: (state, obj) => {
    state.horizontalBarB = obj;
  },
  SET_LINEA_GRAPH: (state, obj) => {
    state.lineA = obj;
  },
  SET_LINEB_GRAPH: (state, obj) => {
    state.lineB = obj;
  },
  SET_LINEC_GRAPH: (state, obj) => {
    state.lineC = obj;
  },
  SET_DOUGHNUTA_GRAPH: (state, obj) => {
    state.doughnutA = obj;
  },
  SET_DOUGHNUTB_GRAPH: (state, obj) => {
    state.doughnutB = obj;
  },
  SET_DOUGHNUTC_GRAPH: (state, obj) => {
    state.doughnutC = obj;
  },
  SET_DOUGHNUTD_GRAPH: (state, obj) => {
    state.doughnutD = obj;
  },
  SET_INCOMING: (state, val) => {
    state.incoming = val;
  },
  SET_PREVIOUS: (state, val) => {
    state.previous = val;
  },
  // legends
  SET_POLARA_LEGEND: (state, val) => {
    state.polarALegend = val;
  },
  SET_DOUGHNUTA_LEGEND: (state, val) => {
    state.doughnutALegend = val;
  },
  SET_DOUGHNUTB_LEGEND: (state, val) => {
    state.doughnutBLegend = val;
  },
  SET_DOUGHNUTC_LEGEND: (state, val) => {
    state.doughnutCLegend = val;
  },
  SET_DOUGHNUTD_LEGEND: (state, val) => {
    state.doughnutDLegend = val;
  },
  // click hfa system
  SET_BAR_CLICK: (state, fun) => {
    state.horizontalBarB.options.onClick = fun;
  }
};
