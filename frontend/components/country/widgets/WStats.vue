<template>
  <div class="grid-content">
    <h3>State of Digital Health in {{ stats.name }} </h3>

    <div v-if="!simple" class="phases">
      <el-row v-for="(phase, i) in stats.phases" :key="i" v-if="phase.phase !== null">
        <p>{{ phase.title }}</p>
        <progress-bar :phase="phase.phase" />
      </el-row>
    </div>

    <el-row v-for="(group, i) in stats.groups" :key="i" :class="`number-info ${simple ? 'simple' : ''}`">
      <p><b>{{ group.title }}</b></p>
      <el-col v-for="(metric, k) in group.metrics" :key="k" :span="simple ? 24 : 12">
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
    },
    simple: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
  @import "../../../assets/style/variables.less";

  .phases {
    padding-bottom: 40px;
    p {
      margin-top: 6px!important;
      margin-bottom: 0px!important;
      line-height: 15px;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 300;
    }
  }
  .number-info {
    text-align: center;
    margin-bottom: 40px;
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

