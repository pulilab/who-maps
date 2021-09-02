<template>
  <div class="wrapper">
    <el-row
      type="flex"
      :gutter="30"
      class="mb-80 sticky"
    >
      <div class="resume-group border-bar">
        <el-row type="flex">
          <el-select
            v-model="country"
            filterable
            placeholder="Select country"
            clearable
            class="input-search"
            :disabled="loading"
            @change="handleCountry"
          >
            <el-option
              v-for="item in countries"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="investor"
            filterable
            placeholder="Select investor"
            clearable
            class="input-search"
            :disabled="loading"
            @change="handleInvestor"
          >
            <el-option
              v-for="item in donors"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="monthrange"
            align="center"
            unlink-panels
            range-separator="To"
            start-placeholder="Start month"
            end-placeholder="End month"
            format="yyyy-MM"
            class="input-search"
            :disabled="loading"
            :picker-options="pickerOptions"
            @change="handleDate"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            class="btn-search"
            :loading="loading"
            @click="handleSearch"
          >
            <translate>Search</translate>
          </el-button>
        </el-row>
      </div>
    </el-row>

    <!-- full integration -->
    <p class="headline">
      <translate>Kpi's integration</translate>
    </p>
    <!-- users -->
    <p class="subtitle">
      <translate>Users</translate>
    </p>

    <el-row
      type="flex"
      class="mb-80"
    >
      <graph-layout :span="24">
        <translate>Monthly User Activity</translate>
        <template #graph>
          <chart
            v-if="barA.chartData"
            type="bar-chart"
            :chart-data="barA.chartData"
            :options="barA.options"
            :height="300"
          />
        </template>
        <template #legend>
          <data-legend
            :items="monthlyUserLegend"
            horizontal
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- api keys -->
    <p class="subtitle">
      <translate>API keys</translate>
    </p>
    <el-row
      type="flex"
      class="mb-80"
    >
      <graph-layout :span="24">
        <translate>Monthly growth of API keys</translate>
        <template #graph>
          <chart
            :chart-data="lineC.chartData || {}"
            :options="lineC.options"
            :height="300"
          />
        </template>
      </graph-layout>
    </el-row>

    <!-- project status -->
    <p class="subtitle">
      <translate>Project status</translate>
    </p>
    <el-row
      type="flex"
      :gutter="20"
      class="mb-80"
    >
      <graph-layout :span="8">
        <template #graph>
          <chart
            type="doughnut"
            :width="160"
            :height="160"
            :chart-data="doughnutA.chartData || {}"
            :options="doughnutA.options"
          />
        </template>
        <template #legend>
          <data-legend
            :items="doughnutALegend"
            large
          />
        </template>
      </graph-layout>
      <graph-layout :span="16">
        <translate>Monthly growth of Projects</translate>
        <template #graph>
          <chart
            :chart-data="lineA.chartData || {}"
            :options="lineA.options"
            :height="360"
          />
        </template>
      </graph-layout>
    </el-row>

    <el-row
      type="flex"
      class="mb-80"
    >
      <graph-layout :span="24">
        <translate>Project statuses per month</translate>
        <template #graph>
          <chart
            type="bar-chart"
            :chart-data="barB.chartData || {}"
            :options="barB.options"
            :height="300"
          />
        </template>
        <template #legend>
          <DataLegend :items="projectStatusLegend" horizontal />
        </template>
      </graph-layout>
    </el-row>

    <!-- Project stages -->
    <p class="subtitle">
      <translate>Project stages</translate>
    </p>
    <el-row
      type="flex"
      :gutter="20"
      class="mb-80"
    >
      <graph-layout
        :span="24"
        horizontal
      >
        <translate>Distributions of projects’ stages</translate>
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
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { format } from 'date-fns'
import debounce from 'lodash/debounce'

import DataLegend from '@/components/common/charts/utilities/DataLegend'
import Chart from '@/components/common/charts/Chart'
import GraphLayout from '@/components/common/charts/widgets/GraphLayout'

export default {
  components: {
    Chart,
    GraphLayout,
    DataLegend
  },
  data () {
    return {
      // filters
      country: '',
      investor: '',
      // date range
      pickerOptions: {
        shortcuts: [
          {
            text: this.$gettext('This month'),
            onClick (picker) {
              picker.$emit('pick', [new Date(), new Date()])
            }
          },
          {
            text: this.$gettext('This year'),
            onClick (picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$gettext('Last 6 months'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      dateRange: ''
    }
  },
  computed: {
    ...mapState({
      incoming: state => state.charts.incoming,
      previous: state => state.charts.previous,
      // graphs
      polarA: state => state.charts.polarA,
      lineA: state => state.charts.lineA,
      lineC: state => state.charts.lineC,
      barA: state => state.charts.barA,
      barB: state => state.charts.barB,
      doughnutA: state => state.charts.doughnutA,
      // legends
      polarALegend: state => state.charts.polarALegend,
      noStageDataSum: state => state.charts.noStageDataSum,
      doughnutALegend: state => state.charts.doughnutALegend,
      monthlyUserLegend: state => state.charts.monthlyUserLegend,
      projectStatusLegend: state => state.charts.projectStatusLegend,
      countryTable: state => state.charts.countryTable,
      // back click hfa system
      back: state => state.charts.back,
      subtitle: state => state.charts.subtitle,
      // filters
      filters: state => state.charts.filters,
      loading: state => state.charts.loading
    }),
    ...mapGetters({
      countries: 'countries/getCountries',
      donors: 'system/getDonors'
    })
  },
  created () {
    this.handleSearch()
  },
  methods: {
    ...mapActions({
      getDashboardData: 'charts/getDashboardData',
      handleBackClick: 'charts/handleBackClick',
      barClick: 'charts/handleBarClick',
      backClick: 'charts/handleBackClick',
      setFilters: 'charts/setFilters'
    }),
    handleSearch () {
      this.getDashboardData({ func: this.handleBarClick, refresh: true })
    },
    handleBarClick (point, event) {
      this.barClick({ func: this.handleBarClick, idx: event[0]._index })
    },
    handleBackClick () {
      this.backClick({ func: this.handleBarClick })
    },
    handleDate (range) {
      let newRange = {}
      if (range === null) {
        newRange = { from: undefined, to: undefined }
      } else {
        newRange = {
          from: format(range[0], 'YYYY-MM'),
          to: format(range[1], 'YYYY-MM')
        }
      }
      this.setFilters({
        ...this.filters,
        ...newRange
      })
      this.debounceSearch()
    },
    handleCountry (country) {
      this.setFilters({
        ...this.filters,
        country: country ? `${country}` : undefined
      })
      this.debounceSearch()
    },
    handleInvestor (investor) {
      this.setFilters({
        ...this.filters,
        investor: investor ? `${investor}` : undefined
      })
      this.debounceSearch()
    },
    debounceSearch: debounce(function () {
      this.handleSearch()
    }, 500)
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';

.wrapper {
  padding: 80px 60px;
  background-color: #f2f2f2;
  position: relative;

  .resume-group {
    background-color: white;
    padding: 16px 40px;
    margin: 0 15px;
    width: 100%;
    .input-search {
      margin-right: 16px;
    }
    .btn-search {
      margin-left: auto;
    }
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
.headline {
  text-align: center;
  line-height: 1.166666667;
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 2.25rem;
  font-weight: 700;
}
.subtitle {
  color: @colorTextSecondary;
  text-align: center;
  font-style: italic;
  margin: 0 0 18px 0;
  font-size: 1.125rem;
  line-height: 1.7;
}
</style>
