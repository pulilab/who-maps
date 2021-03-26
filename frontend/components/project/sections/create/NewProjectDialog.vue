<template>
  <el-dialog
    title="Add new project"
    :visible.sync="visible"
  >
    <el-form :model="form">
      <el-form-item
        label="Promotion name"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="Zones"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.region"
          placeholder="Please select a zone"
        >
          <el-option
            label="Zone No.1"
            value="shanghai"
          />
          <el-option
            label="Zone No.2"
            value="beijing"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose(false)">Cancel</el-button>
      <el-button
        type="primary"
        @click="handleClose(false)"
      >Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
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
        // :to="localePath({name: 'organisation-projects-create', params: $route.params})"
        this.setFormDialog(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setFormDialog: 'project/SET_FORM_DIALOG'
    }),
    handleClose () {
      this.setFormDialog(false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
