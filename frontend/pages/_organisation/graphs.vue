<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="30" class="resume-group">
      <el-col :span="5">
        <resume-widget>
          <translate>Published Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Publishable Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Unpublished Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Deletable Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget no-border>
          <translate>Monthly growth of Projects</translate>
          <template #content>
            <growth :incoming="incoming" :previous="previous" large />
            <chart
              :chart-data="micro.chartData"
              :options="micro.options"
              :width="72"
              :height="26"
            />
          </template>
        </resume-widget>
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col :span="6">
        <chart
          type="doughnut"
          :chart-data="doughnutA.chartData"
          :options="doughnutA.options"
        />
      </el-col>
      <el-col :span="6">
        <chart
          type="doughnut"
          :chart-data="doughnutB.chartData"
          :options="doughnutB.options"
        />
      </el-col>
      <el-col :span="6">
        <chart
          type="doughnut"
          :chart-data="doughnutC.chartData"
          :options="doughnutC.options"
        />
      </el-col>
      <el-col :span="6">
        <chart
          type="doughnut"
          :chart-data="doughnutD.chartData"
          :options="doughnutD.options"
        />
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="12">
        <chart :chart-data="lineA.chartData" :options="lineA.options" />
      </el-col>
      <el-col :span="12">
        <chart :chart-data="lineB.chartData" :options="lineB.options" />
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col :span="12">
        <chart
          type="horizontal-bar"
          :chart-data="horizontalBarA.chartData"
          :options="horizontalBarA.options"
        />
      </el-col>
      <el-col :span="12">
        <chart
          type="bar-chart"
          :chart-data="barA.chartData"
          :options="barA.options"
        />
      </el-col>
    </el-row>
    <!-- <chart type="polar-area" :chart-data="micro.chartData" :options="{}" />-->
  </div>
</template>

<script>
import Growth from "@/components/common/charts/utilities/Growth";
import Chart from "@/components/common/charts/Chart";

import ResumeWidget from "@/components/common/charts/ResumeWidget";

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
  };
};

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
  "Dec",
];

export default {
  components: {
    Growth,
    ResumeWidget,
    Chart,
  },
  data() {
    return {
      interval: () => {},
      incoming: 0,
      previous: 0,
      dynamic: 0,
      micro: {
        chartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#E8F6FD",
              borderColor: "#22ADE3",
              label: "Dataset",
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
      },
      doughnutA: {
        chartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: ["#9ACB67", "#FFCF3F", "#BABABB", "#E84F48"],
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
        },
      },
      doughnutB: {
        chartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: ["#FFCF3F", "#FEAB7D", "#9ACB67", "#49BCE8"],
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
        },
      },
      doughnutC: {
        chartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: ["#FFCF3F", "#EF8A85", "#9ACB67", "#5F72B5"],
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
        },
      },
      doughnutD: {
        chartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: ["#9ACB67", "#E84F48"],
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
        },
      },
      lineA: {
        chartData: {
          labels: [],
          datasets: [datasetConfigLine("#49BCE8")],
        },
        options: optionsLineBarConfig("2019", "Growth of project"),
      },
      lineB: {
        chartData: {
          labels: [],
          datasets: [
            datasetConfigLine("#49BCE8"),
            datasetConfigLine("#99CA67"),
          ],
        },
        options: optionsLineBarConfig("2019", "# of users"),
      },
      horizontalBarA: {
        chartData: {
          labels: [],
          datasets: [{ backgroundColor: "#49BCE8" }],
        },
        options: optionsHorizontalBarConfig(),
      },
      barA: {
        chartData: {
          labels: [],
          datasets: [
            { backgroundColor: "#49BCE8" },
            { backgroundColor: "#99CA67" },
          ],
        },
        options: optionsLineBarConfig("2018", "Growth of users"),
      },
    };
  },
  created() {
    this.dynamic = this.dynamic + 1;
    this.interval = setInterval(() => {
      this.handleChange(100);
      this.dynamic = this.dynamic + 1;
    }, 20000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    dynamic() {
      this.updateChart("micro", 10);
      this.updateChart("doughnutA", 4);
      this.updateChart("doughnutB", 4);
      this.updateChart("doughnutC", 4);
      this.updateChart("doughnutD", 2);
      this.updateChart("lineA", 12);
      this.updateChart("lineB", 12);
      this.updateChart("horizontalBarA", 12);
      this.updateChart("barA", 12);
    },
  },
  methods: {
    handleChange(max) {
      this.incoming = Math.floor(Math.random() * Math.floor(max));
      this.previous = Math.floor(Math.random() * Math.floor(max));
    },
    randomArray(length, range = 100) {
      return Array.from({ length }, () => Math.floor(Math.random() * range));
    },
    updateChart(object, dataLength) {
      this[object].chartData = {
        ...this[object].chartData,
        labels:
          object.includes("line") || object.includes("bar")
            ? monthLabels
            : this.randomArray(dataLength),
        datasets: this[object].chartData.datasets.map((dataset) => {
          return { ...dataset, data: this.randomArray(dataLength) };
        }),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 80px 60px;
  background-color: #f2f2f2;

  .resume-group {
    background-color: white;
    padding: 16px 40px;
  }
}
</style>
