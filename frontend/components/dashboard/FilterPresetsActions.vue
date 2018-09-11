<template>
  <div class="FilterPresets">
    <el-row type="flex">
      <el-col :span="12">
        <el-popover
          :title="$gettext('My filters presets')"
          placement="bottom-center"
          popper-class="CustomPopover AdvancedSearchPresetsDropdown"
          trigger="click"
        >
          <el-button
            slot="reference"
            type="text"
            class="IconRight"
          >
            <translate>Load filters</translate>
            <fa icon="caret-down" />
          </el-button>
          <div class="CustomPopoverList">
            <ul>
              <li
                v-for="filter in savedFilters"
                :key="filter.name"
                :class="{'Active': isActive(filter.query)}"
                @click="applyPreset(filter.query)"
              >
                <fa icon="check" />
                {{ filter.name }}
              </li>
            </ul>
          </div>
        </el-popover>
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          size="small"
          @click="openSaveFilter"
        >
          <translate>Save</translate>
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          size="small"
          class="DeleteButton"
          @click="clear"
        >
          <translate>Clear</translate>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import isEqual from 'lodash/isEqual';
import { mapActions, mapGetters } from 'vuex';
import { queryStringComparisonParser } from '../../utilities/api.js';

export default {
  computed: {
    ...mapGetters({
      dashboardType: 'dashboard/getDashboardType',
      savedFilters: 'dashboard/getSavedFilters'
    })
  },
  methods: {
    ...mapActions({
      setSearchOptions: 'dashboard/setSearchOptions',
      setSaveFiltersDialogState: 'layout/setSaveFiltersDialogState'
    }),
    clear () {
      this.setSearchOptions({});
    },
    openSaveFilter () {
      this.setSaveFiltersDialogState(this.dashboardType);
    },
    isActive (query) {
      const fromRoute = queryStringComparisonParser(this.$route.query);
      const fromItem = queryStringComparisonParser(query);
      return isEqual(fromRoute, fromItem);
    },
    applyPreset (query) {
      this.setSearchOptions(query);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .FilterPresets {
    .el-col {
      // Selector
      &:nth-child(1) {
        width: 100%;
      }

      // Save
      &:nth-child(2) {
        width: auto;
        padding-left: 15px;
      }

      // Clear
      &:nth-child(3) {
        width: auto;
        padding-left: 15px;
      }
    }

    .el-button--text {
      padding: 0;
    }
  }

  .AdvancedSearchPresetsDropdown {
    transform: translate(-10px, -5px);
    max-width: @advancedSearchWidth - 30px;
  }
</style>
