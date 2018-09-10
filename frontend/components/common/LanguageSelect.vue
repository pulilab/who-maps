<template>
  <el-select
    :value="value"
    size="small"
    class="LanguageSelector"
    popper-class="LanguageSelectorPopper"
    placeholder="Select language"
    @change="changeHandler">
    <el-option
      v-for="language in languages"
      :key="language.code"
      :label="language.name"
      :value="language.code"/>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
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
      languages: 'system/getLanguages'
    })
  },
  methods: {
    changeHandler (value) {
      this.$emit('change', value);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .LanguageSelector {
    width: auto;
    margin: 4px 0 8px;
  }

  .LanguageSelectorPopper {}
</style>
