<template>
  <el-tooltip :disabled="!toolTip" :content="toolTip" placement="top">
    <el-button type="text" class="copy-btn" @click="copyToClipboard">
      <transition name="el-fade-in">
        <fa v-if="copied" icon="check" />
        <fa v-else :icon="['far', 'copy']" size="lg" />
      </transition>
    </el-button>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    toolTip: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      copied: false
    }
  },
  computed: {
    tooltipContent () {
      return this.copied ? this.$gettext('Copied') : this.toolTip
    }
  },
  methods: {
    async copyToClipboard () {
      this.copied = true
      await navigator.clipboard.writeText(this.content)
      setTimeout(() => { this.copied = false }, 2500)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.copy-btn {
  padding: 4px;
  color: @colorBrandPrimary;
  cursor: pointer;
  :hover {
    color: @colorBrandPrimaryLight;
  }
  :active {
    transform: scale(.92);
  }
}

</style>
