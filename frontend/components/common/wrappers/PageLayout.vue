<template>
  <section :class="`${type} ${small && 'small'} page-layout`">
    <header v-if="header">
      <h2 v-if="$slots.title">
        <slot name="title" />
      </h2>
      <p><slot name="subtitle" /></p>
    </header>
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'transparent',
      validator (value) {
        return ['transparent', 'draft'].indexOf(value) !== -1
      }
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    header () {
      return this.$slots.title || this.$slots.subtitle
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';

.page-layout {
  padding: 40px;
  color: @colorTextPrimary;
  &.transparent {
    background-color: transparent;
  }
  &.draft {
    background-color: #fffbdc;
  }
  header {
    margin-bottom: 40px;
    h2,
    p {
      margin: 0;
      text-align: center;
    }
    h2 {
      font-size: 32px;
      letter-spacing: -1px;
      line-height: 24px;
      margin-bottom: 24px;
    }
    p {
      color: @colorTextSecondary;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 24px;
      margin: 0 100px;
    }
  }
  &.small {
    header {
      h2 {
        font-size: 27px;
      }
      p {
        font-size: 11px;
      }
    }
  }
}
</style>
