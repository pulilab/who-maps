<template>
  <div class="DigitalHealthInterventionsSelector">
    <el-button
      v-show="dhi.length === 0"
      @click="openDialog"
    >
      <fa icon="plus"/>
      Add Digital Health Interventions
    </el-button>
    <div
      v-show="dhi.length > 0"
      class="HasSelectedItems">
      <ul class="SelectedDigitalHealthInterventions">
        <li
          v-for="item in dhi"
          :key="item.id">
          <fa icon="check" />
          <digital-health-intervention-item :id="item.id" />
        </li>
      </ul>
      <el-button
        @click="openDialog"
      >
        <fa icon="edit"/>
        Edit Selection
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DigitalHealthInterventionItem from '../common/DigitalHealthInterventionItem';

export default {
  components: {
    DigitalHealthInterventionItem
  },
  props: {
    platformId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      selectedDHI: 'project/getDigitalHealthInterventions'
    }),
    dhi () {
      return this.selectedDHI.filter(dhi => dhi.platform === this.platformId);
    }
  },
  methods: {
    ...mapActions({
      setDigitalHealthInterventionsDialogState: 'layout/setDigitalHealthInterventionsDialogState'
    }),
    openDialog () {
      this.setDigitalHealthInterventionsDialogState(this.platformId);
    }
  }
};
</script>

<style>

</style>
