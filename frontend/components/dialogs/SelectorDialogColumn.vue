<template>
  <div class="SelectorDialogColumn">
    <div class="Header">
      <span v-show="!headerSelectable">{{ header }}</span>
      <el-checkbox
        v-show="headerSelectable"
        v-model="headerChecked"
      >
        {{ header }}
      </el-checkbox>
      <div class="Main">
        <selector-dialog-category
          v-for="category in items"
          :values="values"
          :key="category.id"
          :child-name="childName"
          :category-selectable="categorySelectable"
          :category="category"
          @change="emitChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectorDialogCategory from './SelectorDialogCategory';
export default {
  components: {
    SelectorDialogCategory
  },
  model: {
    prop: 'values',
    event: 'change'
  },
  props: {
    header: {
      type: String,
      required: true
    },
    headerSelectable: {
      type: Boolean,
      required: false,
      default: false
    },
    categorySelectable: {
      type: Boolean,
      required: false,
      default: false
    },
    childName: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      headerChecked: false
    };
  },
  methods: {
    emitChange (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style>

</style>
