<template>
  <el-col v-loading="currentlyLoading" v-bind="{ ...$props, ...$attrs }">
    <translate class="kpiHeader pt-30 pb-30 d-block">Projects Statistics</translate>
    <div class="counterBox">
      <translate class="title">Totals amount</translate>
      <span class="number">{{ totalProjects }}</span>
    </div>
    <div class="counterBox">
      <translate class="title">Since last month</translate>
      <span class="number">{{ sinceLastMonth }}</span>
    </div>
  </el-col>
</template>

<script>
import { objectToQueryString } from '@/utilities/charts'
const base = '/api/kpi'

export default {
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      currentlyLoading: false,
      totalProjects: 0,
      sinceLastMonth: 0,
    }
  },
  methods: {
    async getProjectStatus() {
      const response = await this.$axios.get(
        `${base}/project-status/${objectToQueryString(this.filters)}`
      )
      return response.data
    },
    async loadChart() {
      this.currentlyLoading = true
      const projectStatus = await this.getProjectStatus()

      this.totalProjects = projectStatus.reduce((partialSum, status) => partialSum + status.published, 0)
      this.sinceLastMonth = projectStatus[projectStatus.length - 1].published

      this.currentlyLoading = false
    }
  },
  async mounted() {
    await this.loadChart()
  },
  watch: {
    filters: async function(newValue, oldValue) {
      await this.loadChart()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/variables.less';

.kpiHeader {
  text-transform: uppercase;
  font-size: @fontSizeSmall;
  letter-spacing: 0.5px;
  font-weight: 600;
  text-align: center;
  color: black;
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

</style>