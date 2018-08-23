<template>
  <div class="HealthSystemChallengesFilter">
    <selector-dialog-column
      :header-selectable="true"
      :selected="catSelected"
      header="Select from list"
      @headerSelected="toggleAll"
    >
      <selector-dialog-category
        v-for="hsc in healthSystemChallenges"
        v-model="selected"
        :key="hsc.id"
        :category-selectable="true"
        :category="hsc"
        child-name="challenges"
        name-prop="challenge"
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
      healthSystemChallenges: 'projects/getHscChallenges'
    }),
    ...mapGettersActions({
      selectedHSC: ['dashboard', 'getSelectedHSC', 'setSelectedHSC', 0]
    }),
    allIds () {
      return this.healthSystemChallenges.reduce((a, c) => {
        return [...a, ...c.challenges.map(h => h.id)];
      }, []);
    },
    catSelected (category) {
      return difference(this.allIds, this.selected).length === 0;
    }
  },
  mounted () {
    this.selected = [...this.selectedHSC];
  },
  methods: {

    save () {
      this.selectedHSC = [...this.selected];
    },
    clear () {
      this.selected = [];
    },
    toggleAll (value) {
      if (value) {
        this.selected = [...this.allIds];
      } else {
        this.selected = [];
      }
    }
  }
};
</script>

<style>

</style>
