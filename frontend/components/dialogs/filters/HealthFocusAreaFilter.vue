<template>
  <div class="HealthFocusAreaFilter">
    <selector-dialog-column
      :header-selectable="true"
      :selected="catSelected"
      header="Select from list"
      @headerSelected="toggleAll"
    >
      <selector-dialog-category
        v-model="selected"
        :category-selectable="true"
        :category="healthFocusAreas"
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
      healthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    ...mapGettersActions({
      selectedHFA: ['dashboard', 'getSelectedHFA', 'setSelectedHFA', 0]
    }),
    catSelected () {
      const ids = this.healthFocusAreas.map(s => s.id);
      return difference(ids, this.selected).length === 0;
    }
  },
  mounted () {
    this.selected = [...this.selectedHFA];
  },
  methods: {
    save () {
      this.selectedHFA = [...this.selected];
    },
    clear () {
      this.selected = [];
    },
    toggleAll (value) {
      if (value) {
        this.selected = [...this.healthFocusAreas.map(s => s.id)];
      } else {
        this.selected = [];
      }
    }
  }
};
</script>

<style>

</style>
