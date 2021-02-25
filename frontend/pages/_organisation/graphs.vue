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
          <data-legend :items="legend" />
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
            :chart-data="lineA.chartData"
            :options="lineA.options"
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
            :chart-data="lineA.chartData"
            :options="lineA.options"
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
          <data-legend :items="legend" />
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
      <graph-layout :span="16">
        <translate>Distributions of projects’ stages</translate>
        <template #graph>
          <chart
            type="polar-area"
            :chart-data="polarA.chartData"
            :options="polarA.options"
          />
        </template>
        <template #legend>
          <data-legend :items="legend" />
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
          <data-legend :items="legend" />
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
            :chart-data="horizontalBarA.chartData"
            :options="horizontalBarA.options"
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
import { chartsSetup } from "@/utilities/charts";

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
      legend: [
        {
          color: "#80BD41",
          label: "Published Projects",
          value: "30%",
          disabled: false,
        },
        {
          color: "#FFC20E",
          label: "Publishable Projects",
          value: "10%",
          disabled: false,
        },
        {
          color: "#A8A8A9",
          label: "Unpublished Projects",
          value: "60%",
          disabled: false,
        },
        {
          color: "#E2231A",
          label: "Deleteble Projects",
          value: "80%",
          disabled: false,
        },
      ],
      ...chartsSetup,
    };
  },
  created() {
    this.horizontalBarA.options.onClick = this.handle; // onClick: this.handle

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
      this.updateChart("polarA", 5);
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
          this[object].chartData.labels.length === 0
            ? this.randomArray(dataLength)
            : this[object].chartData.labels,
        datasets: this[object].chartData.datasets.map((dataset) => {
          return { ...dataset, data: this.randomArray(dataLength) };
        }),
      };
    },
    handle(point, event) {
      const item = event[0];
      // this.$emit('on-receive', {
      console.log({
        index: item._index,
        backgroundColor: item._view.backgroundColor,
      });
      // })

      // console.log(data);
      // this.selectedData = data;
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
