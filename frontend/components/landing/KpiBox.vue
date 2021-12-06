<template>
  <div class="KpiWrapper">
    <el-row class="border-bottom">
      <h2>
        Projects Statistics
        <el-select
          v-model="country"
          filterable
          placeholder="Select country"
          class="countrySelector input-search"
          clearable
          :disabled="loading"
          @change="handleCountry"
        >
          <el-option v-for="item in countries" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </h2>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <ClickableHorizontalBarChart :filters="filters" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <HorizontalBarChart :filters="filters" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <DoughnutChart :filters="filters" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <BarChart :filters="filters" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <BarChart :filters="filters" :chartDataInput="testStackedData" :chartOptionsInput="testStackedOptions" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col>
        <LineChart :filters="filters" /><!-- testing forced data passed :chartDataInput="monthlyUsersTestData"-->
      </el-col>
    </el-row>
    <el-row class="border-bottom bg-white">
      <el-col :span="18" class="border-right">
        <div>
          <graph-layout :span="24" horizontal>
            <span class="kpiHeader">Distributions of projects’ stages 2</span>
            <template #graph>
              <chart type="polar-area" :chart-data="polarA.chartData || {}" :options="polarA.options" />
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
          <span class="kpiHeader pt-30 pb-30 d-block">Projects Statistics</span>

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
    <el-row class="border-bottom bg-white">
      <el-col :span="18" class="border-right">
        <ProjectStagesPolarChart :filters="filters"/>
      </el-col>
      <el-col :span="6">
          <span class="kpiHeader pt-30 pb-30 d-block">Projects Statistics</span>

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
          <translate v-else key="areas" class="kpiHeader">Health Focus Areas (by occurrences)</translate>
          <el-popover
            placement="bottom"
            :title="$gettext('How to read the chart') | translate"
            width="480"
            popper-class="hfa-info-popover"
            class="hfa-info"
            trigger="click"
          >
            <div>
              <h2>
                <translate>Health Focus Categories</translate>
              </h2>
              <p>
                <translate
                  >At first level in the Health Focus Categories every project can contain the a Health Focus Category
                  only once.</translate
                >
              </p>
              <h2><translate>Health Focus Areas</translate></h2>
              <p>
                <translate
                  >Health Focus Areas as sublevel of Health Focus Categories can contain multiple Health Focus Areas.
                  Because of this, it may happen that the sum of the visible Health Focus Areas are more than the sum of
                  Health Focus Categories, although the individual Health Focus Areas cannot exceed the number of Health
                  Focus Categories displayed.</translate
                >
              </p>
            </div>
            <fa slot="reference" icon="info-circle" class="info-ref" />
          </el-popover>
          <template #back>
            <el-button v-if="back.length > 0" type="text" icon="el-icon-arrow-left" @click="handleBackClick">
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
          <translate :parameters="{ top: dataStandardsCount }" class="kpiHeader">
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
import Chart from '@/components/common/charts/Chart'
import DataLegend from '@/components/common/charts/utilities/DataLegend'
import GraphLayout from '@/components/common/charts/widgets/GraphLayout'
import CountrySelect from '@/components/common/CountrySelect'
import Subtitle from '@/components/common/charts/utilities/Subtitle'

import ProjectStagesPolarChart from '@/components/kpi/ProjectStagesPolarChart'
import BarChart from '@/components/kpi/BarChart'
import LineChart from '@/components/kpi/LineChart'
import DoughnutChart from '@/components/kpi/DoughnutChart'
import HorizontalBarChart from '@/components/kpi/HorizontalBarChart'
import ClickableHorizontalBarChart from '@/components/kpi/ClickableHorizontalBarChart'

import { mapGetters, mapState, mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  components: {
    Chart,
    DataLegend,
    GraphLayout,
    CountrySelect,
    Subtitle,
    ProjectStagesPolarChart,
    BarChart,
    LineChart,
    DoughnutChart,
    HorizontalBarChart,
    ClickableHorizontalBarChart,
  },

  data() {
    return {
      country: '',
      reloadPolarChart: 0,
      monthlyUsersTestData: {
        datasets: [
          {
          backgroundColor: '#49BCE8',
          barThickness: 'flex',
          data: [37, 42, 41, 101, 51, 44, 55, 29, 1, 0, 1, 1],
          label: 'Registered Users'
        },{
          backgroundColor: '#99CA67',
          barThickness: 'flex',
          data: [37, 42, 41, 101, 51, 44, 55, 29, 1, 0, 1, 1],
          label: 'Active Users'
        }
        ],
        labels: ["2020-Dec","2021-Jan","2021-Feb","2021-Mar","2021-Apr","2021-May","2021-Jun","2021-Jul","2021-Aug","2021-Sep","2021-Oct","2021-Nov"]
      },
      testStackedOptions: {
        legend: {
          display: true
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              offset: true,
              gridLines: { drawOnChartArea: false, drawTicks: false },
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Months',
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { fontSize: 10, padding: 15 }
            }
          ],
          yAxes: [
            {
              gridLines: { drawTicks: false },
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Growth of users',
                fontStyle: 'bold',
                fontColor: '#485465',
                lineHeight: 3
              },
              ticks: { fontSize: 10, padding: 15 }
            }
          ]
        }
      },
      testStackedData: {
        datasets: [
          {
            backgroundColor: "#BABABB",
            barThickness: 40,
            data: [0,0,0,1,0,734,0,41,5,3,0,13],
            length: 12,
            label: "Draft Projects"
          },
          {
            backgroundColor: "#FFAA33",
            barThickness: 40,
            data: [0,0,0,1,0,734,0,41,5,3,0,13],
            length: 12,
            label: "GG Project1s"
          },
          {
            backgroundColor: "#3398FF",
            barThickness: 40,
            data: [0,0,0,1,0,734,0,41,5,3,0,13],
            length: 12,
            label: "Draft Projects2"
          }
        ],
        labels: ["2020-Dec","2021-Jan","2021-Feb","2021-Mar","2021-Apr","2021-May","2021-Jun","2021-Jul","2021-Aug","2021-Sep","2021-Oct","2021-Nov"]
      }
    }
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
      horizontalBarA: state => state.charts.horizontalBarA,
      loading: state => state.charts.loading || false,
      filters: state => state.charts.filters,
      state: state => state
    }),
    ...mapGetters({
      countries: 'countries/getCountries'
    }),
    dataStandardsCount() {
      return this.horizontalBarA.chartData?.datasets[0].data.length > 0
        ? this.horizontalBarA.chartData.datasets[0].data.length
        : 0
    },
    dataStandardHeight() {
      return this.dataStandardsCount > 0 ? this.dataStandardsCount * 40 : 800
    }
  },
  methods: {
    ...mapActions({
      getDashboardData: 'charts/getDashboardData',
      handleBackClick: 'charts/handleBackClick',
      barClick: 'charts/handleBarClick',
      backClick: 'charts/handleBackClick',
      setFilters: 'charts/setFilters',
      // getProjectStatus: 'kpi/getDashboardData',
      getProjectStructure: 'charts/getProjectStructure',
      getStages: 'charts/getStages',
    }),
    handleBackClick() {
      this.backClick({ func: this.handleBarClick })
    },
    handleBarClick(point, event) {
      if (this.back.length === 0) {
        this.barClick({
          func: this.handleBarClick,
          idx: event[0]._index
        })
      }
    },
    handleCountry(country) {
      this.country = country
      this.setFilters({
        ...this.filters,
        country: country ? `${country}` : undefined
      })
      this.reloadPolarChart++
      this.debounceSearch()
    },
    allData() {
      return this.getDashboardData({
        func: this.handleBarClick,
        refresh: true,
        state: {},
        permissionLayer: false
      })
    },
    handleSearch() {
      this.getDashboardData({ func: this.handleBarClick, refresh: true, permissionLayer: false })
    },
    debounceSearch: debounce(function() {
      this.handleSearch()
    }, 500)
  },
  created() {
    this.handleSearch()

    console.log("this.horizontalBarB")
    console.log(this.state.charts)
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

/** KPI DEV STYLE **/
.KpiWrapper {
  padding: 0 40px 40px 40px;
  h2 {
    background-color: white;
    color: @colorBrandPrimary;
    padding: 40px;
    margin: 0;
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

  .graphMargin {
    margin-bottom: 40px;
  }
  .el-row {
    background: white;
  }

  ::v-deep .hfa-info {
    vertical-align: middle;
    position: absolute;
    right: 0;
    svg {
      cursor: pointer;
      position: absolute;
      top: 3px;
      color: @colorBrandPrimary;
      &:hover {
        color: @colorBrandPrimaryLight;
      }
    }
    .el-popover__title {
      font-size: @fontSizeLarge;
    }
  }
  .hfa-info-popover {
    p {
      word-break: normal;
    }
  }

  .info-ref {
    cursor: pointer;
    color: @colorBrandPrimary;
    margin-left: 0.5em;
    &:hover {
      color: @colorBrandPrimaryLight;
    }
  }

  .border-bottom {
    border-bottom: 1px solid #dcdfe6;
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
    text-transform: uppercase;
    font-size: @fontSizeSmall;
    letter-spacing: 0.5px;
    font-weight: 600;
    text-align: center;
    color: black;
  }

  .d-block {
    display: block;
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
}

</style>
