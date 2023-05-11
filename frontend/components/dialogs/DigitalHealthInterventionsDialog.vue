<template>
  <el-dialog
    :visible.sync="visible"
    :title="$gettext('Select Digital Health Intervention(s)') | translate"
    modal
    top="10vh"
    width="90vw"
    custom-class="SelectDHIDialog"
    @open="loadCurrentSelection"
  >
    <el-row type="flex" class="DHIMainCategories">
      <el-col
        v-for="category in digitalHealthInterventions"
        :key="category.name"
        :span="6"
      >
        <SelectorDialogColumn
          :header="category.name"
          expand-collapse
          @handleToggleExpand="handleToggleExpand"
        >
          <SelectorDialogCategory
            v-for="cat in category.subGroups"
            :key="cat.id"
            v-model="currentSelection"
            :category-selectable="true"
            :category="cat"
            child-name="strategies"
            :expand-collapse="expand.includes(category.name)"
          />
        </SelectorDialogColumn>
      </el-col>
    </el-row>

    <span slot="footer">
      <el-row type="flex" align="center">
        <el-col class="SecondaryButtons">
          <el-button type="text" class="CancelButton" @click="cancel">
            <translate>Cancel</translate>
          </el-button>
          <el-button type="text" class="DeleteButton" @click="clearAll">
            <translate>Clear All</translate>
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button type="primary" @click="apply">
            <translate>Confirm</translate>
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectorDialogColumn from './SelectorDialogColumn'
import SelectorDialogCategory from './SelectorDialogCategory'

export default {
  components: {
    SelectorDialogColumn,
    SelectorDialogCategory
  },
  data() {
    return {
      currentSelection: [],
      expand: []
    }
  },
  computed: {
    ...mapGetters({
      showDialog: 'layout/getDigitalHealthInterventionsDialogState',
      digitalHealthInterventions: 'projects/getDigitalHealthInterventions',
      dhis: 'project/getDHIs'
    }),
    visible: {
      get () {
        return this.showDialog
      },
      set () {
        this.setDialogState(false)
      }
    }
  },
  methods: {
    ...mapActions({
      setDialogState: 'layout/setDigitalHealthInterventionsDialogState',
      setDHIs: 'project/setDHIs'
    }),

    loadCurrentSelection() {
      this.currentSelection = [...this.dhis]
    },
    clearAll() {
      this.currentSelection = []
    },
    cancel() {
      this.setDialogState(false)
    },
    handleToggleExpand(category, expand) {
      if (this.expand.includes(category) && !expand) {
        this.expand = this.expand.filter((val) => val !== category)
      } else {
        if (expand) {
          this.expand = [...this.expand, category]
        }
      }
    },
    apply() {
      this.setDHIs([...this.currentSelection])
      this.setDialogState(false)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.SelectDHIDialog {
  max-width: @appWidthMaxLimit * 0.9;
  height: 80vh;
  margin-top: 0;
  margin-bottom: 0;

  .el-dialog__body {
    padding: 0;
    height: calc(80vh - (@dialogHeaderFooterHeight*2));
  }

  .DHIMainCategories {
    height: calc(80vh - (@dialogHeaderFooterHeight*2));

    > .el-col {
      overflow: hidden;
      border-right: 1px solid @colorGrayLight;

      .Main {
        .Item {
          .el-checkbox__label {
            font-size: @fontSizeSmall;
            line-height: 16px;
          }
        }
      }

      &:last-child {
        border: 0;

        .SelectorDialogColumn {
          .Header {
            width: calc(90vw / 4);
            max-width: calc((@appWidthMaxLimit * 0.9) / 4);
          }
        }
      }
    }
  }
}
</style>
