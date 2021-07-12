<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select collection') | translate"
    popper-class="SelectorPopper"
    class="DonorSelector"
    @change="changeHandler"
  >
    <el-option
      v-for="collection in userCollections"
      :key="collection.id"
      :label="collection.name"
      :value="collection.url"
    />
  </lazy-el-select>
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
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      userCollections: 'system/getUserCollections'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .SelectorPopper {
    max-width: @advancedSearchWidth - 40px;
  }
</style>
