<template>
  <div
    id="stages"
    class="graph"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Completion of Project stages') | translate"
    >
      <line-chart
        v-if="loaded"
        :chartdata="chartdata"
        :options="options"
        class="graph__line"
      />

      <section class="graph__legend">
        <ul class="legend">
          <li><translate>Legend:</translate></li>
          <li><translate>Project start date</translate></li>
          <li><translate>Project end date</translate></li>
          <li><div class="legend__cirle legend__circle--blue" /><translate>Stage completion date</translate></li>
          <li><div class="legend__cirle legend__circle--grey" /><translate>Next stage (incomplete)</translate></li>
          <li><translate>Completion period</translate></li>
          <li><translate>Current period</translate></li>
        </ul>
        <p><translate>The date under a stage represents when that stage was completed.</translate></p>
      </section>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from '../CollapsibleCard';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    CollapsibleCard
  },
  data: () => ({
    loaded: false
  }),
  computed: {
    ...mapState({
      chartdata: state => state.charts.stages.chartdata,
      options: state => state.charts.stages.options,
      stagesDraft: state => state.project.stagesDraft
    })
  },
  async mounted () {
    await this.loadStagesDraft();
    this.getStageData(this.stagesDraft);
    await setTimeout(() => { this.loaded = true; }, 250);
  },
  methods: {
    ...mapActions({
      getStageData: 'charts/getStageData',
      loadStagesDraft: 'project/loadStagesDraft'
    })
  }
};
</script>

<style lang="less" >
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .graph {
    // outside modifiers
    .CollapsibleCard .ContentContainer{
      padding: 0;
    }
    .graph__line {
      padding: 30px 20px 40px;
    }
    .graph__legend {
      width: 100%;
      background-color: #F8F8F8;
      color: #9E9E9E;
      text-align: center;
      font-size: 11px;
      padding: 22px 33px;
    }
    .legend {
      li {
        display: inline-block;
        padding: 0 10px;
      }
    }
    .legend__cirle {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: -1px;
      width: 10px;
      height: 10px;
      border-radius: 10px;
    }
    .legend__circle--blue {
      background-color: @colorBrandPrimary;
    }
    .legend__circle--grey {
      width: 6px;
      height: 6px;
      background-color: @colorWhite;
      border: 2px solid @colorTextMuted;
    }
  }
</style>
