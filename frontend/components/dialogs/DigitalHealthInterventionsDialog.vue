<template>
  <el-dialog
    :visible.sync="visible"
    title="Select Digital Health Intervention(s)"
    modal
    top="10vh"
    width="90vw"
    custom-class="SelectDHIDialog"
    @open="loadCurrentSelection"
  >
    <el-row
      type="flex"
      class="DHIMainCategories">
      <el-col
        v-for="category in digitalHealthInterventions"
        :key="category.name"
        :span="6"
      >
        <selector-dialog-column
          :items="category.subGroups"
          v-model="currentSelection"
          :category-selectable="true"
          :header="category.name"
          child-name="strategies"
        />
      </el-col>
    </el-row>
    <span slot="footer">
      <el-row
        type="flex"
        align="center">
        <el-col class="SecondaryButtons">
          <el-button
            type="text"
            class="CancelButton"
            @click="cancel">
            Cancel
          </el-button>
          <el-button
            type="text"
            class="DeleteButton"
            @click="clearAll">
            Clear All
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button
            type="primary"
            @click="apply"
          >
            Confirm
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SelectorDialogColumn from './SelectorDialogColumn';

export default {
  components: {
    SelectorDialogColumn
  },
  data () {
    return {
      currentSelection: []
    };
  },
  computed: {
    ...mapGetters({
      selectedPlatform: 'layout/getDigitalHealthInterventionsDialogState',
      digitalHealthInterventions: 'projects/getDigitalHealthInterventions',
      selectedDHi: 'project/getDigitalHealthInterventions'
    }),
    savedSelection () {
      return this.selectedDHi.filter(dhi => dhi.platform === this.selectedPlatform).map(dhi => dhi.id);
    },
    visible: {
      get () {
        return this.selectedPlatform !== null;
      },
      set () {
        this.setDigitalHealthInterventionsDialogState(null);
      }
    }
  },
  methods: {
    ...mapActions({
      setDigitalHealthInterventionsDialogState: 'layout/setDigitalHealthInterventionsDialogState',
      setDigitalHealthInterventions: 'project/setDigitalHealthInterventions'
    }),

    loadCurrentSelection () {
      this.currentSelection = [...this.savedSelection];
    },
    clearAll () {
      this.currentSelection = [];
    },
    cancel () {
      this.setDigitalHealthInterventionsDialogState(null);
    },
    apply () {
      const selected = this.currentSelection.map(id => ({ platform: this.selectedPlatform, id }));
      const filtered = this.selectedDHi.filter(dhi => dhi.platform !== this.selectedPlatform);
      this.setDigitalHealthInterventions([...filtered, ...selected]);
      this.setDigitalHealthInterventionsDialogState(null);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .SelectDHIDialog {
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

        &:last-child {
          .SelectorDialogColumn {
            .Header {
              width: calc(90vw / 4);
            }
          }
        }
      }
    }
  }
</style>
