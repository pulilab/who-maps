<template>
  <div class="DigitalHealthInterventionsFilter">
    <el-row
      type="flex"
    >
      <el-col
        v-for="category in digitalHealthInterventions"
        :key="category.name"
        :span="6"
      >
        <selector-dialog-column
          :header-selectable="true"
          :header="category.name"
          :selected="catSelected(category)"
          @headerSelected="toggleAll($event, category)"
        >
          <selector-dialog-category
            v-model="selected"
            :category-selectable="true"
            :category="category.subGroups"
            hide-header
          />
        </selector-dialog-column>
      </el-col>
    </el-row>
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
      digitalHealthInterventions: 'projects/getDigitalHealthInterventions'
    }),
    ...mapGettersActions({
      selectedDHI: ['dashboard', 'getSelectedDHI', 'setSelectedDHI', 0]
    })
  },
  mounted () {
    this.selected = [...this.selectedDHI];
  },
  methods: {
    catSelected (category) {
      const ids = this.categoryIds(category);
      return difference(ids, this.selected).length === 0;
    },
    save () {
      this.selectedDHI = [...this.selected];
    },
    clear () {
      this.selected = [];
    },
    categoryIds (category) {
      return category.subGroups.map(s => s.id);
    },
    toggleAll (value, category) {
      const categoryIds = this.categoryIds(category);
      if (value) {
        this.selected = [...this.selected, ...categoryIds];
      } else {
        this.selected = this.selected.filter(s => !categoryIds.includes(s));
      }
    }
  }
};
</script>

<style>

</style>
