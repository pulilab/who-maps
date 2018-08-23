<template>
  <div class="PlatformFilter">
    <selector-dialog-column
      :header-selectable="true"
      :selected="catSelected"
      header="Select from list"
      @headerSelected="toggleAll"
    >
      <selector-dialog-category
        v-model="selected"
        :category="platforms"
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
      platforms: 'projects/getTechnologyPlatforms'
    }),
    ...mapGettersActions({
      selectedPlatforms: ['dashboard', 'getSelectedPlatforms', 'setSelectedPlatforms', 0]
    }),
    catSelected () {
      const ids = this.platforms.map(s => s.id);
      return difference(ids, this.selected).length === 0;
    }
  },
  mounted () {
    this.selected = [...this.selectedPlatforms];
  },
  methods: {
    save () {
      this.selectedPlatforms = [...this.selected];
    },
    clear () {
      this.selected = [];
    },
    toggleAll (value) {
      if (value) {
        this.selected = [...this.platforms.map(s => s.id)];
      } else {
        this.selected = [];
      }
    }
  }
};
</script>

<style>

</style>
