<template>
  <div class="grid-content">
    <h3>State of Digital Health in Sierra Leone</h3>

    <progress-bar />
    <progress-bar phase="phase-2" />
    <progress-bar phase="phase-3" />
    <progress-bar phase="phase-4" />
    <progress-bar phase="phase-5" />


    <el-row v-for="(group, i) in stats.groups" :key="i" class="number-info">
      <p><b>{{ group.title }}</b></p>
      <el-col v-for="(metric, k) in group.metrics" :key="k" :span="12">
        <h3>{{metric.value}}</h3>
        <p>{{metric.measure}}</p>
      </el-col>
    </el-row>

    <footer>
      <p>Disclaimer: State of Digital Health data is sourced</p>
      <p>from the Global Digital Health Index.</p>
      <p>
        <a href="/images/myw3schoolsimage.jpg" target="_blank">
          Visit digitalhealthindex.org
        </a>
      </p>
    </footer>

  </div>
</template>

<script>
import ProgressBar from '@/components/country/commons/ProgressBar';

export default {
  name: 'WStats',
  components: {
    ProgressBar
  },
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
  @import "../../../assets/style/variables.less";

  .number-info {
    text-align: center;
    margin-bottom: 26px;
    .el-col {
      h3 {
        font-size: 18px;
        text-transform: uppercase;
        margin-bottom: 6px!important;
      }
      p {
        margin-bottom: 0px!important;
        line-height: 15px;
        font-size: 10px;
        text-transform: uppercase;
        padding: 0 10%;
      }
    }
  }
  footer {
    margin-top: 15px;
    text-align: center;
    font-size: 12px;
    p {
      margin-bottom: 0px!important;
    }
    a {
      color: @colorBrandPrimary;
      text-decoration: none;
      cursor: pointer;
    }
  }

</style>

