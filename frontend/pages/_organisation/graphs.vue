<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="30" class="mb-80 sticky">
      <div class="resume-group border-bar">
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="handleRandom"
        >
          Randomize data
        </el-button>
      </div>
    </el-row>

    <!-- section A -->
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

    <!-- section B -->
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
            :height="360"
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
            :chart-data="lineB.chartData"
            :options="lineB.options"
            :height="300"
          />
        </template>
        <template #legend>
          <data-legend :items="monthlyUserLegend" horizontal />
        </template>
      </graph-layout>
    </el-row>

    <!-- section D -->
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
        <template #legend>
          <data-legend :items="monthlyUserLegend" horizontal />
        </template>
      </graph-layout>
    </el-row>

    <!-- section E -->
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

    <!-- section F -->
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

    <!-- section G -->
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

    <!-- section H -->
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

    <!-- section I -->
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
          <tab-legend :legend="doughnutDLegend" />
        </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Health Focus Areas (by occurrences)</translate>
        <template #back>
          <el-button
            v-if="back.length > 0"
            type="text"
            icon="el-icon-arrow-left"
            @click="handleBackClick"
          >
            <translate>Back</translate>
          </el-button>
        </template>
        <template #subtitle>
          <subtitle :item="subtitle" />
        </template>
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
import { mapState, mapActions } from "vuex";
import Growth from "@/components/common/charts/utilities/Growth";
import Subtitle from "@/components/common/charts/utilities/Subtitle";
import DataLegend from "@/components/common/charts/utilities/DataLegend";
import TabLegend from "@/components/common/charts/utilities/TabLegend";
import Chart from "@/components/common/charts/Chart";
import Resume from "@/components/common/charts/widgets/Resume";
import GraphLayout from "@/components/common/charts/widgets/GraphLayout";

export default {
  components: {
    Growth,
    Resume,
    Chart,
    GraphLayout,
    DataLegend,
    TabLegend,
    Subtitle,
  },
  created() {
    this.handleRandom();
  },
  computed: {
    ...mapState({
      //
      incoming: (state) => state.charts.incoming,
      previous: (state) => state.charts.previous,
      // graphs
      micro: (state) => state.charts.micro,
      polarA: (state) => state.charts.polarA,
      lineA: (state) => state.charts.lineA,
      lineB: (state) => state.charts.lineB,
      lineC: (state) => state.charts.lineC,
      barA: (state) => state.charts.barA,
      horizontalBarA: (state) => state.charts.horizontalBarA,
      horizontalBarB: (state) => state.charts.horizontalBarB,
      doughnutA: (state) => state.charts.doughnutA,
      doughnutB: (state) => state.charts.doughnutB,
      doughnutC: (state) => state.charts.doughnutC,
      doughnutD: (state) => state.charts.doughnutD,
      // legends
      polarALegend: (state) => state.charts.polarALegend,
      doughnutALegend: (state) => state.charts.doughnutALegend,
      doughnutBLegend: (state) => state.charts.doughnutBLegend,
      doughnutCLegend: (state) => state.charts.doughnutCLegend,
      doughnutDLegend: (state) => state.charts.doughnutDLegend,
      monthlyUserLegend: (state) => state.charts.monthlyUserLegend,
      // back click hfa system
      back: (state) => state.charts.back,
      subtitle: (state) => state.charts.subtitle,
    }),
  },
  methods: {
    ...mapActions({
      getDashboardData: "charts/getDashboardData",
      handleBackClick: "charts/handleBackClick",
      barClick: "charts/handleBarClick",
      backClick: "charts/handleBackClick",
    }),
    handleRandom() {
      // nees to wire the click event to the options object of horizontal bar
      this.getDashboardData({ func: this.handleBarClick, refresh: true });
    },
    handleBarClick(point, event) {
      this.barClick({ func: this.handleBarClick, idx: event[0]._index });
    },
    handleBackClick() {
      this.backClick({ func: this.handleBarClick });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 80px 60px;
  background-color: #f2f2f2;
  position: relative;

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
.sticky {
  position: sticky;
  top: 20px;
  z-index: 1;
}
.border-bar {
  border: 1px solid #d8d1c9;
}
</style>
