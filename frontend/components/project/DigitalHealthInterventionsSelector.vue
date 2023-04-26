<template>
  <div class="DigitalHealthInterventionsSelector">
    <el-button v-show="dhis.length === 0" class="IconLeft" @click="openDialog">
      <fa icon="plus" />
      <translate>Add Digital Health Interventions</translate>
    </el-button>
    <div v-show="dhis.length > 0" class="HasSelectedItems">
      <ul class="SelectedDigitalHealthInterventions">
        <li v-for="(dhi,i) in selectedDHIs" :key="i">
          <fa icon="check" size="xs" />
          <span>{{ dhi }}</span>
        </li>
      </ul>
      <el-button class="IconLeft" @click="openDialog">
        <fa icon="edit" />
        <translate>Edit selection</translate>
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    dhis: {
      type: Array,
      default: () => []
    }
  },
  $_veeValidate: {
    value() {
      return this.dhis
    },
    events: 'change'
  },
  computed: {
    ...mapGetters({
      getDhi: 'projects/getDigitalHealthInterventionDetails',
    }),
    selectedDHIs() {
      return this.dhis
        ? this.dhis
            .map((dhi) => this.getDhi(dhi).name)
            .sort((a, b) => a.localeCompare(b))
        : []
    }
  },
  watch: {
    dhis: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('change')
      }
    }
  },
  methods: {
    ...mapActions({
      setDigitalHealthInterventionsDialogState: 'layout/setDigitalHealthInterventionsDialogState'
    }),
    openDialog() {
      this.setDigitalHealthInterventionsDialogState(true)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.DigitalHealthInterventionsSelector {
  .el-button {
    margin-bottom: 10px;
  }

  ul.SelectedDigitalHealthInterventions {
    list-style-type: none;
    display: block;
    margin: 0 0 30px;
    padding: 0;

    li {
      position: relative;
      margin-bottom: 20px;
      padding-left: 22px;
      line-height: 19px;
      color: @colorBrandPrimary;

      .svg-inline--fa {
        position: absolute;
        top: 4px;
        left: 0;
      }
    }
  }
}
</style>
