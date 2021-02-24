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

    <el-row type="flex">
      <el-col :span="12">
        <chart
          type="polar-area"
          :chart-data="polarA.chartData"
          :options="polarA.options"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Growth from "@/components/common/charts/utilities/Growth";
import Chart from "@/components/common/charts/Chart";

import ResumeWidget from "@/components/common/charts/ResumeWidget";

// chart utilities
import { chartsSetup } from "@/utilities/charts";

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
  }
}
</style>
