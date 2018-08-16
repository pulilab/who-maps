<template>
  <el-row class="CheckboxAndLink">
    <el-col :span="12">
      <el-checkbox
        :value="selected"
        @change="selectedChangeHandler">
        {{ item.pre }} {{ item.name }}
      </el-checkbox>
    </el-col>
    <el-col :span="12">
      <el-input
        :disabled="!selected"
        :value="link"
        placeholder="Specify URL"
        type="text"
        @change="linkChangeHandler"
      />
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    interoperabilityLinks: {
      type: Object,
      required: true
    }
  },
  computed: {
    interoperabilityLink () {
      if (this.interoperabilityLinks && this.item) {
        return this.interoperabilityLinks[this.item.id] || {};
      }
      return {};
    },
    selected () {
      return this.interoperabilityLink.selected;
    },
    link () {
      return this.interoperabilityLink.link;
    }
  },
  methods: {
    selectedChangeHandler (selected) {
      const ir = { ...this.interoperabilityLinks };
      ir[this.item.id] = {...this.interoperabilityLink, selected};
      this.$emit('update:interoperabilityLinks', ir);
    },
    linkChangeHandler (link) {
      const ir = { ...this.interoperabilityLinks };
      ir[this.item.id] = {...this.interoperabilityLink, link};
      this.$emit('update:interoperabilityLinks', ir);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CheckboxAndLink {
    margin-bottom: 20px;

    .el-checkbox {
      padding-right: 30px;
      box-sizing: border-box;
      line-height: 19px;
      padding: 10px 0;

      .el-checkbox__input {
        vertical-align: top;
        top: 2px;
      }

      .el-checkbox__label {
        white-space: normal;
        padding-right: 30px;
      }
    }
  }
</style>
