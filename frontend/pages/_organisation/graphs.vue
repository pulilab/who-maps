<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="30" class="mb-80 sticky">
      <div class="resume-group border-bar">
        <el-row type="flex">
          <el-date-picker
            v-model="dateRange"
            type="monthrange"
            align="center"
            unlink-panels
            range-separator="To"
            start-placeholder="Start month"
            end-placeholder="End month"
            format="yyyy-MM"
            :clearable="false"
            class="input-search period"
            popper-class="date-popper"
            :picker-options="pickerOptions"
          />
          <el-divider direction="vertical" class="divider"></el-divider>
          <el-select
            v-model="region"
            filterable
            placeholder="Select region"
            clearable
            :disabled="disabledRegion"
            class="input-search"
          >
            <el-option
              v-for="item in regions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select
            v-model="country"
            filterable
            placeholder="Select country"
            clearable
            :disabled="disabledCountry"
            class="input-search"
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
          >
            <el-option
              v-for="item in donors"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            v-if="canClear"
            type="primary"
            icon="el-icon-close"
            class="btn-search"
            @click="clearFilter"
          >
            <translate>Clear</translate>
          </el-button>
        </el-row>
      </div>
    </el-row>
    <p class="headline">
      <translate>Kpi's integration</translate>
    </p>

    <p class="subtitle">
      <translate>Users</translate>
    </p>
    <el-row type="flex" :gutter="20" class="mb-80">
      <MonthlyUserActivity :span="24" :filters="filter" />
    </el-row>

    <p class="subtitle">
      <translate>API keys</translate>
    </p>
    <el-row type="flex" :gutter="20" class="mb-80">
      <MonthlyAPIKeys :span="24" :filters="filter" />
    </el-row>

    <p class="subtitle">
      <translate>Project status</translate>
    </p>
    <el-row type="flex" :gutter="20" class="mb-80 gap-20">
      <ProjectStatus :span="8" :filters="filter" />
      <MonthlyGrowthOfProjects :span="16" :filters="filter" />
    </el-row>

    <el-row type="flex" :gutter="20" class="mb-80">
      <ProjectStatusesPerMonth :span="24" :filters="filter" />
    </el-row>

    <p class="subtitle">
      <translate>Project stages</translate>
    </p>
    <el-row type="flex" :gutter="20" class="mb-80">
      <DistributionOfProjectStages :span="24" :filters="filter" />
    </el-row>

    <el-row type="flex" :gutter="20" class="mb-80">
      <TopDataStandards :span="24" :top="20" :filters="filter" />
    </el-row>

    <p class="subtitle">
      <translate>Health Focus Areas</translate>
    </p>
    <el-row type="flex" :gutter="20" class="mb-80 gap-20">
      <HealthFocusAreasCoverage :span="8" :filters="filter" />
      <HealthFocusAreas :span="16" :filters="filter" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { objectToQueryString } from '@/utilities/charts'
import MonthlyUserActivity from '~/components/charts/MonthlyUserActivity.vue'
import MonthlyAPIKeys from '~/components/charts/MonthlyAPIKeys.vue'
import ProjectStatus from '~/components/charts/ProjectStatus.vue'
import MonthlyGrowthOfProjects from '~/components/charts/MonthlyGrowthOfProjects.vue'
import ProjectStatusesPerMonth from '~/components/charts/ProjectStatusesPerMonth.vue'
import DistributionOfProjectStages from '~/components/charts/DistributionOfProjectStages.vue'
import TopDataStandards from '~/components/charts/TopDataStandards.vue'
import HealthFocusAreasCoverage from '~/components/charts/HealthFocusAreasCoverage.vue'
import HealthFocusAreas from '~/components/charts/HealthFocusAreas.vue'

export default {
  components: {
    MonthlyUserActivity,
    MonthlyAPIKeys,
    ProjectStatus,
    MonthlyGrowthOfProjects,
    ProjectStatusesPerMonth,
    DistributionOfProjectStages,
    TopDataStandards,
    HealthFocusAreasCoverage,
    HealthFocusAreas
  },
  data() {
    return {
      region: '',
      country: '',
      investor: '',
      pickerOptions: {
        shortcuts: [
          {
            text: this.$gettext('Last 6 months'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$gettext('Year to date'),
            onClick (picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$gettext('Year back from date'),
            onClick (picker) {
              const end = new Date()
              const start = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              picker.$emit('pick', [start, end])
            }
          },
        ]
      },
      dateRange: null
    }
  },
  created() {
    this.dateRange = [
      new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      new Date()
    ]
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries',
      donors: 'system/getDonors',
      regionsRaw: 'system/getRegions'
    }),
    regions() {
      return this.regionsRaw.map(r => ({
        ...r,
        id: r.id.toString()
      }))
    },
    filter() {
      return {
        region: this.region ? `${this.region}` : undefined,
        country: this.country ? `${this.country}` : undefined,
        investor: this.investor ? `${this.investor}` : undefined,
        from: this.dateRange ? format(this.dateRange[0], 'YYYY-MM') : undefined,
        to: this.dateRange ? format(this.dateRange[1], 'YYYY-MM') : undefined,
      }
    },
    filterString() {
      return objectToQueryString(this.filter)
    },
    canClear() {
      return this.region !== '' || this.country !== '' || this.investor !== ''
    },
    disabledRegion() {
      return this.country !== ''
    },
    disabledCountry() {
      return this.region !== ''
    }
  },
  methods: {
    clearFilter() {
      this.region = ''
      this.country = ''
      this.investor = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';
.gap-20 {
  gap: 20px;
}
.mb-80 {
  margin-bottom: 80px;
}
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
::v-deep .hfa-info {
  position: absolute;
  right: 0;
  svg {
    cursor: pointer;
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
.divider {
  margin-right: 23px;
  height: 40px;
}
</style>