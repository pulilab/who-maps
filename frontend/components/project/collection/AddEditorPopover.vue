<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    width="265"
    popper-class="EditorPopover"
  >
    <p>
      <translate>
        You are currently not logged in. If you wish to contribute, you need an active account.
      </translate>
    </p>
    <p>
      <translate>
        Please Signup or login before you use "Add me as editor" action.
      </translate>
    </p>
    <div style="text-align: right; margin: 0">
      <el-button type="warning" size="mini" @click="visible = false">OK</el-button>
    </div>
    <el-button
      slot="reference"
      type="primary"
      size="mini"
      class="editor"
    >
      <translate>
        Add me as editor
      </translate>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';

  .EditorPopover {
    p {
      text-align: left;
      font-size: @fontSizeSmall;
      word-break: normal;
      line-height: 18px;
    }

    .el-button--warning {
      background-color: @colorBrandRedNew;
    }
    .el-button--warning:hover {
      background-color: #d86422b3;
    }

    .editor {
      padding: 5px 10px;
      font-size: 11px;
      font-weight: normal;
    }
  }
</style>
