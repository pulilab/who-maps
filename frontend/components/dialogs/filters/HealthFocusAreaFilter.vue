<template>
  <div class="HealthFocusAreaFilter">
    <selector-dialog-column
      :selected="catSelected"
      :header="$gettext('Select from list') | translate"
      @headerSelected="toggleAll"
    >
      <el-input
        class="ma-i"
        :placeholder="$gettext('Filter health focus areas') | translate"
        prefix-icon="el-icon-search"
        v-model="search">
      </el-input>
      <selector-dialog-category
        v-for="hfa in filterFocusArea"
        :key="hfa.id"
        :values="selected"
        :category="hfa"
        child-name="health_focus_areas"
        name-prop="name"
        expandCollapse
        :categorySelectable="true"
        @change="filterChange"
      />
    </selector-dialog-column>
  </div>
</template>

<script>
import difference from 'lodash/difference';
import SelectorDialogColumn from '../SelectorDialogColumn';
import SelectorDialogCategory from '../SelectorDialogCategory';
import { mapGetters } from 'vuex';

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
  data () {
    return {
      search: ''
    };
  },
  computed: {
    ...mapGetters({
      healthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    catSelected () {
      const ids = this.healthFocusAreas.map(s => s.id);
      return difference(ids, this.selected).length === 0;
    },
    filterFocusArea () {
      return this.healthFocusAreas.filter((item) => item.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods: {
    filterChange (value) {
      this.$emit('update:selected', [...value]);
    },
    toggleAll (value) {
      if (value) {
        this.$emit('update:selected', [...this.healthFocusAreas.map(s => s.id)]);
      } else {
        this.$emit('update:selected', []);
      }
    }
  }
};
</script>

<style>
.ma-i {
  margin: 10px 0 20px;
}
</style>
