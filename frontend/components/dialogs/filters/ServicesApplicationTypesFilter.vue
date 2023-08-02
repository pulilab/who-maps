<template>
  <div class="HealthSystemChallengesFilter">
    <selector-dialog-column
      :header-selectable="true"
      :selected="catSelected"
      :header="$gettext('Select from list') | translate"
      @headerSelected="toggleAll"
    >
      <selector-dialog-category
        v-for="sapp in applicationTypes"
        :key="sapp.id"
        :values="selected"
        :category="sapp"
        child-name="services"
        name-prop="name"
        always-expand-category
        @change="filterChange"
      />
    </selector-dialog-column>
  </div>
</template>

<script>
import difference from 'lodash/difference'
import SelectorDialogColumn from '../SelectorDialogColumn'
import SelectorDialogCategory from '../SelectorDialogCategory'
import { mapGetters } from 'vuex'

export default {
  components: {
    SelectorDialogColumn,
    SelectorDialogCategory
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      applicationTypes: 'projects/getApplicationTypes'
    }),
    allIds() {
      return this.applicationTypes.reduce((a, c) => {
        return [...a, ...c.services.map(h => h.id)]
      }, [])
    },
    catSelected(category) {
      return difference(this.allIds, this.selected).length === 0
    }
  },
  methods: {
    filterChange(value) {
      this.$emit('update:selected', [...value])
    },
    toggleAll(value) {
      if (value) {
        this.$emit('update:selected', [...this.allIds])
      } else {
        this.$emit('update:selected', [])
      }
    }
  }
}
</script>

<style></style>
