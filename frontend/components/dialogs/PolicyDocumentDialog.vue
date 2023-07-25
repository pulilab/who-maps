<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="$gettext('Health Policy document')"
    modal
    :show-close="true"
    top="10vh"
    width="80vw"
    @closed="close"
  >
    <div class="DocumentDialogBody">
      <h1>
        {{ policyDocument.title }}
      </h1>
      <p>
        {{ policyDocument.purpose }}
      </p>


    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      policyDocument: {},
    }
  },
  methods: {
    open(doc) {
      this.policyDocument = doc
      this.showDialog = true
    },
    close() {
      this.policyDocument = {}
    },
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

::v-deep .el-dialog {
  // height: 80vh;
  max-height: 80vh;
  max-width: 640px;
}

::v-deep .el-dialog__body {
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.DocumentDialogBody {
  max-height: calc(100% - 66px);
  padding: 1rem;

  h1 {
    font-size: 18px;
    line-height: 24px;
  }


}
</style>