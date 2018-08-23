<template>
  <div
    class="FilterItem"
    @click="setActiveItem">
    <el-row >
      <el-col :span="18">
        <div class="Header">
          {{ header }}
        </div>
        <div class="Bottom">
          <el-button
            v-show="!selected"
            type="text">
            Show all
          </el-button>
          <template v-if="selected">
            <span> {{ selected.length }} filter(s) selected </span>
            <el-button type="text">Clear</el-button>
          </template>
        </div>
      </el-col>
      <el-col :span="6">
        <fa
          v-show="active"
          icon="arrow-right"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    header: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: null
    },
    item: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      setDashboardFiltersDialogState: 'layout/setDashboardFiltersDialogState'
    }),
    setActiveItem () {
      this.setDashboardFiltersDialogState(this.item);
    }
  }
};
</script>

<style>

</style>
