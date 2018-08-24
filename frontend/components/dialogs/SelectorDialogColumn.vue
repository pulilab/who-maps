<template>
  <div class="SelectorDialogColumn">
    <div class="Header">
      <span v-show="!headerSelectable">{{ header }}</span>
      <el-checkbox
        v-show="headerSelectable"
        :value="selected"
        @change="headerSelected"
      >
        {{ header }}
      </el-checkbox>
    </div>
    <div class="Main">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    header: {
      type: String,
      required: true
    },
    headerSelectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
    headerSelected (value) {
      this.$emit('headerSelected', value);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SelectorDialogColumn {
    position: relative;

    .Header {
      position: fixed;
      z-index: 10000;
      box-sizing: border-box;
      padding: 0 30px;
      width: calc((90vw / 4) - 1px);
      max-width: calc((@appWidthMaxLimit * 0.9) / 4 - 1px);
      height: @dialogHeaderFooterHeight;
      line-height: @dialogHeaderFooterHeight;
      border-bottom: 1px solid @colorGrayLight;
      background-color: @colorGrayLightest;
      font-size: @fontSizeBase;
      font-weight: 700;
      text-transform: uppercase;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);

      .el-checkbox {
        .el-checkbox__label {
          font-weight: 700;
        }
      }
    }

    .Main {
      position: relative;
      top: @dialogHeaderFooterHeight;
      padding: 20px 20px 50px 30px;
      height: calc(80vh - (@dialogHeaderFooterHeight * 4) - 4px);
      overflow-y: scroll;
    }
  }
</style>
