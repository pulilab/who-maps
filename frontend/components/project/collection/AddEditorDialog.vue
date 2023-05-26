<template>
  <el-dialog
    :visible.sync="shown"
    :title="dialogType"
    :loading="submitting"
    width="380px"
    :close-on-click-modal="true"
    :show-close="true"
    class="AddEditorDialog"
    :class="state"
  >
    <p>
      By confirming, you will become a co-author of this project, and can contribute to its quality and will be responsible for its completeness and accuracy.
    </p>
    <template #footer>
      <el-button v-if="state !== 'success' || submitting" @click="shown = false" plain type="info" class="btn">
        <translate key="cancel">
          Cancel
        </translate>
      </el-button>

      <el-button v-if="state === 'attention'" @click="addToProject" :loading="submitting" type="primary" class="btn">
        <translate key="editor">
          Add me as editor
        </translate>
      </el-button>
      <el-button v-else @click="goToProject" type="primary" class="btn">
        <translate key="projects">
          Go to ‘My Projects’
        </translate>
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      dialogTypes: {
        attention: this.$gettext('Warning!'),
        success: this.$gettext('Success!'),
        error: this.$gettext('Error!')
      },
      projectData: null,
      shown: false,
      state: 'attention', // or success or error
      submitting: false
    }
  },
  computed: {
    dialogType () {
      return this.dialogTypes[this.state]
    }
  },
  methods: {
    ...mapActions({
      addMeAsEditor: 'admin/import/addMeAsEditor'
    }),
    open (projectData) {
      this.projectData = projectData
      this.state = 'attention'
      this.shown = true
    },
    async addToProject () {
      try {
        this.submitting = true
        await this.addMeAsEditor(this.projectData)
        this.state = 'success'
        this.submitting = false
      } catch (error) {
        this.submitting = false
        console.error('addMeAsEditor', error)
      }
    },
    goToProject () {
      this.$router.push(this.localePath({ name: 'organisation-projects', params: this.$route.params, query: undefined }))
      this.shown = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~assets/style/variables.less";

  .AddEditorDialog {
    p {
      line-height: 21px;
    }

    ::v-deep .el-dialog__headerbtn i {
      color: silver;
      &:hover {
        color: gray;
      }
    }

    .btn {
      font-size: @fontSizeSmall;
      font-weight: normal;
      line-height: 10px;
    }

    ::v-deep .el-dialog__header {
      background-color: white;
      .el-dialog__title {
        font-size: @fontSizeLarge;
      }
    }

    &.attention {
      ::v-deep .el-dialog__title {
        color: @colorWarning;
      }
    }
    &.success {
      ::v-deep .el-dialog__title {
        color: @colorSuccess;
      }
    }
    &.error {
      ::v-deep .el-dialog__title {
        color: @colorDanger;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 0 30px;
      word-break: normal;
    }
    ::v-deep .el-dialog__footer {
      background-color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 16px;
    }

  }
</style>
