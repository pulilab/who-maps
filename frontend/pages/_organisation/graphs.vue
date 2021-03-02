<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="30" class="mb-80">
      <div class="resume-group">
        <el-col :span="5">
          <resume>
            <translate>Published Projects</translate>
            <template #content>
              <growth :incoming="incoming" large absolute />
              <growth :incoming="incoming" :previous="previous" />
            </template>
          </resume>
        </el-col>
        <el-col :span="5">
          <resume>
            <translate>Publishable Projects</translate>
            <template #content>
              <growth :incoming="incoming" large absolute />
              <growth :incoming="incoming" :previous="previous" />
            </template>
          </resume>
        </el-col>
        <el-col :span="5">
          <resume>
            <translate>Unpublished Projects</translate>
            <template #content>
              <growth :incoming="incoming" large absolute />
            </template>
          </resume>
        </el-col>
        <el-col :span="4">
          <resume>
            <translate>Deletable Projects</translate>
            <template #content>
              <growth :incoming="incoming" large absolute />
              <growth :incoming="incoming" :previous="previous" />
            </template>
          </resume>
        </el-col>
        <el-col :span="5">
          <resume no-border>
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
          </resume>
        </el-col>
      </div>
    </el-row>

    <!-- section A -->
    <el-row type="flex" :gutter="20" class="mb-80">
      <graph-layout :span="8">
        <template #graph>
          <chart
            type="doughnut"
            :width="160"
            :height="160"
            :chart-data="doughnutA.chartData"
            :options="doughnutA.options"
          />
        </template>
        <template #legend>
          <data-legend :items="doughnutALegend" percentage large />
        </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Monthly growth of Projects</translate>
        <template #graph>
          <chart
            :chart-data="lineA.chartData"
            :options="lineA.options"
            :height="320"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section B -->
    <el-row type="flex" class="mb-80">
      <graph-layout :span="24">
        <translate>Monthly User Activity</translate>
        <template #graph>
          <chart
            :chart-data="lineB.chartData"
            :options="lineB.options"
            :height="300"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section C -->
    <el-row type="flex" class="mb-80">
      <graph-layout :span="24">
        <translate>Monthly User Activity</translate>
        <template #graph>
          <chart
            type="bar-chart"
            :chart-data="barA.chartData"
            :options="barA.options"
            :height="300"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section D -->
    <el-row type="flex" class="mb-80">
      <graph-layout :span="24">
        <translate>Monthly growth of API keys</translate>
        <template #graph>
          <chart
            :chart-data="lineC.chartData"
            :options="lineC.options"
            :height="300"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section E -->
    <el-row type="flex" :gutter="20" class="mb-80">
      <graph-layout :span="8">
        <translate>Project approval per countries</translate>
        <template #graph> </template>
        <template #legend> </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Monthly growth of API keys</translate>
        <template #graph>
          <chart
            :chart-data="lineC.chartData"
            :options="lineC.options"
            :height="320"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section F -->
    <el-row type="flex" :gutter="20" class="mb-80">
      <graph-layout :span="8">
        <translate>
          Has the government contributed to the project, either financially or
          in-kind?
        </translate>
        <template #graph>
          <chart
            type="doughnut"
            :width="160"
            :height="160"
            :chart-data="doughnutB.chartData"
            :options="doughnutB.options"
          />
        </template>
        <template #legend>
          <data-legend :items="doughnutBLegend" percentage />
        </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Top 10 ‘Data standards’ (by occurrences)</translate>
        <template #graph>
          <chart
            type="horizontal-bar"
            :chart-data="horizontalBarA.chartData"
            :options="horizontalBarA.options"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- section G -->
    <el-row type="flex" :gutter="20" class="mb-80">
      <graph-layout :span="16" horizontal>
        <translate>Distributions of projects’ stages</translate>
        <template #graph>
          <chart
            type="polar-area"
            :chart-data="polarA.chartData"
            :options="polarA.options"
          />
        </template>
        <template #legend>
          <data-legend :items="polarALegend" />
        </template>
      </graph-layout>
      <graph-layout :span="8">
        <translate>Distribution of projects’ statuses</translate>
        <template #graph>
          <chart
            type="doughnut"
            :width="160"
            :height="160"
            :chart-data="doughnutC.chartData"
            :options="doughnutC.options"
          />
        </template>
        <template #legend>
          <data-legend :items="doughnutCLegend" />
        </template>
      </graph-layout>
    </el-row>

    <!-- section H -->
    <el-row type="flex" :gutter="20" class="mb-80">
      <graph-layout :span="8">
        <translate>Coverage of Health Focus Areas</translate>
        <template #graph>
          <chart
            type="doughnut"
            :width="160"
            :height="160"
            :chart-data="doughnutD.chartData"
            :options="doughnutD.options"
          />
        </template>
        <template #legend>
          <!-- <data-legend :items="legend" /> -->
        </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Health Focus Areas (by occurrences)</translate>
        <template #graph>
          <chart
            type="horizontal-bar"
            :chart-data="horizontalBarB.chartData"
            :options="horizontalBarB.options"
          />
        </template>
      </graph-layout>
    </el-row>
  </div>
</template>

<script>
import Growth from "@/components/common/charts/utilities/Growth";
import DataLegend from "@/components/common/charts/utilities/DataLegend";

import Chart from "@/components/common/charts/Chart";

import Resume from "@/components/common/charts/widgets/Resume";
import GraphLayout from "@/components/common/charts/widgets/GraphLayout";

// chart utilities
import { settings } from "@/utilities/charts";

// experimental chunks
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
const splitLabel = (str) => {
  if (str.length > 30) {
    return chunkString(str, 30);
  }
  return str;
};

// color sets (should be dynamic?)
const colorSetA = ["#49BCE8"];
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
  "Dec",
];
const projectsLabels = [
  "Published Projects",
  "Publishable Projects",
  "Unpublished Projects",
  "Deleteble Projects",
];
const govermentContributionLabels = [
  "No, they have not yet contributed",
  "Yes, they are contributing in-kind people or time",
  "Yes, there is a financial contribution through MOH budget",
  "Yes, MOH is fully funding the project",
];
const distributionStatuesLabels = [
  "How many active?",
  "How many projects have ended?",
  "How many projects are complete?",
  "How many projects are discontinued?",
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
  splitLabel("mACM - Mobile Alert Communication Management"),
];
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
  "Sexual and reproductive health",
];
const stageLabels = [
  "Opportunity and Ideation",
  "Preparation and Scoping",
  "Analysis and Design",
  "Implementation planning",
  "Hand over or Complete",
];

export default {
  components: {
    Growth,
    Resume,
    Chart,
    GraphLayout,
    DataLegend,
  },
  data() {
    return {
      interval: () => {},
      incoming: 0,
      previous: 0,
      dynamic: 0,
      // charts
      micro: settings({
        type: "micro",
        colors: { bg: "#E8F6FD", border: "#22ADE3" },
      }),
      polarA: settings({
        type: "polar",
        colors: colorSetG,
        labels: stageLabels,
      }),
      polarALegend: [],
      lineA: settings({
        type: "line",
        colors: colorSetA,
        scales: { x: "2019", y: "Growth of project" },
        labels: monthLabels,
        tooltip: "Projects",
      }),
      lineB: settings({
        type: "line",
        colors: colorSetB,
        scales: { x: "2019", y: "# of users" },
        labels: monthLabels,
        tooltip: "Users",
      }),
      lineC: settings({
        type: "line",
        colors: colorSetA,
        scales: { x: "2017", y: "# of API keys" },
        labels: monthLabels,
        tooltip: "API keys",
      }),
      barA: settings({
        type: "bar",
        colors: colorSetB,
        scales: { x: "2018", y: "Growth of users" },
        labels: monthLabels,
        tooltip: "New users",
      }),
      horizontalBarA: settings({
        type: "horizontal-bar",
        colors: colorSetA,
        labels: dataStandardsLabels,
        tooltip: {
          title: "Ocurrances:",
          subtitle: "",
        },
      }),
      horizontalBarB: settings({
        type: "horizontal-bar",
        colors: colorSetA,
        labels: hfaLabels,
        tooltip: {
          title: "Ocurrances:",
          subtitle: "Click to see Heatlh Focus Areas",
        },
        click: true,
      }),
      doughnutA: settings({
        type: "doughnut",
        colors: colorSetC,
        labels: projectsLabels,
      }),
      doughnutALegend: [],
      doughnutB: settings({
        type: "doughnut",
        colors: colorSetD,
        labels: govermentContributionLabels,
      }),
      doughnutBLegend: [],
      doughnutC: settings({
        type: "doughnut",
        colors: colorSetE,
        labels: distributionStatuesLabels,
      }),
      doughnutCLegend: [],
      doughnutD: settings({
        type: "doughnut",
        colors: colorSetF,
        labels: coverageLabels,
      }),
    };
  },
  created() {
    this.horizontalBarB.options.onClick = this.handle; // onClick: this.handle

    this.dynamic = this.dynamic + 1;
    this.interval = setInterval(() => {
      this.handleChange(100);
      this.dynamic = this.dynamic + 1;
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    dynamic() {
      this.updateChart("micro", 10);
      this.updateChart("polarA", stageLabels.length, {
        labels: stageLabels,
        colors: colorSetG,
      });
      this.updateChart("doughnutA", projectsLabels.length, {
        labels: projectsLabels,
        colors: colorSetC,
      });
      this.updateChart("doughnutB", govermentContributionLabels.length, {
        labels: govermentContributionLabels,
        colors: colorSetD,
      });
      this.updateChart("doughnutC", distributionStatuesLabels.length, {
        labels: distributionStatuesLabels,
        colors: colorSetE,
      });
      this.updateChart("doughnutD", coverageLabels.length);
      this.updateChart("lineA", monthLabels.length);
      this.updateChart("lineB", monthLabels.length);
      this.updateChart("lineC", monthLabels.length);
      this.updateChart("barA", monthLabels.length);
      this.updateChart("horizontalBarA", dataStandardsLabels.length);
      this.updateChart("horizontalBarB", hfaLabels.length);
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
    updateChart(object, dataLength, legend = false) {
      const data = this.randomArray(dataLength);
      this[object].chartData = {
        ...this[object].chartData,
        labels:
          this[object].chartData.labels.length === 0
            ? data
            : this[object].chartData.labels,
        datasets: this[object].chartData.datasets.map((dataset) => {
          return { ...dataset, data: this.randomArray(dataLength) };
        }),
      };
      if (legend) {
        const { labels, colors } = legend;
        this[`${object}Legend`] = labels.map((label, i) => {
          return { label, color: colors[i], value: data[i] };
        });
      }
    },
    handle(point, event) {
      const item = event[0];
      console.log({
        index: item._index,
        backgroundColor: item._view.backgroundColor,
      });
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
    margin: 0 15px;
    width: 100%;
  }

  .mb-80 {
    margin-bottom: 80px;
  }
}
</style>
