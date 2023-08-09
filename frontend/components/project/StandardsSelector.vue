<template>
  <el-checkbox-group
    :value="value"
    class="TwoPerRow"
    @input="changeHandler"
  >
    <div v-for="(group,i) in standardsGroups" :key="i" class="Group">
      <div class="name">{{ group.name }}</div>
      <div class="inputs">
        <el-checkbox
          v-for="standard in getStandards(group.standardIds)"
          :key="standard.id"
          :label="standard.id"
        >
          {{ standard.name }}
        </el-checkbox>
      </div>
      <tooltip :text="$gettext('Specify other digital health systems that ') | translate" />
    </div>
  </el-checkbox-group>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
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
  data() {
    return {
      standardsGroups: [
        {
          name: this.$gettext('Health Data Exchange Standards'),
          standardIds: [1,4,5,6,17,8,9,11,13,18,15,16]
        },
        {
          name: this.$gettext('Health Data Standardization'),
          standardIds: [28,21,27,30,22,31,26]
        },
        {
          name: this.$gettext('Demographic Data Standardization'),
          standardIds: [24,25,23]
        },
        {
          name: this.$gettext('Security & Privacy Standards'),
          standardIds: [2,3,12]
        },
        {
          name: this.$gettext('Technical Standards'),
          standardIds: [19,7,10,14,20,29]
        },
      ],
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
    getStandards(ids) {
      return this.standards.filter(s => ids.includes(s.id))
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
