<template>
  <div class="HealthFocusAreaFilter">
    <selector-dialog-column
      :selected="catSelected"
      :header="$gettext('Select from list') | translate"
      @headerSelected="toggleAll"
    >
      <el-input
        v-model="search"
        class="ma-i"
        :placeholder="$gettext('Type name (eg: COVID-19)') | translate"
        prefix-icon="el-icon-search"
        clearable
      />
      <template v-if="filterFocusArea.length > 0">
        <selector-dialog-category
          v-for="hfa in filterFocusArea"
          :key="hfa.id"
          :values="selected"
          :category="hfa"
          child-name="health_focus_areas"
          name-prop="name"
          expand-collapse
          initial-toggle
          arrow-right
          :category-selectable="true"
          @change="filterChange"
        />
      </template>
      <template v-else>
        <div class="empty-filter">
          <p><translate>Can't find anything related to</translate> <b>{{ search }}</b>.</p>
          <p><translate>Please, try again.</translate></p>
        </div>
      </template>
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
      const filtered = [];
      this.healthFocusAreas.forEach(
        (item) => {
          const health_focus_areas = item.health_focus_areas.filter((item) => item.name.toLowerCase().includes(this.search.toLowerCase()));
          const category_name = item.name.toLowerCase().includes(this.search.toLowerCase());

          if (category_name || health_focus_areas.length > 0) {
            filtered.push({
              ...item,
              health_focus_areas
            });
          }
        }
      );
      return filtered;
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
.empty-filter {
  margin: 60px;
  text-align: center;
}
</style>
