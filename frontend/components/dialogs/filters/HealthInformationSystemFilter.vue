<template>
  <div class="HealthInformationSystem">
    <selector-dialog-column
      :header-selectable="true"
      :selected="catSelected"
      header="Select from list"
      @headerSelected="toggleAll"
    >
      <selector-dialog-category
        v-model="selected"
        :category="healthInformationSystems"
        hide-header
      />
    </selector-dialog-column>
  </div>
</template>

<script>
import difference from 'lodash/difference';
import SelectorDialogColumn from '../SelectorDialogColumn';
import SelectorDialogCategory from '../SelectorDialogCategory';
import { mapGetters } from 'vuex';
import { mapGettersActions } from '../../../utilities/form.js';

export default {
  components: {
    SelectorDialogColumn,
    SelectorDialogCategory
  },
  data () {
    return {
      selected: []
    };
  },
  computed: {
    ...mapGetters({
      healthInformationSystems: 'projects/getHisBucket'
    }),
    ...mapGettersActions({
      selectedHIS: ['dashboard', 'getSelectedHIS', 'setSelectedHIS', 0]
    }),
    catSelected () {
      const ids = this.healthInformationSystems.map(s => s.id);
      return difference(ids, this.selected).length === 0;
    }
  },
  mounted () {
    this.selected = [...this.selectedHIS];
  },
  methods: {
    save () {
      this.selectedHIS = [...this.selected];
    },
    clear () {
      this.selected = [];
    },
    toggleAll (value) {
      if (value) {
        this.selected = [...this.healthInformationSystems.map(s => s.id)];
      } else {
        this.selected = [];
      }
    }
  }
};
</script>

<style>

</style>
