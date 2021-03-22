<template>
  <nav :class="{ sticky: sticky }">
    <p><translate>Table of Contents</translate></p>
    <ul>
      <li
        v-for="(item, i) in items"
        :key="item.id"
        :class="{ selected: item.id === selected }"
        @click="$emit('click', item.id)"
      >
        {{ `${item.prepend}. ${item.nav}` }}
      </li>
    </ul>
    <slot />
  </nav>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
nav {
  p {
    text-transform: uppercase;
    margin: 20px 0 0 0;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 14px;
    color: @colorTextMuted;
  }
  ul {
    padding: 0;
    margin: 30px 0 70px 15px;
    li {
      cursor: pointer;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 20px;
      color: @colorBrandPrimary;
      list-style: none;
      margin-bottom: 20px;
      // in case of overflow
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:last-child {
        margin-bottom: 0px;
      }
      &.selected {
        &::before {
          content: "\2014";
        }
        font-weight: 700;
        cursor: default;
        color: @colorTextPrimary;
      }
    }
  }
}
.sticky {
  position: sticky;
  top: 20px;
  z-index: 1;
}
</style>
