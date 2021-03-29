<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
  >
    <p>
      Hi omnes lingua, institutis, legibus inter se differunt. Qui ipsorum
      lingua Celtae, nostra Galli appellantur. Ut enim ad minim veniam, quis
      nostrud exercitation. Fictum, deserunt mollit anim laborum astutumque!
      Donec sed odio operae, eu vulputate felis rhoncus.
    </p>
    <el-form>
      <el-form-item
        :rules="rules.name"
        :label="labels.name"
      >
        <el-input
          v-model="name"
          autocomplete="off"
          maxlength="128"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-button
          type="text"
          @click="handleClose(false)"
        >
          <translate>Cancel</translate>
        </el-button>
        <el-button
          type="warning"
          :loading="loading"
          :disabled="disabled"
          @click="handleSubmit(false)"
        >
          <translate>Complete registration</translate>
        </el-button>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      disabled: true,
      title: this.$gettext('Add new project'),
      labels: {
        name: this.$gettext('What is the project name?')
      },

      name: '',

      rules: {
        name: [
          {
            required: true,
            message: this.$gettext('Project name is required'),
            trigger: 'blur'
          },
          {
            min: 4,
            max: 180,
            message: this.$gettext(
              'Project name should be minimum 4 characters'
            ),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      openFormDialog: state => state.project.openFormDialog
    }),
    visible: {
      get () {
        return this.openFormDialog
      },
      set (value) {
        this.form = { name: '' }
        this.setFormDialog(value)
      }
    }
  },
  watch: {
    name (newValue) {
      newValue.length > 4 ? (this.disabled = false) : (this.disabled = true)
    }
  },
  methods: {
    ...mapMutations({
      setFormDialog: 'project/SET_FORM_DIALOG'
    }),
    handleClose () {
      this.setFormDialog(false)
    },
    async handleSubmit () {
      this.loading = true
      await new Promise(resolve => {
        setTimeout(() => {
          this.loading = false
          this.setFormDialog(false)
          resolve('Ready')
        }, 2000)
      })
      // :to="localePath({name: 'organisation-projects-create', params: $route.params})"
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

p {
  letter-spacing: 0;
  line-height: 21px;
  margin-bottom: 30px;
}
.el-button--warning {
  background-color: @colorBrandAccent;
  &:hover {
    background-color: lighten(@colorBrandAccent, 5%) loading();
  }
  .disabled();
}
::v-deep .el-dialog .el-dialog__footer {
  padding: 12px 12px 12px 35px;
}
</style>
