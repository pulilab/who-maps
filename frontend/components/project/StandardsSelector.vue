<template>
  <el-checkbox-group
    :value="value"
    class="TwoPerRow"
    @input="changeHandler"
  >
    <div v-for="(group,i) in standards" :key="i" class="Group">
      <div class="name">{{ group.name }}</div>
      <div class="inputs">
        <el-checkbox
          v-for="standard in group.standards"
          :key="standard.id"
          :label="standard.id"
        >
          {{ standard.name }}
          <Tooltip :text="standard.description" />
        </el-checkbox>
      </div>
    </div>
  </el-checkbox-group>
</template>

<script>
import { mapGetters } from 'vuex'
import Tooltip from '@/components/dashboard/Tooltip'

export default {
  components: {
    Tooltip,
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      standards: 'projects/getInteroperabilityStandards'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    },
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TwoPerRow {
    display: flex;
    flex-wrap: wrap;
    row-gap: 16px;
    column-gap: 32px;

    .Group {
      padding: 8px 0;
      .name {
        padding-bottom: 4px;
        margin-bottom: 10px;
        font-size: @fontSizeBase;
        border-bottom: 1px solid @colorGrayLight;
      }
      .inputs {
        label {
          display: block;
          padding: 6px 0;
        }
      }
    }
  }
</style>
