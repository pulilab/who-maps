<template>
  <div
    id="stagesHistory"
    class="StageHistory"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('History of project stage') | translate"
    >
      <line-chart
        v-if="loaded"
        :chartdata="chartdata"
        :options="options"
      />
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
      chartdata: state => state.charts.chartdata,
      options: state => state.charts.options,
    })
  },
  async mounted () {
    await this.getStageData()
    setTimeout(() => this.loaded = true, 250);
  },
  methods: {
    ...mapActions({
      getStageData: 'charts/getStageData',
    })
  }
};
</script>
