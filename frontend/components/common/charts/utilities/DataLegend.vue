<template>
  <section :class="classRoot">
    <div
      v-for="item in items"
      :key="item.color"
    >
      <span
        class="color"
        :style="{ 'background-color': item.color }"
      />
      <span class="label">{{ item.label }}</span>
      <template v-if="!horizontal">
        <span class="dots" />
        <span class="value">{{ labelValue(item.value) }}</span>
      </template>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    percentage: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classRoot () {
      return { large: this.large, horizontal: this.horizontal }
    }
  },
  methods: {
    labelValue (value) {
      return `${value} ${this.percentage ? '%' : ''}`
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "~assets/style/variables.less";
@mixin flex($content) {
  display: flex;
  align-items: center;
  justify-content: $content;
}

section {
  margin: 15px 40px 65px;
  &.horizontal {
    @include flex(center);
    margin: -15px 0 15px 0;
    div {
      margin-right: 30px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  div {
    @include flex(space-between);
    margin-bottom: 15px;

    .label {
      max-width: 250px;
    }

    span {
      color: #404041;
      font-size: 12px;
      letter-spacing: 0;
      line-height: 20px;
    }
    .color {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 12px;
    }
    .dots {
      border: 1px dashed #d8d1c9;
      flex-grow: 1;
      // align-self: flex-end;
      margin: 0 12px 0px;
    }
    .value {
      font-weight: 700;
    }
  }
  &.large {
    margin: 15px 65px 65px;
    div {
      span {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
}
</style>
