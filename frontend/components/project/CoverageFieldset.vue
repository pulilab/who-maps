<template>
  <div class="CoverageFieldset">
    <el-row
      :gutter="20"
      type="flex"
    >
      <el-col :span="8">
        <el-form-item label="# Health workers">
          <el-input
            :disabled="disabled"
            :value="healthWorkers"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitHealthWorkersChange" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="# Facilities">
          <el-input
            :disabled="disableFacilities"
            :value="facilitiesOrCount"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitFacilitiesChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="# Clients">
          <el-input
            :disabled="disabled"
            :value="clients"
            type="number"
            min="0"
            max="10000000"
            step="1"
            @change="emitClientsChange"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    healthWorkers: {
      type: [Number, String],
      default: null
    },
    clients: {
      type: [Number, String],
      default: null
    },
    facilities: {
      type: [Number, String],
      default: null
    },
    selectedFacilities: {
      type: Array,
      default: null
    }
  },
  computed: {
    disableFacilities () {
      return !!(this.disabled || this.selectedFacilities);
    },
    facilitiesOrCount () {
      if (this.selectedFacilities) {
        return this.selectedFacilities.length;
      }
      return this.facilities;
    }
  },
  methods: {
    emitHealthWorkersChange (value) {
      this.$emit('update:healthWorkers', value);
    },
    emitFacilitiesChange (value) {
      this.$emit('update:facilities', value);
    },
    emitClientsChange (value) {
      this.$emit('update:clients', value);
    }
  }
};
</script>

<style>

</style>
