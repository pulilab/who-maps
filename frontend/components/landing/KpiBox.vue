<template>
  <div class="KpiWrapper">
    <el-row class="border-bottom">
      <h2>
        Projects Statistics
        <country-select
          class="countrySelector"
          @change="handleCountry"
          :value="country"
        />
      </h2>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col :span="18" class="border-right">
        <div>
          <graph-layout :span="24" horizontal>
            <span class="kpiHeader">Distributions of projects’ stages 2</span>
            <template #graph>
              <chart
                type="polar-area"
                :chart-data="polarA.chartData || {}"
                :options="polarA.options"
              />
            </template>
            <template #legend>
              <DataLegend :items="polarALegend">
                <div>
                  <span class="label">Projects with no stage data</span>
                  <span class="dots" />
                  <span class="value">{{ noStageDataSum }}</span>
                </div>
              </DataLegend>
            </template>
          </graph-layout>
        </div>
      </el-col>
      <el-col :span="6">
        <span class="kpiHeader pt-30 pb-30">Projects Statistics</span>

        <el-card shadow="never" class="counterBox">
          <span class="title">Totals amount</span>
          <span class="number">{{ totalProjects }}</span>
        </el-card>
        <el-card shadow="never" class="counterBox">
          <span class="title">Since last month</span>
          <span class="number">{{ sinceLastMonth }}</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="border-bottom">
      <el-col class="graphMargin">
        <graph-layout>
          <translate v-if="back.length === 0" key="categories" class="kpiHeader"
            >Health Focus Categories (by occurrences)</translate
          >
          <translate v-else key="areas" class="kpiHeader"
            >Health Focus Areas (by occurrences)</translate
          >
          <el-popover
            placement="bottom"
            :title="$gettext('How to read the chart') | translate"
            width="480"
            :visible-arrow="true"
            popper-class="hfa-info-popover"
            class="hfa-info"
            trigger="click"
          >
            <div>
              <h2><translate>Health Focus Categories</translate></h2>
              <p>
                <translate
                  >At first level in the Health Focus Categories every project
                  can contain the a Health Focus Category only once.</translate
                >
              </p>
              <h2><translate>Health Focus Areas</translate></h2>
              <p>
                <translate
                  >Health Focus Areas as sublevel of Health Focus Categories can
                  contain multiple Health Focus Areas. Because of this, it may
                  happen that the sum of the visible Health Focus Areas are more
                  than the sum of Health Focus Categories, although the
                  individual Health Focus Areas cannot exceed the number of
                  Health Focus Categories displayed.</translate
                >
              </p>
            </div>
            <fa slot="reference" icon="info-circle" /> </el-popover
          ><span class="infoHint"
            >Click on the bars to see health focus areas in specific
            category</span
          >
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
            <Subtitle :item="subtitle" />
          </template>
          <template #graph>
            <horizontal-bar
              v-if="horizontalBarB.chartData"
              :chart-data="horizontalBarB.chartData || {}"
              :options="horizontalBarB.options"
              :height="480"
            />
          </template>
        </graph-layout>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="graphMargin">
        <graph-layout :span="24">
          <translate
            :parameters="{ top: dataStandardsCount }"
            class="kpiHeader"
          >
            Top {top} ‘Data standards’ (by occurrences)
          </translate>
          <template #graph>
            <horizontal-bar
              v-if="horizontalBarA.chartData"
              :chart-data="horizontalBarA.chartData || {}"
              :options="horizontalBarA.options"
              :height="dataStandardHeight"
            />
          </template>
        </graph-layout>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Chart from "@/components/common/charts/Chart";
import DataLegend from "@/components/common/charts/utilities/DataLegend";
import GraphLayout from "@/components/common/charts/widgets/GraphLayout";
import CountrySelect from "../../components/common/CountrySelect";
import Subtitle from "@/components/common/charts/utilities/Subtitle";

import { mapGetters, mapState, mapActions } from "vuex";
import debounce from "lodash/debounce";

export default {
  components: {
    Chart,
    DataLegend,
    GraphLayout,
    CountrySelect,
    Subtitle
  },

  data() {
    return {
      country: 201
    };
  },
  computed: {
    ...mapState({
      polarA: state => state.charts.polarA,
      polarALegend: state => state.charts.polarALegend,
      noStageDataSum: state => state.charts.noStageDataSum,
      totalProjects: state => state.charts.totalProjects,
      sinceLastMonth: state => state.charts.sinceLastMonth,
      back: state => state.charts.back,
      subtitle: state => state.charts.subtitle,
      horizontalBarB: state => state.charts.horizontalBarB,
      horizontalBarA: state => state.charts.horizontalBarA
    }),
    dataStandardsCount() {
      return this.horizontalBarA.chartData?.datasets[0].data.length > 0
        ? this.horizontalBarA.chartData.datasets[0].data.length
        : 0;
    },
    dataStandardHeight() {
      return this.dataStandardsCount > 0 ? this.dataStandardsCount * 40 : 800;
    }
  },
  methods: {
    ...mapActions({
      getDashboardData: "charts/getDashboardData",
      handleBackClick: "charts/handleBackClick",
      barClick: "charts/handleBarClick",
      backClick: "charts/handleBackClick",
      setFilters: "charts/setFilters"
    }),
    handleBackClick() {
      this.backClick({ func: this.handleBarClick });
    },
    handleBarClick(point, event) {
      if (this.back.length === 0) {
        this.barClick({ func: this.handleBarClick, idx: event[0]._index });
      }
    },
    handleCountry(country) {
      this.country = country;
      this.setFilters({
        ...this.filters,
        country: country ? `${country}` : undefined
      });
      this.debounceSearch();
    },
    allData() {
      return this.getDashboardData({
        func: this.handleBarClick,
        refresh: true,
        state: {}
      });
    },
    handleSearch() {
      this.getDashboardData({ func: this.handleBarClick, refresh: true });
    },
    debounceSearch: debounce(function() {
      this.handleSearch();
    }, 500)
  },
  created() {
    this.handleSearch();
  }
};
</script>

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";

/** KPI DEV STYLE **/
.KpiWrapper {
  padding: 0 40px 40px 40px;
  h2 {
    background-color: white;
    color: @colorBrandPrimary;
    padding: 40px;
    margin: 0;
  }

  .video_wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */
  }
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .countrySelector {
    float: right;
  }
  .infoHint {
    color: #c7c7c7;
    font-size: @fontSizeSmall;
    letter-spacing: 0.8px;
    vertical-align: middle;
    margin-left: 5px;
  }
  .hfa-info {
    color: #c7c7c7;
  }
  .graphMargin {
    margin-bottom: 40px;
  }
  .el-row {
    background: white;
  }
}

.border-top {
  border-top: 1px solid #dcdfe6;
}
.border-bottom {
  border-bottom: 1px solid #dcdfe6;
}
.border-left {
  border-left: 1px solid #dcdfe6;
}
.border-right {
  border-right: 1px solid #dcdfe6;
}

.counterBox {
  border: none;
  background: rgb(246 246 246);
  padding: 20px;
  width: 50%;
  margin-top: 0;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  .number,
  .title {
    display: block;
    text-align: center;
  }
  .number {
    padding-top: 20px;
    font-size: @fontSizeHeading;
    font-weight: 600;
  }
}

.kpiHeader {
  display: block;
  text-transform: uppercase;
  font-size: @fontSizeSmall;
  letter-spacing: 0.5px;
  font-weight: 600;
  text-align: center;
  color: black;
}

.pt-30 {
  padding-top: 30px;
}
.pb-30 {
  padding-bottom: 30px;
}

.bg-white {
  background-color: white;
}
</style>
