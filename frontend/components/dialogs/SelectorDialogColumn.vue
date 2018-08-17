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
    </div>
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

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SelectorDialogColumn {
    .Header {
      padding: 0 30px;
      height: @dialogHeaderFooterHeight;
      line-height: @dialogHeaderFooterHeight;
      border-bottom: 1px solid @colorGrayLight;
      background-color: @colorGrayLightest;
      font-size: @fontSizeBase;
      font-weight: 700;
      text-transform: uppercase;
    }

    .Main {
      padding: 20px 20px 20px 30px;
    }
  }
</style>
