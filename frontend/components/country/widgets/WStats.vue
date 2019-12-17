<template>
  <div class="grid-content">
    <h3><translate>State of Digital Health in</translate> {{ stats.name }} </h3>

    <div v-if="!simple" class="phases">
      <template v-for="(phase, i) in stats.phases" >
        <el-row v-if="phase.phase !== null" :key="i">
          <p><translate>{{ phase.title }}</translate></p>
          <progress-bar :phase="phase.phase" />
        </el-row>
      </template>
    </div>

    <el-row v-for="(group, i) in stats.groups" :key="i" :class="`number-info ${simple ? 'simple' : ''}`">
      <p><b><translate>{{ group.title }}</translate></b></p>
      <el-col v-for="(metric, k) in group.metrics" :key="k" :span="simple ? 24 : 12">
        <h3>{{metric.value}}</h3>
        <p><translate>{{metric.measure}}</translate></p>
      </el-col>
    </el-row>

    <footer>
      <p><translate>Disclaimer: State of Digital Health data is sourced</translate></p>
      <p><translate>from the Global Digital Health Index.</translate></p>
      <p>
        <a href="https://www.digitalhealthindex.org/" target="_blank">
          <translate>Visit digitalhealthindex.org</translate>
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
        max-width: 180px;
        margin-left: auto!important;
        margin-right: auto!important;
      }
    }
    &.simple {
      border-bottom: 1px solid #E0E0E0;
      &:first-of-type {
        margin-top: 40px;
      }
      &:last-of-type {
        border-bottom: none;
      }
      p {
        font-size: 18px;
      }
      .el-col{
        margin-bottom: 40px;
        h3 {
          font-size: 24px;
        }
        p {
          font-size: 12px;
        }
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

