<template>
  <el-dialog
    :visible.sync="visible"
    title="Health focus area"
    modal
    width="90%"
    @open="loadCurrentSelection"
  >
    <el-row type="flex">
      <el-col
        v-for="category in digitalHealthInterventions"
        :key="category.name"
        :span="6"
      >
        <selector-dialog-column
          :items="category.subGroups"
          v-model="currentSelection"
          :category-selectable="true"
          :header="category.name"
          child-name="strategies"
        />
      </el-col>
    </el-row>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button @click="clearAll">Clear All</el-button>
      <el-button
        type="primary"
        @click="apply"
      >
        Confirm
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SelectorDialogColumn from './SelectorDialogColumn';

export default {
  components: {
    SelectorDialogColumn
  },
  data () {
    return {
      currentSelection: []
    };
  },
  computed: {
    ...mapGetters({
      selectedPlatform: 'layout/getDigitalHealthInterventionsDialogState',
      digitalHealthInterventions: 'projects/getDigitalHealthInterventions',
      selectedDHi: 'projects/getCurrentProjectDHI'
    }),
    savedSelection () {
      return this.selectedDHi.filter(dhi => dhi.platform === this.selectedPlatform).map(dhi => dhi.id);
    },
    visible: {
      get () {
        return this.selectedPlatform !== null;
      },
      set () {
        this.setDigitalHealthInterventionsDialogState(null);
      }
    }
  },
  methods: {
    ...mapActions({
      setDigitalHealthInterventionsDialogState: 'layout/setDigitalHealthInterventionsDialogState',
      setCurrentProjectDHI: 'projects/setCurrentProjectDHI'
    }),

    loadCurrentSelection () {
      this.currentSelection = [...this.savedSelection];
    },
    clearAll () {
      this.currentSelection = [];
    },
    cancel () {
      this.setDigitalHealthInterventionsDialogState(null);
    },
    apply () {
      const dhi = this.currentSelection.map(id => ({ platform: this.selectedPlatform, id }));
      this.setCurrentProjectDHI(dhi);
      this.setDigitalHealthInterventionsDialogState(null);
    }
  }
};
</script>

<style>

</style>
